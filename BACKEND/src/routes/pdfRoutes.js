import express from 'express';
import { exec, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PdfReader } from "pdfreader";
import { GoogleGenAI } from "@google/genai";
import axios from 'axios'

import { singlePDFUpload, multiplePDFUpload, autoCleanupMiddleware, cleanupTemp } from '../middleware/Fileupload.js';
const router = express.Router();





// Get current file directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ai = new GoogleGenAI({ apiKey:process.env.GEMINI_API_KEY});

// Example route for single PDF upload
router.post('/upload-pdf', singlePDFUpload, async (req, res) => {

 
 
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
    }

    const { outputFormat, quality, preserveImages, preserveFormatting } = req.body;

    // File uploaded successfully
    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      mimetype: req.file.mimetype
    };

    console.log("Input file path:", req.file.path);


    const outputFilename = path.basename(req.file.filename, '.pdf') + '.docx';
    const outputDir = path.join(__dirname, '../../public/uploads/temp');
    const outputPath = path.join(outputDir, outputFilename);

    console.log("Output path:", outputPath);


    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }


    const pythonPath = path.join(__dirname, '../ENGINE/venv/Scripts/python');
    console.log("Python path:", pythonPath);

    const scriptPath = path.join(__dirname, '../ENGINE/Convert_pdf.py');
    console.log("Script path:", scriptPath);


    const qualityArg = quality || 'high';


    if (!fs.existsSync(req.file.path)) {
      return res.status(400).json({
        success: false,
        message: `Input file not found at path: ${req.file.path}`
      });
    }

    // Use spawn instead of exec for better handling of large outputs

   
      console.log(`Spawning python process with args: ["${scriptPath}", "${req.file.path}", "--output", "${outputPath}", "--quality", "${qualityArg}"]`);

      const pythonProcess = spawn(pythonPath, [
        scriptPath,
        req.file.path,
        '--output', outputPath,
        '--quality', qualityArg
      ]);

      let stdoutData = '';
      let stderrData = '';
      let hasResponded = false;


      const sendResponseOnce = (statusCode, responseData) => {
        if (!hasResponded) {
          hasResponded = true;
          res.status(statusCode).json(responseData);
        }
      };

      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
        // console.log(`Python stdout: ${data}`);
      });

      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
        // console.log(`Python stderr: ${data}`);

        // Check if the stderr contains warnings about scanned PDFs
        if (data.toString().includes("might be a scanned pdf")) {
          console.log("Detected scanned PDF warning, but continuing with conversion");
        }
      });

      pythonProcess.on('error', (error) => {
        // console.error(`Failed to start Python process: ${error.message}`);
        sendResponseOnce(500, {
          success: false,
          message: 'Failed to start conversion process',
          error: error.message
        });
      });

      pythonProcess.on('close', (code) => {
        // console.log(`Python process exited with code ${code}`);

        // Check if output file exists regardless of exit code
        if (fs.existsSync(outputPath)) {
          // File exists, consider it a success even if there were warnings
          const fileUrl = `${req.protocol}://${req.get('host')}/uploads/temp/${outputFilename}`;


          console.log(`Output file found at ${outputPath}, sending success response`);
          sendResponseOnce(200, {
            success: true,
            message: 'PDF converted to DOCX successfully',
            originalFile: fileInfo,
            convertedFile: {
              filename: outputFilename,
              path: outputPath,
              url: fileUrl
            },
            warnings: stderrData.includes("scanned pdf") ?
              "This appears to be a scanned PDF. The conversion may not include text content." : null

            
          });

          console.log(`Cleaning up temporary files: ${outputPath} and ${req.file.path}`);

          
          cleanupTemp(req.file.path);

          
        } else if (code !== 0) {
          
          console.error(`Python process failed with code ${code} and no output file was created`);
          sendResponseOnce(500, {
            success: false,
            message: `Python script exited with code ${code}`,
            stdout: stdoutData,
            stderr: stderrData
          });
        } else {
         
          console.error(`Python process completed successfully but no output file was found at ${outputPath}`);
          sendResponseOnce(500, {
            success: false,
            message: 'Conversion completed but output file not found',
            outputPath: outputPath,
            stdout: stdoutData,
            stderr: stderrData
          });
        }
      });

     
      const timeoutMs = 300000; // 5 minutes
      const timeoutId = setTimeout(() => {
        console.error(`Python process timed out after ${timeoutMs}ms`);

        // Kill the Python process
        try {
          pythonProcess.kill();
        } catch (killError) {
          console.error(`Error killing Python process: ${killError.message}`);
        }

        sendResponseOnce(500, {
          success: false,
          message: `Conversion timed out after ${timeoutMs / 1000} seconds`,
          stdout: stdoutData,
          stderr: stderrData
        });
      }, timeoutMs);

      // Clear the timeout when the process completes
      pythonProcess.on('close', () => {
        clearTimeout(timeoutId);
      });

    
    console.log("Python process started, waiting for completion");

  } catch (error) {
    console.error(`Error in upload-pdf route: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error processing PDF',
      error: error.message
    });
  }
});


router.post('/summarize',singlePDFUpload,async(req,res)=>{

  const extract=(pdfPath)=>{

    return new Promise((resolve, reject) => {
      let text = '';
      
      new PdfReader().parseFileItems(pdfPath, function (err, item) {
        if (err) {
          reject(err);
        } else if (!item) {
          // End of file, resolve the promise with the text
          console.log("PDF parsing done!");
          resolve(text);
        } else if (item.text) {
          text += item.text + " ";
        }
      });
    });

  }

  try{

    if(!req.file){
      return res.status(400).json({success:false,message:'No PDF file uploaded'});
    }

    const {summaryLength,focus}=req.body
     
    console.log("EXTRACTING FROM PDF...");
    const fullText = await extract(req.file.path)
    console.log(fullText)

    async function generate() {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Summarize ${fullText} in ${summaryLength}. Focus on ${focus}.`
      });
      
      return response.text;
    }

    const response = await generate();
    cleanupTemp(req.file.path)
    
    res.status(200).json({success:true,message:"PDF SUMMARIZED SUCCESFULLY",text:response})
    
    
    

   
    

  

    
  

  }
  catch(error){
    console.error(`Error in summarize route: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error processing PDF',
      error: error.message
    });
  }



})



router.post('/merge',multiplePDFUpload,async(req,res)=>{

  try{

    if (!req.files) {
      return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
    }

    if(req.files.length < 2) {
      return res.status(400).json({ success: false, message: 'At least two PDF files are required for merging' });
    }

    const {documentTitle,pageSize,orientation,qualityLevel}= req.body

    const outfileName = path.basename(documentTitle, '.pdf') + '_merged.pdf';
    const outputDir = path.join(__dirname, '../../public/uploads/temp');
    const outputPath = path.join(outputDir, outfileName);
    const inputFiles = req.files.map(file => file.path)
    const pythonPath = path.join(__dirname, '../ENGINE/venv/Scripts/python');
    const scriptPath = path.join(__dirname, '../ENGINE/Merge_pdf.py');

    const pythonArgs=[
       scriptPath,
      ...inputFiles,
      '--output', outputPath,
      '--page-size', pageSize,
      '--orientation', orientation,
      '--quality', qualityLevel
    ]

    console.log(`Spawning python process with args: ["${pythonPath}", "${pythonArgs.join('", "')}"]`);

     let stderrData='';
     let stdoutData='';
     let hasResponded = false;


    const sendResponseOnce = (statusCode, responseData) => {
      if (!hasResponded) {
        hasResponded = true;
        res.status(statusCode).json(responseData);
      }
    };


    const pythonProcess = spawn(pythonPath, pythonArgs);

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
      console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
      console.log(`Python stderr: ${data}`);
    });

    pythonProcess.on('error', (error) => {
      console.error(`Failed to start Python process: ${error.message}`);
      sendResponseOnce(500, {
        success: false,
        message: 'Failed to start merging process',
        error: error.message
      });
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);

       // Check if output file exists regardless of exit code
       if (fs.existsSync(outputPath)) {
        // Success - file exists
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/temp/${outfileName}`;
        
        console.log(`Merged PDF found at ${outputPath}, sending success response`);
        sendResponseOnce(200, {
          success: true,
          message: 'PDFs merged successfully',
          originalFiles: req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname
          })),
          mergedFile: {
            filename: outfileName,
            path: outputPath,
            url: fileUrl
          }
        });

        // Clean up input files
        inputFiles.forEach(filePath => {
          cleanupTemp(filePath);
        });
      }

      else if (code !== 0) {
        // Process failed
        console.error(`Python process failed with code ${code}`);
        sendResponseOnce(500, {
          success: false,
          message: `PDF merge failed with code ${code}`,
          stdout: stdoutData,
          stderr: stderrData
        });
        // Clean up input files on failure
        inputFiles.forEach(filePath => {
          cleanupTemp(filePath);
        });
      } 


      else {
        // Process succeeded but no output file
        console.error(`Python process completed but no output file found at ${outputPath}`);
        sendResponseOnce(500, {
          success: false,
          message: 'Merge completed but output file not found',
          outputPath: outputPath,
          stdout: stdoutData,
          stderr: stderrData
        });
        // Clean up input files on failure
        inputFiles.forEach(filePath => {
          cleanupTemp(filePath);
        });
      }
    });

    const timeoutMs = 300000; // 5 minutes
    const timeoutId = setTimeout(() => {
      console.error(`Python process timed out after ${timeoutMs}ms`);
      
      try {
        pythonProcess.kill();
      } catch (killError) {
        console.error(`Error killing Python process: ${killError.message}`);
      }
      
      sendResponseOnce(500, {
        success: false,
        message: `Merge operation timed out after ${timeoutMs / 1000} seconds`,
        stdout: stdoutData,
        stderr: stderrData
      });
    }, timeoutMs);

    // Clear timeout when process completes
    pythonProcess.on('close', () => {
      clearTimeout(timeoutId);
    });

      


      





  }
  catch(error)
  {
    console.error(`Error in merge route: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error processing PDF',
      error: error.message
    });
  }










})

export default router;
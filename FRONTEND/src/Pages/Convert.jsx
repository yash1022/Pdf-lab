import React, { useState } from 'react';
import api from '../../axiosconfig.js';

export default function Convert() {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [conversionOptions, setConversionOptions] = useState({
    outputFormat: 'docx',
    quality: 'high',
    preserveImages: true,
    preserveFormatting: true
  });

  // Handle file selection
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      setIsComplete(false);
    } else {
      setFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  // Handle drop event
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const droppedFile = event.dataTransfer.files[0];
    
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
      setIsComplete(false);
    } else {
      setError('Please drop a valid PDF file.');
    }
  };

  // Handle drag events
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Handle option changes
  const handleOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConversionOptions({
      ...conversionOptions,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle conversion process
  const handleConvert = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsConverting(true);
    setError('');

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('outputFormat', conversionOptions.outputFormat);
    formData.append('quality', conversionOptions.quality);
    formData.append('preserveImages', conversionOptions.preserveImages);
    formData.append('preserveFormatting', conversionOptions.preserveFormatting);
   

    try {

      const result = await api.post('/pdf/upload-pdf',formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        }
      })

      console.log(result)
      if(result.status === 200) {
        setDownloadUrl(result.data.convertedFile.url);
        setFile(null)
        setIsComplete(true);
        setIsConverting(false);
        setError('');
      }
      else
      { console.log("error")
        setTimeout(() => {

          setError('')
          
        },2000);
        
        setError("Conversion falied")
      }
     
      
      
     
    } catch (error) {
      setIsConverting(false);
      setTimeout(() => {

      
        setError('')
        
      },4000);

      setError("Can not convert")

      console.log(error);
    }
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          PDF to Word Conversion
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Convert your PDF documents to editable Word files with high accuracy and formatting preservation.
        </p>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          {/* Upload Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Your PDF</h2>
            
            {/* Drop Zone */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'}`}
              onClick={() => document.getElementById('file-upload').click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleFileSelect}
              />
              
              {!file ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-700 font-medium mb-2">Drag & drop your PDF here</p>
                  <p className="text-gray-500 text-sm">or click to browse your files</p>
                  <p className="mt-2 text-xs text-gray-400">Maximum file size: 50MB</p>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-800 mb-1">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  <button 
                    className="mt-4 text-sm text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    Remove file
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 text-red-500 text-sm bg-red-50 p-3 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Conversion Options */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversion Options</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Output Format</label>
                <select
                  name="outputFormat"
                  value={conversionOptions.outputFormat}
                  onChange={handleOptionChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="docx">Word Document (.docx)</option>
                  <option value="doc">Word 97-2003 (.doc)</option>
                  <option value="rtf">Rich Text Format (.rtf)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Quality</label>
                <select
                  name="quality"
                  value={conversionOptions.quality}
                  onChange={handleOptionChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="high">High (Best accuracy)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="low">Low (Smaller file size)</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="preserveImages"
                    checked={conversionOptions.preserveImages}
                    onChange={handleOptionChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Preserve Images</span>
                </label>
                <p className="text-gray-500 text-sm mt-1 ml-6">Keep all images from the original PDF</p>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="preserveFormatting"
                    checked={conversionOptions.preserveFormatting}
                    onChange={handleOptionChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Preserve Formatting</span>
                </label>
                <p className="text-gray-500 text-sm mt-1 ml-6">Maintain fonts, layouts, and styles from the PDF</p>
              </div>
            </div>
          </div>

          {/* Convert Button */}
          <div className="p-6 flex justify-center">
            <button
              onClick={handleConvert}
              disabled={!file || isConverting}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                !file || isConverting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isConverting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Converting...
                </span>
              ) : (
                'Convert to Word'
              )}
            </button>
          </div>
        </div>

        {/* Result Section */}
        {isComplete && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Conversion Complete!</h2>
            <p className="text-center text-gray-600 mb-6">
              Your PDF has been successfully converted to {
                conversionOptions.outputFormat === 'docx' ? 'Word Document (.docx)' :
                conversionOptions.outputFormat === 'doc' ? 'Word 97-2003 (.doc)' :
                'Rich Text Format (.rtf)'
              }.
            </p>
            <div className="flex justify-center">
              <a
                href={downloadUrl}
                download={`${file ? file.name.replace('.pdf', '') : 'converted'}.${conversionOptions.outputFormat}`}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Converted File
              </a>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            PDF to Word Conversion Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">High Accuracy</h3>
              <p className="text-gray-600">
                Our advanced conversion algorithm ensures that text, layouts, and formatting are preserved with high fidelity.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Complete Layout Preservation</h3>
              <p className="text-gray-600">
                Tables, columns, images, and complex layouts are accurately translated to your Word document.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Secure Processing</h3>
              <p className="text-gray-600">
                Your files are converted securely and never stored permanently on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

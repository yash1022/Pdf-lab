import React, { useState, useEffect } from 'react';
import api from '../../axiosconfig';

const Summarize = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [focus, setFocus] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [txt,setTxt]=useState('');

 
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileSize(selectedFile.size);
      setError('');
    } else {
      setFile(null);
      setFileName('');
      setFileSize(0);
      setError('Please select a valid PDF file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file to summarize');
      return;
    }

    setIsLoading(true);
    setSummary(null);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('summaryLength', summaryLength);
    formData.append('focus', focus);

    try {
      // Replace with your actual API endpoint
      const response = await api.post('/pdf/summarize',formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        }
      })

     
      if(response.status===200)
      {
        setSummary(response.data.text)
        setFile(null);
        setIsLoading(false)
      }
      else
      {

        setTimeout(() => {
          setError('');
          
        },2000);

        setError("CAN NOT SUMMARIZE PDF");
        setIsLoading(false);

      }
    }
    catch(e)
    {
      setTimeout(() => {
        setError('')
      },2000);

      setError("CAN NOT SUMMARIZE");
      setIsLoading(false);
    }

      
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          AI-Powered PDF Summarization
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Upload your PDF document and our Gemini AI will analyze it to generate a comprehensive summary with key insights and main points.
        </p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Upload your PDF</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">PDF Document</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-yellow-500 transition-colors duration-200" onClick={() => document.getElementById('pdfUpload').click()}>
                <input
                  type="file"
                  id="pdfUpload"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                
                {!fileName ? (
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-500">Drag & drop your PDF here or click to browse</p>
                    <p className="text-gray-400 text-sm mt-2">Max file size: 20MB</p>
                  </div>
                ) : (
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-700 font-medium">{fileName}</p>
                    <p className="text-gray-500 text-sm mt-1">{formatFileSize(fileSize)}</p>
                    <button
                      type="button"
                      className="mt-4 text-sm text-yellow-600 hover:text-yellow-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setFileName('');
                        setFileSize(0);
                        document.getElementById('pdfUpload').value = '';
                      }}
                    >
                      Remove file
                    </button>
                  </div>
                )}
              </div>
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Summary Length</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={summaryLength}
                  onChange={(e) => setSummaryLength(e.target.value)}
                >
                  <option value="short">Short (concise key points)</option>
                  <option value="medium">Medium (balanced overview)</option>
                  <option value="long">Long (comprehensive details)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Focus Area</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                >
                  <option value="general">General Summary</option>
                  <option value="business">Business Insights</option>
                  <option value="technical">Technical Information</option>
                  <option value="research">Research Findings</option>
                </select>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className={`px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading || !file}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing with Gemini AI...
                  </span>
                ) : (
                  'Summarize with Gemini AI'
                )}
              </button>
            </div>
          </form>
        </div>

        {summary && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Generated Summary</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  // Copy summary to clipboard functionality
                  navigator.clipboard.writeText(summary);
                  alert('Summary copied to clipboard!');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {summary.keyPoints && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Key Points</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {summary.keyPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Summary</h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {summary}
                </div>
              </div>
              
              <div className="mt-6 text-xs text-gray-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Generated in {summary.processingTime} seconds using Gemini AI
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summarize;
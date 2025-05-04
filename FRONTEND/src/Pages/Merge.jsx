import React, { useState, useEffect } from 'react';
import api from '../../axiosconfig';  

const Merge = () => {
  const [files, setFiles] = useState([]);
  const [mergeOptions, setMergeOptions] = useState({
    documentTitle: '',
    pageSize: 'original',
    orientation: 'auto',
    qualityLevel: 'standard'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  // Handle file upload
  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const pdfFiles = uploadedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== uploadedFiles.length) {
      setError('Only PDF files are supported. Some files were skipped.');
    } else {
      setError('');
    }

    // Convert files to objects with id and preview URL
    const newFiles = pdfFiles.map((file, index) => {
      return {
        id: `pdf-${Date.now()}-${index}`,
        file: file,
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file)
      };
    });

    setFiles([...files, ...newFiles]);
  };

  // Handle file removal
  const removeFile = (id) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMergeOptions({
      ...mergeOptions,
      [name]: value
    });
  };

  // Handle merge process
  const handleMerge = async (e) => {
    e.preventDefault();
    
    if (files.length < 2) {
      setError('Please upload at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Create FormData for file upload
    const formData = new FormData();
    files.forEach((fileObj, index) => {
      formData.append('files', fileObj.file);
    });
    
    formData.append('documentTitle', mergeOptions.documentTitle);
    formData.append('pageSize', mergeOptions.pageSize);
    formData.append('orientation', mergeOptions.orientation);
    formData.append('qualityLevel', mergeOptions.qualityLevel);

    
    try {
     const response = await api.post('/pdf/merge',formData,{
      headers:{
        'Content-Type':'multipart/form-data'
      }
     })

     if(response.status===200)
     {
     setDownloadUrl(response.data.mergedFile.url);
     setIsProcessing(false);
     setIsComplete(true);
     setFiles([]); // Clear files after successful merge
     }
     
    } catch (error) {
      setIsProcessing(false);
      setError('An error occurred while merging your PDFs. Please try again.');
      console.error(error);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Merge PDF Files
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Combine multiple PDF documents into a single file. Upload your files and merge them in sequence.
        </p>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          {/* Upload Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload PDF Files</h2>
            
            {/* Drag and Drop Area */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer"
              onClick={() => document.getElementById('pdf-upload').click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const items = e.dataTransfer.items;
                const files = [];
                for (let i = 0; i < items.length; i++) {
                  if (items[i].kind === 'file') {
                    const file = items[i].getAsFile();
                    if (file.type === 'application/pdf') {
                      files.push(file);
                    }
                  }
                }
                if (files.length > 0) {
                  handleFileUpload({ target: { files } });
                }
              }}
            >
              <input
                type="file"
                id="pdf-upload"
                className="hidden"
                multiple
                accept=".pdf"
                onChange={handleFileUpload}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-700 font-medium mb-2">Drag & drop PDF files here</p>
              <p className="text-gray-500 text-sm">or click to browse your files</p>
              <p className="mt-2 text-xs text-gray-400">Maximum file size: 50MB per PDF</p>
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

          {/* Files List Section */}
          {files.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your PDF Files</h2>
              <p className="text-gray-600 text-sm mb-4">Files will be merged in the order listed below.</p>
              
              <ul className="space-y-3">
                {files.map((file, index) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium text-gray-800 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm mr-3">{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Merge Options */}
          {files.length > 0 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Merge Options</h2>
              
              <form onSubmit={handleMerge}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Document Title</label>
                    <input
                      type="text"
                      name="documentTitle"
                      value={mergeOptions.documentTitle}
                      onChange={handleInputChange}
                      placeholder="Enter a title for your merged PDF"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Page Size</label>
                    <select
                      name="pageSize"
                      value={mergeOptions.pageSize}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="original">Original (Keep source page sizes)</option>
                      <option value="a4">A4</option>
                      <option value="letter">Letter</option>
                      <option value="legal">Legal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Orientation</label>
                    <select
                      name="orientation"
                      value={mergeOptions.orientation}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="auto">Auto (Use source orientation)</option>
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Quality Level</label>
                    <select
                      name="qualityLevel"
                      value={mergeOptions.qualityLevel}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="high">High (Larger file size)</option>
                      <option value="standard">Standard (Recommended)</option>
                      <option value="low">Low (Smaller file size)</option>
                    </select>
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isProcessing || files.length < 2}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Merging PDFs...
                      </span>
                    ) : (
                      'Merge PDFs'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
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
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Merge Complete!</h2>
            <p className="text-center text-gray-600 mb-6">
              Your PDFs have been successfully merged into a single document.
            </p>
            <div className="flex justify-center">
              <a
                href={downloadUrl}
                download="merged-document.pdf"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Merged PDF
              </a>
            </div>
          </div>
        )}

        {/* Features and Benefits Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            PDF Merge Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Simple Organization</h3>
              <p className="text-gray-600">
                Upload multiple PDF files and merge them in the order they appear in the list.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Customizable Options</h3>
              <p className="text-gray-600">
                Control page size, orientation, and quality settings to get exactly the merged PDF you need.
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
                Your files are processed securely and never stored permanently on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merge;

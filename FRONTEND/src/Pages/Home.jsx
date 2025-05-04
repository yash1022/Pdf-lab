import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Powerful PDF Tools at Your Fingertips
              </h1>
              <p className="text-lg text-gray-300">
                Simplify your document workflow with our intuitive PDF management solution. 
                Merge, convert, organize, and manage your PDFs with ease.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {/* <Link to={"/merge"}></Link> */}
                <a 
                  
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors duration-200"
                >
                  Merge PDFs Now
                </a>
                <a 
                  href="/convert" 
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors duration-200"
                >
                  Convert PDFs
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-full h-full bg-blue-500 rounded-lg transform rotate-3"></div>
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-purple-500 rounded-lg transform -rotate-3"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-xl">
                  <img 
                    src="C:\Users\dyash\OneDrive\Desktop\Pdf-lab\FRONTEND\src\Pages\pdf.svg" 
                    alt="PDF Document Illustration" 
                    className="w-full h-auto"
                    
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Everything You Need for PDF Management
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Merge PDFs</h3>
              <p className="text-gray-600">
                Combine multiple PDF files into a single document with our intuitive merging tool.
              </p>
            </div>
            
            {/* Feature 2 - PDF Conversion */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Convert PDFs</h3>
              <p className="text-gray-600">
                Convert PDFs to and from various formats including Word, Excel, images, and more.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Organize Pages</h3>
              <p className="text-gray-600">
                Rearrange, delete, or add pages to create the perfect document structure.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">AI Summarization</h3>
              <p className="text-gray-600">
                Extract key insights from your PDFs with our Gemini-powered AI summarization tool.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Conversion Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-teal-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute -top-4 -left-4 w-full h-full bg-green-200 rounded-lg transform -rotate-2"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-xl">
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-800">Document_Conversion.pdf</h3>
                      <p className="text-xs text-gray-500">Convert between multiple formats</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-medium text-gray-700">Supported Conversions:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-green-50 p-2 rounded flex items-center">
                      <span className="font-medium">PDF to Word</span>
                    </div>
                    <div className="bg-green-50 p-2 rounded flex items-center">
                      <span className="font-medium">PDF to Excel</span>
                    </div>
                    <div className="bg-green-50 p-2 rounded flex items-center">
                      <span className="font-medium">PDF to Images</span>
                    </div>
                    <div className="bg-green-50 p-2 rounded flex items-center">
                      <span className="font-medium">Word to PDF</span>
                    </div>
                    <div className="bg-green-50 p-2 rounded flex items-center">
                      <span className="font-medium">Images to PDF</span>
                    </div>
                    <div className="bg-green-50 p-2 rounded flex items-center">
                      <span className="font-medium">HTML to PDF</span>
                    </div>
                  </div>
                  <div className="pt-3 text-xs text-gray-500 italic">
                    All conversions maintain document formatting and quality
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Convert PDFs to Any Format</h2>
              <p className="text-gray-600 mb-6">
                Our powerful conversion engine lets you transform PDFs to and from various formats while 
                preserving layout, formatting, and content accuracy. Get high-quality conversions for all your document needs.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Convert to editable formats like Word and Excel</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Transform images to searchable PDF documents</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Batch process multiple files at once</p>
                </div>
              </div>
              <div className="mt-8">
                <a 
                  href="/convert" 
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
                >
                  Start Converting
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to streamline your PDF workflow?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of users who trust PDF Lab for their document management needs.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a 
              href="/register" 
              className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors duration-200"
            >
              Get Started for Free
            </a>
            <a 
              href="/merge" 
              className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 rounded-lg font-semibold transition-colors duration-200"
            >
              Try PDF Merging
            </a>
            <a 
              href="/convert" 
              className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors duration-200"
            >
              Convert PDFs
            </a>
          </div>
        </div>
      </section>

      {/* Gemini AI Summary Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Unlock Document Insights with AI</h2>
              <p className="text-gray-600 mb-6">
                Our advanced Gemini-powered AI technology analyzes your PDF documents and generates concise, 
                accurate summaries in seconds. Save time and extract key information without reading lengthy documents.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Extracts key points and main ideas from long documents</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Supports multiple languages and technical content</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Customizable summary length and focus areas</p>
                </div>
              </div>
              <div className="mt-8">
                <a 
                  href="/summarize" 
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
                >
                  Try AI Summarization
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-full h-full bg-yellow-200 rounded-lg transform rotate-2"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-xl">
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-800">Financial_Report_2024.pdf</h3>
                      <p className="text-xs text-gray-500">42 pages · Summarized with Gemini AI</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-medium text-gray-700">Key Points:</p>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>• Q1 revenue exceeded projections by 12%, reaching $4.2M</p>
                    <p>• Operating costs reduced by 8% through new automation systems</p>
                    <p>• European market growth accelerated to 24% year-over-year</p>
                    <p>• New product line projected to account for 15% of revenue in Q2</p>
                    <p>• Board approved expansion into Asian markets starting Q3</p>
                  </div>
                  <div className="pt-3 text-xs text-gray-500 italic">
                    Summary generated in 4.2 seconds using Gemini AI technology
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial/Info Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Why Choose PDF Lab</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Simple, intuitive interface designed for users of all skill levels</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Fast processing with our optimized PDF engine</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Secure handling of your documents with privacy-first approach</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Cross-platform compatibility for all your devices</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <blockquote className="text-gray-700 italic">
                "PDF Lab has completely transformed how our team handles document management. The merging tool alone has saved us countless hours of work."
              </blockquote>
              <div className="mt-4 flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div className="ml-4">
                  <p className="text-gray-800 font-semibold">Sarah Johnson</p>
                  <p className="text-gray-500 text-sm">Project Manager, TechCorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} PDF Lab. All rights reserved.</p>
            <div className="mt-4 space-x-4">
              <a href="/terms" className="hover:text-white">Terms of Service</a>
              <a href="/privacy" className="hover:text-white">Privacy Policy</a>
              <a href="/contact" className="hover:text-white">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
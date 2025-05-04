#!/usr/bin/env python3
"""
PDF Merger Tool

This script merges multiple PDF files into a single PDF document.
Usage: python Merge_pdf.py input1.pdf input2.pdf ... --output merged.pdf
         [--page-size original|a4|letter] [--orientation auto|portrait|landscape] [--quality standard|high|low]
"""

import os
import sys
import argparse
from pypdf import PdfWriter, PdfReader
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] %(message)s"
)

def merge_pdfs(input_files, output_file, page_size='original', orientation='auto', quality_level='standard'):
    """
    Merge multiple PDF files into a single PDF document.
    
    Args:
        input_files (list): List of input PDF file paths
        output_file (str): Path to save the merged PDF
        page_size (str): Page size for output ('original', 'a4', 'letter')
        orientation (str): Page orientation ('auto', 'portrait', 'landscape')
        quality_level (str): Quality level for output ('standard', 'high', 'low')
    
    Returns:
        bool: True if successful, False otherwise
    """
    if not input_files:
        logging.error("No input files provided")
        return False
    
    # Check if all input files exist
    for file_path in input_files:
        if not os.path.exists(file_path):
            logging.error(f"Input file not found: {file_path}")
            return False
    
    try:
        merger = PdfWriter()
        
        # Add each PDF to the merger
        for pdf_file in input_files:
            logging.info(f"Adding {pdf_file} to merger")
            try:
                # Read each PDF file
                reader = PdfReader(pdf_file)
                
                # Apply page size and orientation if not original
                if page_size != 'original' or orientation != 'auto':
                    for page in reader.pages:
                        # Apply custom page size if specified
                        if page_size != 'original':
                            if page_size == 'a4':
                                width, height = 595, 842  # A4 dimensions in points
                            elif page_size == 'letter':
                                width, height = 612, 792  # Letter dimensions in points
                            
                            # Apply orientation if specified
                            if orientation == 'landscape':
                                width, height = height, width
                            elif orientation == 'auto':
                                # Keep original orientation based on page dimensions
                                if page.mediabox.width > page.mediabox.height:
                                    width, height = height, width
                            
                            # Adjust page size
                            page.mediabox.upper_right = (width, height)
                
                # Add the PDF to the merger
                merger.append(reader)
                
            except Exception as e:
                logging.error(f"Error adding {pdf_file}: {str(e)}")
                return False
        
        # Create output directory if it doesn't exist
        output_dir = os.path.dirname(output_file)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        # Note: set_compression is not available in pypdf (only in older PyPDF2)
        # Instead, we'll just log the quality level for informational purposes
        logging.info(f"Using quality level: {quality_level} (note: compression not adjustable in current library)")
        
        # Write to output file
        logging.info(f"Writing merged PDF to {output_file} (page_size: {page_size}, orientation: {orientation}, quality: {quality_level})")
        with open(output_file, "wb") as output_stream:
            merger.write(output_stream)
        merger.close()
        
        if os.path.exists(output_file):
            logging.info(f"Successfully created merged PDF: {output_file}")
            return True
        else:
            logging.error(f"Failed to create output file")
            return False
            
    except Exception as e:
        logging.error(f"Error merging PDFs: {str(e)}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Merge multiple PDF files into one PDF')
    parser.add_argument('input_files', nargs='+', help='Input PDF files to merge')
    parser.add_argument('--output', '-o', required=True, help='Output PDF file path')
    parser.add_argument('--page-size', choices=['original', 'a4', 'letter'], default='original',
                        help='Page size for the output PDF')
    parser.add_argument('--orientation', choices=['auto', 'portrait', 'landscape'], default='auto',
                        help='Page orientation for the output PDF')
    parser.add_argument('--quality', choices=['standard', 'high', 'low'], default='standard',
                        help='Quality level for the output PDF')
    
    args = parser.parse_args()
    
    success = merge_pdfs(
        args.input_files, 
        args.output,
        page_size=args.page_size,
        orientation=args.orientation,
        quality_level=args.quality
    )
    
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()


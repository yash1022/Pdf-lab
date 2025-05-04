
import os
import logging
from pdf2docx import Converter
from typing import Dict, Any, Optional


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('convert_pdf')

def convert_pdf_to_docx(
    pdf_path: str,
    output_path: Optional[str] = None,
    pages: Optional[tuple] = None,
    start: int = 0,
    end: int = None,
    quality: str = 'high'
) -> Dict[str, Any]:
    
    try:
        # Validate input file exists
        if not os.path.exists(pdf_path):
            return {
                'success': False,
                'message': f'Input file not found: {pdf_path}'
            }
            
        # Create output path if not provided
        if output_path is None:
            output_path = os.path.splitext(pdf_path)[0] + '.docx'

        # Create output directory if it doesn't exist
        output_dir = os.path.dirname(output_path)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Set conversion parameters based on quality
        conversion_params = {}
        if quality == 'high':
            # Higher quality but slower
            conversion_params = {
                'optimize_text': True, 
                'multi_processing': True,
                'ignore_images': False,
                'debug': False
            }
        elif quality == 'medium':
            # Balanced settings
            conversion_params = {
                'optimize_text': True,
                'multi_processing': True,
                'ignore_images': False,
                'debug': False
            }
        else:  # low quality
            # Faster conversion but might lose accuracy
            conversion_params = {
                'optimize_text': False,
                'multi_processing': True,
                'ignore_images': True,
                'debug': False
            }

        logger.info(f"Converting PDF to DOCX: {pdf_path} -> {output_path}")
        logger.info(f"Quality setting: {quality}")
        
        # Initialize converter
        cv = Converter(pdf_path)
        
        # Convert PDF to DOCX
        if pages:
            cv.convert(output_path, pages=pages, **conversion_params)
        else:
            cv.convert(output_path, start=start, end=end, **conversion_params)
            
        # Close the converter
        cv.close()
        
        # Check if output file was created
        if os.path.exists(output_path):
            logger.info(f"Conversion completed successfully: {output_path}")
            return {
                'success': True,
                'output_file': output_path,
                'message': 'PDF converted to DOCX successfully'
            }
        else:
            logger.error(f"Output file not created: {output_path}")
            return {
                'success': False,
                'message': 'Conversion failed: Output file not created'
            }
    
    except Exception as e:
        logger.error(f"Error converting PDF to DOCX: {str(e)}", exc_info=True)
        return {
            'success': False,
            'message': f'Conversion error: {str(e)}'
        }

def main():
    """
    Example usage when run directly as a script
    """
    import argparse
    
    parser = argparse.ArgumentParser(description='Convert PDF to DOCX')
    parser.add_argument('input_file', help='Input PDF file path')
    parser.add_argument('--output', '-o', help='Output DOCX file path')
    parser.add_argument('--start', '-s', type=int, default=0, help='Start page (0-based index)')
    parser.add_argument('--end', '-e', type=int, default=None, help='End page (0-based index)')
    parser.add_argument('--quality', '-q', choices=['high', 'medium', 'low'], 
                        default='high', help='Conversion quality')
    
    args = parser.parse_args()
    
    result = convert_pdf_to_docx(
        args.input_file,
        output_path=args.output,
        start=args.start,
        end=args.end,
        quality=args.quality
    )
    
    if result['success']:
        print(f"Success! Output file: {result['output_file']}")
    else:
        print(f"Error: {result['message']}")

if __name__ == "__main__":
    main()
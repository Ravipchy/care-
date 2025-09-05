import os
import json
import html
import re
import pandas as pd
from datetime import date
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .models import ConversionJob
from .extraction_logic import (
    extract_title, extract_description, extract_toc, 
    extract_methodology_from_faqschema, extract_seo_title,
    extract_breadcrumb_text, extract_sku_code, extract_sku_url,
    extract_breadcrumb_schema, extract_faq_schema,
    extract_meta_description, extract_report_coverage_table_with_style,
    merge_description_and_coverage, split_into_excel_cells
)
import threading
import time

@csrf_exempt
@require_http_methods(["POST"])
def convert_word_to_excel(request):
    """Handle file upload and start conversion process"""
    if 'file' not in request.FILES:
        return JsonResponse({'error': 'No file provided'}, status=400)
    
    file = request.FILES['file']
    
    # Validate file type
    if not file.name.lower().endswith(('.doc', '.docx')):
        return JsonResponse({'error': 'Only .doc and .docx files are allowed'}, status=400)
    
    # Validate file size (20MB limit)
    if file.size > 20 * 1024 * 1024:
        return JsonResponse({'error': 'File size must be less than 20MB'}, status=400)
    
    # Create conversion job
    job = ConversionJob.objects.create(
        input_file=file,
        status='pending',
        message='File uploaded successfully'
    )
    
    # Start conversion in background thread
    thread = threading.Thread(target=process_conversion, args=(job.id,))
    thread.daemon = True
    thread.start()
    
    return JsonResponse({'jobId': str(job.id)})

def process_conversion(job_id):
    """Process the conversion in background"""
    try:
        job = ConversionJob.objects.get(id=job_id)
        job.status = 'processing'
        job.progress = 10
        job.message = 'Starting conversion...'
        job.save()
        
        # Get file path
        file_path = job.input_file.path
        
        # Update progress
        job.progress = 20
        job.message = 'Extracting data from document...'
        job.save()
        
        # Extract data using your Python code
        title = extract_title(file_path)
        
        job.progress = 40
        job.message = 'Processing description...'
        job.save()
        
        description_html = extract_description(file_path)
        toc = extract_toc(file_path)
        methodology = extract_methodology_from_faqschema(file_path)
        seo_title = extract_seo_title(file_path)
        breadcrumb_text = extract_breadcrumb_text(file_path)
        skucode = extract_sku_code(file_path)
        urlrp = extract_sku_url(file_path)
        breadcrumb_schema = extract_breadcrumb_schema(file_path)
        meta = extract_meta_description(file_path)
        schema2 = extract_faq_schema(file_path)
        report = extract_report_coverage_table_with_style(file_path)
        merge = merge_description_and_coverage(file_path)
        chunks = split_into_excel_cells(merge)
        
        job.progress = 70
        job.message = 'Creating Excel file...'
        job.save()
        
        # Create Excel file
        row_data = {
            "File": os.path.basename(file_path),
            "Title": title,
            "Description": description_html,
            "TOC": toc,
            "Segmentation": "<p>.</p>",
            "Methodology": methodology,
            "Publish_Date": date.today().strftime("%B %Y"),
            "Currency": "USD",
            "Single Price": 4485,
            "Corporate Price": 6449,
            "skucode": skucode,
            "Total Page": "",
            "Date": date.today().strftime("%Y-%m-%d"),
            "urlNp": urlrp,
            "Meta Discription": meta,
            "Meta Keys": "",
            "Base Year": "2024",
            "history": "2019-2023",
            "Enterprise Price": 8339,
            "SEOTITLE": seo_title,
            "BreadCrumb Text": breadcrumb_text,
            "Schema 1": breadcrumb_schema,
            "Schema 2": schema2,
            "Report": report,
            "Discription": merge
        }
        
        # Add description chunks
        for i, chunk in enumerate(chunks, start=1):
            row_data[f"Discription_Part{i}"] = chunk
        
        # Create DataFrame and save to Excel
        df = pd.DataFrame([row_data])
        
        job.progress = 90
        job.message = 'Saving Excel file...'
        job.save()
        
        # Save Excel file
        excel_content = ContentFile(b'')
        df.to_excel(excel_content, index=False)
        excel_content.seek(0)
        
        # Save the file to the job
        filename = f"converted_{job.id}.xlsx"
        job.output_file.save(filename, excel_content, save=True)
        
        job.progress = 100
        job.status = 'done'
        job.message = 'Conversion completed successfully!'
        job.save()
        
    except Exception as e:
        job = ConversionJob.objects.get(id=job_id)
        job.status = 'error'
        job.message = f'Conversion failed: {str(e)}'
        job.save()

@require_http_methods(["GET"])
def get_status(request, job_id):
    """Get conversion status"""
    try:
        job = ConversionJob.objects.get(id=job_id)
        return JsonResponse({
            'status': job.status,
            'progress': job.progress,
            'message': job.message
        })
    except ConversionJob.DoesNotExist:
        return JsonResponse({'error': 'Job not found'}, status=404)

@require_http_methods(["GET"])
def download_file(request, job_id):
    """Download the converted Excel file"""
    try:
        job = ConversionJob.objects.get(id=job_id)
        if job.status != 'done' or not job.output_file:
            return JsonResponse({'error': 'File not ready'}, status=404)
        
        response = HttpResponse(
            job.output_file.read(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="converted_{job_id}.xlsx"'
        return response
    except ConversionJob.DoesNotExist:
        return JsonResponse({'error': 'Job not found'}, status=404)

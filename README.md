# Word to Excel Converter - Django Backend

This Django backend provides API endpoints for converting Word documents to Excel files using advanced extraction logic.

## Features

- **File Upload**: Accepts .doc and .docx files up to 20MB
- **Async Processing**: Background processing with status tracking
- **Advanced Extraction**: Extracts title, description, TOC, methodology, SEO data, and more
- **Excel Generation**: Creates comprehensive Excel files with all extracted data
- **Progress Tracking**: Real-time status updates during conversion

## API Endpoints

### 1. Upload and Start Conversion
```
POST http://localhost:8000/convert/word-to-excel
Content-Type: multipart/form-data

file: [Word document file]
```

**Response:**
```json
{
  "jobId": "12345"
}
```

### 2. Check Conversion Status
```
GET http://localhost:8000/status/{jobId}
```

**Response:**
```json
{
  "status": "pending|processing|done|error",
  "progress": 0-100,
  "message": "Status message"
}
```

### 3. Download Converted File
```
GET http://localhost:8000/download/{jobId}
```

**Response:** Excel file (.xlsx)

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Initialize Django:**
   ```bash
   python setup_django.py
   ```

3. **Start the Server:**
   ```bash
   python manage.py runserver
   ```

4. **Access Admin Panel:**
   - URL: http://localhost:8000/admin/
   - Username: admin
   - Password: admin123

## File Structure

```
care/
├── models.py              # Database models
├── views.py               # API endpoints
├── extraction_logic.py    # Word document processing logic
├── urls.py               # URL patterns
├── settings.py           # Django settings
├── requirements.txt      # Python dependencies
└── manage.py            # Django management script
```

## Extraction Features

The backend extracts the following data from Word documents:

- **Title**: Document title with year range
- **Description**: HTML formatted description
- **Table of Contents**: Structured TOC
- **Methodology**: FAQ-based methodology
- **SEO Data**: Title, meta description, breadcrumbs
- **Report Coverage**: Detailed coverage table
- **Schema Data**: JSON-LD structured data
- **Pricing**: Single, Corporate, Enterprise prices

## Error Handling

- File validation (type, size)
- Processing error recovery
- Status tracking for failed jobs
- Detailed error messages

## Frontend Integration

This backend is designed to work with the React frontend component (`pages/word-to-excel.tsx`) that provides:

- Drag-and-drop file upload
- Real-time progress tracking
- Theme toggle (light/dark)
- Auto-download on completion
- Responsive design

## Development

To run in development mode:

```bash
python manage.py runserver 0.0.0.0:8000
```

The server will be available at `http://localhost:8000`

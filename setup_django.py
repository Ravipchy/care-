#!/usr/bin/env python
"""
Setup script for Django backend
Run this to initialize the Django project
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_django():
    # Set Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'care.settings')
    django.setup()
    
    print("Setting up Django backend...")
    
    # Create migrations
    print("Creating migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    
    # Apply migrations
    print("Applying migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Create superuser (optional)
    print("Creating superuser...")
    try:
        from django.contrib.auth.models import User
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            print("Superuser created: admin/admin123")
        else:
            print("Superuser already exists")
    except Exception as e:
        print(f"Error creating superuser: {e}")
    
    print("Django setup complete!")
    print("Run 'python manage.py runserver' to start the server")

if __name__ == '__main__':
    setup_django()

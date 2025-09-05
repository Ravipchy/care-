from django.contrib import admin
from .models import ConversionJob

@admin.register(ConversionJob)
class ConversionJobAdmin(admin.ModelAdmin):
    list_display = ['id', 'status', 'progress', 'created_at', 'updated_at']
    list_filter = ['status', 'created_at']
    search_fields = ['id']
    readonly_fields = ['id', 'created_at', 'updated_at']

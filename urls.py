from django.urls import path
from . import views

urlpatterns = [
    path('convert/word-to-excel', views.convert_word_to_excel, name='convert_word_to_excel'),
    path('status/<uuid:job_id>', views.get_status, name='get_status'),
    path('download/<uuid:job_id>', views.download_file, name='download_file'),
]

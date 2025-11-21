from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # This connects the main project to your library app
    path('api/', include('library.urls')), 
]
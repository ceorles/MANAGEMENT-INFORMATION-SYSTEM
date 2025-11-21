from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import StudentSignupSerializer
from .models import Student

class StudentSignupView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSignupSerializer
    permission_classes = [AllowAny] # Allow anyone to sign up (no login required)
from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import StudentSignupSerializer, LibrarianSignupSerializer, MyTokenObtainPairSerializerStudent, MyTokenObtainPairSerializerLibrarian
from .models import Student, Librarian
from rest_framework_simplejwt.views import TokenObtainPairView

class StudentSignupView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSignupSerializer
    permission_classes = [AllowAny] # Allow anyone to sign up (no login required)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializerStudent

class LibrarianSignupView(generics.CreateAPIView):
    queryset = Librarian.objects.all()
    serializer_class = LibrarianSignupSerializer
    permission_classes = [AllowAny] # Allow registration without logging in

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializerLibrarian

# HTML Templates
# def login_page(request):
#     return render(request, 'library/login.html')

# def librarian_signup_page(request):
#     return render(request, 'library/signup.html')
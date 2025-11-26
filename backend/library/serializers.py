from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, Librarian, Book, BorrowRecord
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# Authentication
class StudentSignupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = Student
        fields = ['name', 'email', 'student_id', 'contact_number', 'sex', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "This email is already registered."})

        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('confirm_password') 
        email = validated_data.pop('email')
        name = validated_data.pop('name')

        user = User.objects.create_user(
            username=email, 
            email=email,
            password=password,
            first_name=name 
        )

        student = Student.objects.create(
            user=user,
            **validated_data 
        )

        return student

class MyTokenObtainPairSerializerStudent(TokenObtainPairSerializer):
    def validate(self, attrs):
        # 1. Generate the standard token (access & refresh)
        data = super().validate(attrs)

        # 2. Add custom data to the response
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['is_superuser'] = self.user.is_superuser

        # 3. Check if user is a Student and add that info
        try:
            data['student_id'] = self.user.student_profile.student_id
            data['role'] = 'student'
        except:
            data['role'] = 'admin' if self.user.is_superuser else 'user'

        return data

# Librarian
class LibrarianSignupSerializer(serializers.ModelSerializer):
    # Fields based on the Librarian Sign-Up image
    name = serializers.CharField(write_only=True)
    username = serializers.CharField(write_only=True) # Explicit username field
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = Librarian
        fields = ['name', 'username', 'email', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "This email is already registered."})
            
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "This username is already taken."})

        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('confirm_password') 
        email = validated_data.pop('email')
        username = validated_data.pop('username')
        name = validated_data.pop('name')

        # Create the Django User
        user = User.objects.create_user(
            username=username, 
            email=email,
            password=password,
            first_name=name 
        )

        # Create the Librarian profile linked to that user
        librarian = Librarian.objects.create(
            user=user
        )

        return librarian

class MyTokenObtainPairSerializerLibrarian(TokenObtainPairSerializer):
    def validate(self, attrs):
        # 1. Generate the standard token
        data = super().validate(attrs)

        # 2. Add custom data
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['is_superuser'] = self.user.is_superuser

        # 3. Determine Role (Student vs Librarian vs Admin)
        if hasattr(self.user, 'student_profile'):
            data['role'] = 'student'
            data['student_id'] = self.user.student_profile.student_id
        elif hasattr(self.user, 'librarian_profile'):
            data['role'] = 'librarian'
        else:
            data['role'] = 'admin' if self.user.is_superuser else 'user'

        return data
    
# Dashboard
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class StudentListSerializer(serializers.ModelSerializer):
    # For the Librarian to see member details
    name = serializers.CharField(source='user.first_name')
    email = serializers.CharField(source='user.email')

    class Meta:
        model = Student
        fields = ['student_id', 'name', 'email', 'contact_number', 'sex']

class BorrowRecordSerializer(serializers.ModelSerializer):
    # Nested info so the librarian sees Names instead of IDs
    student_name = serializers.CharField(source='student.user.first_name', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model = BorrowRecord
        fields = ['id', 'student_name', 'book_title', 'borrow_date', 'is_returned']
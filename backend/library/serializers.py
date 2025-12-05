from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, Librarian, Book, BorrowRecord
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# --- AUTHENTICATION ---
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
        student = Student.objects.create(user=user, **validated_data)
        return student

class LibrarianSignupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    username = serializers.CharField(write_only=True) 
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

        user = User.objects.create_user(
            username=username, 
            email=email,
            password=password,
            first_name=name 
        )
        librarian = Librarian.objects.create(user=user)
        return librarian

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['name'] = user.first_name
        token['username'] = user.username

        if hasattr(user, 'student_profile'):
            token['role'] = 'student'
            token['student_id'] = user.student_profile.student_id
        elif hasattr(user, 'librarian_profile'):
            token['role'] = 'librarian'
        else:
            token['role'] = 'admin'

        return token

class LibrarianProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(use_url=True, required=False)

    class Meta:
        model = Librarian
        fields = ['profile_picture']

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class StudentListSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.first_name')
    email = serializers.CharField(source='user.email', read_only=True) 
    password = serializers.CharField(write_only=True, required=False) 

    class Meta:
        model = Student
        fields = ['student_id', 'name', 'email', 'contact_number', 'sex', 'password']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        if 'first_name' in user_data:
            instance.user.first_name = user_data['first_name']
        
        password = validated_data.pop('password', None)
        if password:
            instance.user.set_password(password)
            
        instance.user.save()
        
        instance.student_id = validated_data.get('student_id', instance.student_id)
        instance.contact_number = validated_data.get('contact_number', instance.contact_number)
        instance.sex = validated_data.get('sex', instance.sex)
        instance.save()
        return instance

class BorrowRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.first_name', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_id = serializers.IntegerField(source='book.id', read_only=True)
    book_cover = serializers.ImageField(source='book.cover_image', read_only=True)
    book_synopsis = serializers.CharField(source='book.synopsis', read_only=True)
    book_category = serializers.CharField(source='book.category', read_only=True)

    class Meta:
        model = BorrowRecord
        fields = ['id', 'student_name', 'book_title', 'book_id', 'borrow_date', 'return_date', 'is_returned', 'book_cover', 'book_synopsis', 'status', 'book_category']
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # 1. Generate the standard token (access & refresh)
        data = super().validate(attrs)

        # 2. Add custom data to the response
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['is_superuser'] = self.user.is_superuser

        # 3. Check if user is a Student and add that info
        # We use try/except because Admins won't have a 'student_profile'
        try:
            data['student_id'] = self.user.student_profile.student_id
            data['role'] = 'student'
        except:
            data['role'] = 'admin' if self.user.is_superuser else 'user'

        return data
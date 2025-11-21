from django.db import models
from django.contrib.auth.models import User

class Student(models.Model):
    SEX_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]

    # Link this student to a login account
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    
    student_id = models.CharField(max_length=20, unique=True)
    contact_number = models.CharField(max_length=20)
    sex = models.CharField(max_length=10, choices=SEX_CHOICES)
    
    def __str__(self):
        return f"{self.student_id} - {self.user.first_name}"
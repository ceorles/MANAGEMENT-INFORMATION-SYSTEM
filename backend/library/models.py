from django.db import models
from django.contrib.auth.models import User

# Authentication
class Student(models.Model):
    SEX_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]

    # student login
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    
    student_id = models.CharField(max_length=20, unique=True)
    contact_number = models.CharField(max_length=20)
    sex = models.CharField(max_length=10, choices=SEX_CHOICES)
    
    def __str__(self):
        return f"{self.student_id} - {self.user.first_name}"
    
class Librarian(models.Model):
    # librarian login
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='librarian_profile')
    
    def __str__(self):
        return f"Librarian: {self.user.username}"
    
# Dashboard
class Book(models.Model):
    CATEGORY_CHOICES = [
        ('Academic', 'Academic/Educational'),
        ('Fiction', 'Fiction'),
        ('Non-Fiction', 'Non-Fiction'),
        ('Modern', 'Modern Literature'),
        ('Graphic', 'Graphic Literature'),
        ('Children', 'Children Books'),
    ]

    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    isbn = models.CharField(max_length=20, unique=True)
    quantity = models.IntegerField(default=1)
    
    # New Fields for the layout
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Fiction')
    synopsis = models.TextField(blank=True, null=True)
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True) # Requires Pillow

    def __str__(self):
        return self.title

class BorrowRecord(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrow_date = models.DateField(auto_now_add=True)
    is_returned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.user.username} borrowed {self.book.title}"

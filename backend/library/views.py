from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import StudentSignupSerializer, LibrarianSignupSerializer, MyTokenObtainPairSerializerStudent, MyTokenObtainPairSerializerLibrarian, BookSerializer, StudentListSerializer, BorrowRecordSerializer
from .models import Student, Librarian,  Book, BorrowRecord
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView

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

# Dashboard
# --- STUDENT VIEWS ---

class BookListView(generics.ListAPIView):
    # Allow students to see books
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

class BorrowBookView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        
        try:
            student = user.student_profile # Get the student profile of logged in user
            book = Book.objects.get(id=book_id)
            
            if book.quantity > 0:
                # Create record
                BorrowRecord.objects.create(student=student, book=book)
                # Decrease quantity
                book.quantity -= 1
                book.save()
                return Response({"message": "Book borrowed successfully!"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Book out of stock"}, status=status.HTTP_400_BAD_REQUEST)
                
        except Student.DoesNotExist:
            return Response({"error": "Only students can borrow books"}, status=status.HTTP_403_FORBIDDEN)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

# --- LIBRARIAN VIEWS ---

class MemberListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentListSerializer
    permission_classes = [permissions.IsAuthenticated]

class TransactionListView(generics.ListAPIView):
    queryset = BorrowRecord.objects.all().order_by('-borrow_date')
    serializer_class = BorrowRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import StudentSignupSerializer, LibrarianSignupSerializer, MyTokenObtainPairSerializerStudent, MyTokenObtainPairSerializerLibrarian, BookSerializer, StudentListSerializer, BorrowRecordSerializer
from .models import Student, Librarian, Book, BorrowRecord
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView

class StudentSignupView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSignupSerializer
    permission_classes = [AllowAny]

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializerStudent

class LibrarianSignupView(generics.CreateAPIView):
    queryset = Librarian.objects.all()
    serializer_class = LibrarianSignupSerializer
    permission_classes = [AllowAny]

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
    # basta books, tangina
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

class BorrowBookView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        
        try:
            student = user.student_profile
            book = Book.objects.get(id=book_id)
            
            if BorrowRecord.objects.filter(student=student, book=book, is_returned=False).exists():
                return Response({"error": "You have already borrowed this book. Please return it first."}, status=status.HTTP_400_BAD_REQUEST)

            if book.quantity > 0:
                BorrowRecord.objects.create(student=student, book=book)
                book.quantity -= 1
                book.save()
                return Response({"message": "Book borrowed successfully!"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Book out of stock"}, status=status.HTTP_400_BAD_REQUEST)
                
        except Student.DoesNotExist:
            return Response({"error": "Only students can borrow books"}, status=status.HTTP_403_FORBIDDEN)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)
        
class StudentBorrowedBooksView(generics.ListAPIView):
    serializer_class = BorrowRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only books that are NOT returned yet for this student
        return BorrowRecord.objects.filter(student=self.request.user.student_profile, is_returned=False)

class ReturnBookView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        record_id = request.data.get('record_id')
        try:
            record = BorrowRecord.objects.get(id=record_id, student=request.user.student_profile)
            
            if record.is_returned:
                return Response({"error": "Book already returned"}, status=status.HTTP_400_BAD_REQUEST)

            # Mark as returned
            record.is_returned = True
            record.save()

            # Increase Book Quantity
            record.book.quantity += 1
            record.book.save()

            return Response({"message": "Book returned successfully!"}, status=status.HTTP_200_OK)
        except BorrowRecord.DoesNotExist:
            return Response({"error": "Record not found"}, status=status.HTTP_404_NOT_FOUND)

class BookDetailView(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class RelatedBooksView(generics.ListAPIView):
    serializer_class = BookSerializer

    def get_queryset(self):
        category = self.request.query_params.get('category')
        book_id = self.request.query_params.get('book_id')
        return Book.objects.filter(category=category).exclude(id=book_id)[:4] # Limit to 4

# --- LIBRARIAN VIEWS ---

class MemberListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentListSerializer
    permission_classes = [permissions.IsAuthenticated]

class TransactionListView(generics.ListAPIView):
    queryset = BorrowRecord.objects.all().order_by('-borrow_date')
    serializer_class = BorrowRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

# Librarian
class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentListSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'student_id'

    # deleter
    def perform_destroy(self, instance):
        user = instance.user 
        user.delete()
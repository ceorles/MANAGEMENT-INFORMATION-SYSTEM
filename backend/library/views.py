from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth

from .models import Student, Librarian, Book, BorrowRecord
from .serializers import (
    StudentSignupSerializer, 
    LibrarianSignupSerializer, 
    MyTokenObtainPairSerializer,
    BookSerializer, 
    StudentListSerializer, 
    BorrowRecordSerializer, 
    LibrarianProfileSerializer 
)

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_books = Book.objects.count() 
        total_borrowed = BorrowRecord.objects.count()

        top_books = Book.objects.annotate(borrow_count=Count('borrowrecord')).order_by('-borrow_count')[:3]
        top_books_data = [{"title": b.title, "count": b.borrow_count} for b in top_books]

        monthly_data = (
            BorrowRecord.objects
            .annotate(month=TruncMonth('borrow_date'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        chart_data = [{"name": item['month'].strftime('%b'), "loans": item['count']} for item in monthly_data]

        recent_activity = BorrowRecord.objects.all().order_by('-borrow_date')[:5]
        recent_data = BorrowRecordSerializer(recent_activity, many=True).data

        return Response({
            "total_books": total_books,
            "total_borrowed": total_borrowed,
            "top_books": top_books_data,
            "chart_data": chart_data,
            "recent_activity": recent_data
        })

class StudentSignupView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSignupSerializer
    permission_classes = [AllowAny]

class LibrarianSignupView(generics.CreateAPIView):
    queryset = Librarian.objects.all()
    serializer_class = LibrarianSignupSerializer
    permission_classes = [AllowAny]

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class LibrarianProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = LibrarianProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.librarian_profile

class MemberListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentListSerializer
    permission_classes = [permissions.IsAuthenticated]

class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentListSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'student_id'

    def perform_destroy(self, instance):
        user = instance.user 
        user.delete()

class BookCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

class BookUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

class TransactionListView(generics.ListAPIView):
    queryset = BorrowRecord.objects.all().order_by('-borrow_date')
    serializer_class = BorrowRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

class ManageRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        record_id = request.data.get('record_id')
        action = request.data.get('action')
        
        try:
            record = BorrowRecord.objects.get(id=record_id)
            if action == 'approve':
                record.status = 'Approved'
                record.save()
                return Response({"message": "Book Approved"})
            elif action == 'reject':
                record.status = 'Rejected'
                record.save()
                record.book.quantity += 1
                record.book.save()
                return Response({"message": "Book Rejected"})
        except BorrowRecord.DoesNotExist:
            return Response({"error": "Record not found"}, status=404)

class BookListView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

class BookDetailView(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class RelatedBooksView(generics.ListAPIView):
    serializer_class = BookSerializer

    def get_queryset(self):
        category = self.request.query_params.get('category')
        book_id = self.request.query_params.get('book_id')
        return Book.objects.filter(category=category).exclude(id=book_id)[:4]

class BorrowBookView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        book_id = request.data.get('book_id')
        user = request.user
        
        try:
            student = user.student_profile
            book = Book.objects.get(id=book_id)
            
            # Check for active loans
            active_loan = BorrowRecord.objects.filter(
                student=student, 
                book=book, 
                status__in=['Pending', 'Approved']
            ).exists()

            if active_loan:
                return Response(
                    {"error": "You already have an active request or copy of this book. You cannot borrow two copies of the same book."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            if book.quantity > 0:
                BorrowRecord.objects.create(student=student, book=book, status='Pending')
                book.quantity -= 1
                book.save()
                return Response({"message": "Request submitted! Waiting for Librarian approval."}, status=status.HTTP_201_CREATED)
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
        return BorrowRecord.objects.filter(student=self.request.user.student_profile).order_by('-borrow_date')

class ReturnBookView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        record_id = request.data.get('record_id')
        try:
            record = BorrowRecord.objects.get(id=record_id)
            record.status = 'Returned'
            record.is_returned = True
            record.return_date = timezone.now().date()
            record.save()

            record.book.quantity += 1
            record.book.save()
            return Response({"message": "Book returned!"})
        except:
            return Response({"error": "Error"}, status=400)
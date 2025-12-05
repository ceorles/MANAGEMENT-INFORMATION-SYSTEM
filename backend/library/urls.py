from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    MyTokenObtainPairView, 
    StudentSignupView, 
    LibrarianSignupView,
    BookListView,
    BorrowBookView,
    MemberListView,
    TransactionListView,
    StudentDetailView,
    BookDetailView,
    RelatedBooksView,
    StudentBorrowedBooksView,
    ReturnBookView,
    ManageRequestView,
    BookCreateView,
    BookUpdateDeleteView,
    LibrarianProfileView,
    DashboardStatsView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # AUTH
    path('api/signup/student/', StudentSignupView.as_view(), name='student_signup'),
    path('api/signup/librarian/', LibrarianSignupView.as_view(), name='librarian_signup_api'), 
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # LIBRARIAN
    path('api/dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('api/members/', MemberListView.as_view(), name='member_list'),
    path('api/members/<str:student_id>/', StudentDetailView.as_view(), name='member_detail'),
    path('api/transactions/', TransactionListView.as_view(), name='transaction_list'),
    path('api/manage-request/', ManageRequestView.as_view(), name='manage_request'),
    path('api/books/manage/', BookCreateView.as_view(), name='book_create'),
    path('api/books/manage/<int:pk>/', BookUpdateDeleteView.as_view(), name='book_update_delete'),
    path('api/librarian/profile/', LibrarianProfileView.as_view(), name='librarian_profile'),

    # STUDENT
    path('api/books/', BookListView.as_view(), name='book_list'),
    path('api/books/<int:pk>/', BookDetailView.as_view(), name='book_detail'),
    path('api/books/related/', RelatedBooksView.as_view(), name='related_books'),
    path('api/borrow/', BorrowBookView.as_view(), name='borrow_book'),
    path('api/student/borrowed-books/', StudentBorrowedBooksView.as_view(), name='student_borrowed'),
    path('api/return/', ReturnBookView.as_view(), name='return_book'),
]
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
    # ReturnBookView,
    StudentConfirmPickupView,
    ManageRequestView,
    BookCreateView,
    BookUpdateDeleteView,
    LibrarianProfileView,
    DashboardStatsView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # authentication
    path('signup/student/', StudentSignupView.as_view(), name='student_signup'),
    path('signup/librarian/', LibrarianSignupView.as_view(), name='librarian_signup_api'), 
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # librarian
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('members/', MemberListView.as_view(), name='member_list'),
    path('members/<str:student_id>/', StudentDetailView.as_view(), name='member_detail'),
    path('transactions/', TransactionListView.as_view(), name='transaction_list'),
    path('manage-request/', ManageRequestView.as_view(), name='manage_request'),
    path('books/manage/', BookCreateView.as_view(), name='book_create'),
    path('books/manage/<int:pk>/', BookUpdateDeleteView.as_view(), name='book_update_delete'),
    path('librarian/profile/', LibrarianProfileView.as_view(), name='librarian_profile'),

    # student
    path('books/', BookListView.as_view(), name='book_list'),
    path('books/<int:pk>/', BookDetailView.as_view(), name='book_detail'),
    path('books/related/', RelatedBooksView.as_view(), name='related_books'),
    path('borrow/', BorrowBookView.as_view(), name='borrow_book'),
    path('student/borrowed-books/', StudentBorrowedBooksView.as_view(), name='student_borrowed'),
    # pathi/return/', ReturnBookView.as_view(), name='return_book'),
    path('student/pickup/', StudentConfirmPickupView.as_view(), name='student_pickup'),
]
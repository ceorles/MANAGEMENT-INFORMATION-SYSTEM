from django.urls import path
from .views import (
    MyTokenObtainPairView, 
    StudentSignupView, 
    LibrarianSignupView,
    # login_page,
    # librarian_signup_page
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
    # HTML PAGES (Frontend)
    # path('', login_page, name='login_page'), # root url
    # path('signup-librarian/', librarian_signup_page, name='librarian_signup_page'),
    path('api/dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),

    # Backend
    path('api/signup/student/', StudentSignupView.as_view(), name='student_signup'),
    path('api/signup/librarian/', LibrarianSignupView.as_view(), name='librarian_signup_api'), 
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Student URLs
    path('api/books/', BookListView.as_view(), name='book_list'),
    path('api/borrow/', BorrowBookView.as_view(), name='borrow_book'),

    # Librarian URLs
    path('api/members/', MemberListView.as_view(), name='member_list'),
    path('api/transactions/', TransactionListView.as_view(), name='transaction_list'),
    path('api/books/manage/', BookCreateView.as_view(), name='book_create'),
    path('api/books/manage/<int:pk>/', BookUpdateDeleteView.as_view(), name='book_update_delete'),
    path('api/librarian/profile/', LibrarianProfileView.as_view(), name='librarian_profile'),
    
    # URL to Edit/Delete a specific member
    path('api/members/<str:student_id>/', StudentDetailView.as_view(), name='member_detail'),

    path('api/books/<int:pk>/', BookDetailView.as_view(), name='book_detail'),
    path('api/books/related/', RelatedBooksView.as_view(), name='related_books'),

    path('api/student/borrowed-books/', StudentBorrowedBooksView.as_view(), name='student_borrowed'),
    path('api/return/', ReturnBookView.as_view(), name='return_book'),
    path('api/manage-request/', ManageRequestView.as_view(), name='manage_request'),

    
]
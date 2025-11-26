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
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # HTML PAGES (Frontend)
    # path('', login_page, name='login_page'), # root url
    # path('signup-librarian/', librarian_signup_page, name='librarian_signup_page'),

    # API ENDPOINTS (Backend)
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
]
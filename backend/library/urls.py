from django.urls import path
from .views import (
    MyTokenObtainPairView, 
    StudentSignupView, 
    LibrarianSignupView,
    # login_page,
    # librarian_signup_page   
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # HTML PAGES (Frontend)
    # path('', login_page, name='login_page'), # root url
    # path('signup-librarian/', librarian_signup_page, name='librarian_signup_page'),

    # API ENDPOINTS (Backend)
    path('api/signup/student/', StudentSignupView.as_view(), name='student_signup'),
    path('api/signup/librarian/', LibrarianSignupView.as_view(), name='librarian_signup_api'), 
    path('', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
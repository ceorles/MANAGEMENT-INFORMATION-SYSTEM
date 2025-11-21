from django.urls import path
from .views import StudentSignupView

urlpatterns = [
    path('signup/student/', StudentSignupView.as_view(), name='student-signup'),
]
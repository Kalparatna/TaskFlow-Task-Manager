from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import TaskListCreateView, TaskDetailView, UserRegistrationView, UserLoginView

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', UserRegistrationView.as_view(), name='user-register'),
    path('auth/login/', UserLoginView.as_view(), name='user-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # Task endpoints (authentication required)
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<str:pk>/', TaskDetailView.as_view(), name='task-detail'),
]
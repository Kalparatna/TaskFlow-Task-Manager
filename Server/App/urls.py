from django.urls import path
from .views import TaskListCreateView, TaskDetailView, UserRegistrationView

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', UserRegistrationView.as_view(), name='user-register'),
    
    # Task endpoints (authentication required)
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<str:pk>/', TaskDetailView.as_view(), name='task-detail'),
]
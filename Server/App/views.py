from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .mongodb_service import task_service

# Simple user registration serializer
from rest_framework import serializers

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class TaskListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get all tasks for the authenticated user"""
        try:
            tasks = task_service.get_tasks_by_user(request.user.id)
            return Response(tasks, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch tasks'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        """Create a new task for the authenticated user"""
        try:
            title = request.data.get('title', '').strip()
            description = request.data.get('description', '').strip()
            completed = request.data.get('completed', False)
            
            if not title:
                return Response(
                    {'error': 'Title is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            task = task_service.create_task(title, description, request.user.id, completed)
            
            return Response(task, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to create task'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TaskDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        """Get a specific task"""
        try:
            task = task_service.get_task_by_id(pk, request.user.id)
            if not task:
                return Response(
                    {'error': 'Task not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            return Response(task, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch task'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, pk):
        """Update a specific task"""
        try:
            task = task_service.get_task_by_id(pk, request.user.id)
            if not task:
                return Response(
                    {'error': 'Task not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Update task with provided data
            update_data = {}
            if 'title' in request.data:
                update_data['title'] = request.data['title'].strip()
            if 'description' in request.data:
                update_data['description'] = request.data['description'].strip()
            if 'completed' in request.data:
                update_data['completed'] = request.data['completed']
            
            if not update_data:
                return Response(task, status=status.HTTP_200_OK)
            
            updated_task = task_service.update_task(pk, request.user.id, update_data)
            if updated_task:
                return Response(updated_task, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'Failed to update task'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            return Response(
                {'error': 'Failed to update task'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, pk):
        """Delete a specific task"""
        try:
            success = task_service.delete_task(pk, request.user.id)
            if success:
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(
                    {'error': 'Task not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            return Response(
                {'error': 'Failed to delete task'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

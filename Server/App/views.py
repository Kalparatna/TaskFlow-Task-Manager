from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .mongodb_service import task_service
from .user_service import user_service
from .auth_backend import MongoDBAuthBackend

# Simple user registration serializer
from rest_framework import serializers

class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        try:
            user_data = user_service.create_user(**validated_data)
            return user_data
        except ValueError as e:
            raise serializers.ValidationError(str(e))

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user_data = serializer.save()
                return Response({
                    'message': 'User registered successfully',
                    'user': user_data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            # Authenticate using MongoDB
            user_data = user_service.authenticate_user(username, password)
            
            if user_data:
                # Create JWT tokens
                from .auth_backend import MongoDBUser
                user_obj = MongoDBUser(user_data)
                refresh = RefreshToken()
                refresh['user_id'] = user_data['id']
                refresh['username'] = user_data['username']
                
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': user_data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get all tasks for the authenticated user"""
        try:
            # Use MongoDB user ID (string format)
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
            
            # Use MongoDB user ID (string format)
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

"""
Custom Authentication Backend for MongoDB
"""

from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import AnonymousUser
from .user_service import user_service

class MongoDBUser:
    """Custom user class for MongoDB users"""
    
    def __init__(self, user_data):
        self.id = user_data['id']
        self.username = user_data['username']
        self.email = user_data['email']
        self.is_active = user_data.get('is_active', True)
        self.is_authenticated = True
        self.is_anonymous = False
        self._user_data = user_data

    def __str__(self):
        return self.username

    @property
    def pk(self):
        return self.id

class MongoDBAuthBackend(BaseBackend):
    """Custom authentication backend for MongoDB"""
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        """Authenticate user against MongoDB"""
        if username and password:
            user_data = user_service.authenticate_user(username, password)
            if user_data:
                return MongoDBUser(user_data)
        return None

    def get_user(self, user_id):
        """Get user by ID from MongoDB"""
        try:
            user_data = user_service.get_user_by_id(user_id)
            if user_data:
                return MongoDBUser(user_data)
        except Exception:
            pass
        return None
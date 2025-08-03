"""
Custom JWT Authentication for MongoDB Users
"""

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from .auth_backend import MongoDBUser
from .user_service import user_service

class MongoDBJWTAuthentication(JWTAuthentication):
    """Custom JWT Authentication that works with MongoDB users"""
    
    def get_user(self, validated_token):
        """Get user from MongoDB using token data"""
        try:
            user_id = validated_token.get('user_id')
            if user_id:
                user_data = user_service.get_user_by_id(user_id)
                if user_data:
                    return MongoDBUser(user_data)
        except Exception:
            pass
        
        raise InvalidToken('User not found')
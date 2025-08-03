"""
MongoDB User Service for TaskFlow
Handles user operations using PyMongo directly
"""

import os
import hashlib
from datetime import datetime
from typing import Dict, Optional
from bson import ObjectId
from pymongo import MongoClient
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class UserService:
    """Service class for User operations in MongoDB"""
    
    def __init__(self):
        from .mongodb_service import mongodb_service
        self.collection = mongodb_service.db.users

    def hash_password(self, password: str) -> str:
        """Hash password using SHA256"""
        return hashlib.sha256(password.encode()).hexdigest()

    def verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        return self.hash_password(password) == hashed_password

    def create_user(self, username: str, email: str, password: str) -> Dict:
        """Create a new user"""
        # Check if user already exists
        if self.collection.find_one({'username': username}):
            raise ValueError("Username already exists")
        
        if self.collection.find_one({'email': email}):
            raise ValueError("Email already exists")
        
        user_data = {
            'username': username,
            'email': email,
            'password': self.hash_password(password),
            'is_active': True,
            'date_joined': datetime.utcnow(),
            'last_login': None
        }
        
        result = self.collection.insert_one(user_data)
        user_data['_id'] = result.inserted_id
        user_data['id'] = str(result.inserted_id)
        
        return self._format_user(user_data)

    def authenticate_user(self, username: str, password: str) -> Optional[Dict]:
        """Authenticate user with username and password"""
        user = self.collection.find_one({'username': username})
        
        if user and self.verify_password(password, user['password']):
            # Update last login
            self.collection.update_one(
                {'_id': user['_id']},
                {'$set': {'last_login': datetime.utcnow()}}
            )
            return self._format_user(user)
        
        return None

    def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Get user by ID"""
        try:
            object_id = ObjectId(user_id)
            user = self.collection.find_one({'_id': object_id})
            return self._format_user(user) if user else None
        except Exception as e:
            logger.error(f"Error getting user {user_id}: {e}")
            return None

    def get_user_by_username(self, username: str) -> Optional[Dict]:
        """Get user by username"""
        user = self.collection.find_one({'username': username})
        return self._format_user(user) if user else None

    def update_user(self, user_id: str, update_data: Dict) -> Optional[Dict]:
        """Update user data"""
        try:
            object_id = ObjectId(user_id)
            
            # Hash password if it's being updated
            if 'password' in update_data:
                update_data['password'] = self.hash_password(update_data['password'])
            
            result = self.collection.update_one(
                {'_id': object_id},
                {'$set': update_data}
            )
            
            if result.modified_count > 0:
                return self.get_user_by_id(user_id)
            return None
            
        except Exception as e:
            logger.error(f"Error updating user {user_id}: {e}")
            return None

    def _format_user(self, user: Dict) -> Dict:
        """Format user for API response (exclude password)"""
        if not user:
            return None
            
        return {
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email'],
            'is_active': user.get('is_active', True),
            'date_joined': user['date_joined'].isoformat() if user.get('date_joined') else None,
            'last_login': user['last_login'].isoformat() if user.get('last_login') else None,
        }

# Global user service instance
user_service = UserService()
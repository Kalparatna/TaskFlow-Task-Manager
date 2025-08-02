"""
MongoDB Service for TaskFlow
Handles MongoDB operations using PyMongo directly
"""

import os
from datetime import datetime
from typing import List, Dict, Optional
from bson import ObjectId
from pymongo import MongoClient
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class MongoDBService:
    _instance = None
    _client = None
    _db = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDBService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if self._client is None:
            self.connect()

    def connect(self):
        """Connect to MongoDB"""
        try:
            mongodb_settings = settings.MONGODB_SETTINGS
            self._client = MongoClient(mongodb_settings['URI'])
            self._db = self._client[mongodb_settings['DB_NAME']]
            
            # Test connection
            self._client.admin.command('ping')
            logger.info(f"✅ Connected to MongoDB: {mongodb_settings['DB_NAME']}")
            
        except Exception as e:
            logger.error(f"❌ MongoDB connection failed: {e}")
            raise

    @property
    def db(self):
        """Get database instance"""
        if self._db is None:
            self.connect()
        return self._db

    @property
    def tasks_collection(self):
        """Get tasks collection"""
        return self.db.tasks

    def close(self):
        """Close MongoDB connection"""
        if self._client:
            self._client.close()
            self._client = None
            self._db = None

# Global MongoDB service instance
mongodb_service = MongoDBService()

class TaskService:
    """Service class for Task operations"""
    
    def __init__(self):
        self.collection = mongodb_service.tasks_collection

    def create_task(self, title: str, description: str, user_id: int, completed: bool = False) -> Dict:
        """Create a new task"""
        task_data = {
            'title': title,
            'description': description,
            'completed': completed,
            'user_id': user_id,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = self.collection.insert_one(task_data)
        task_data['_id'] = result.inserted_id
        task_data['id'] = str(result.inserted_id)  # Add string ID for frontend
        
        return self._format_task(task_data)

    def get_tasks_by_user(self, user_id: int) -> List[Dict]:
        """Get all tasks for a specific user"""
        tasks = list(self.collection.find({'user_id': user_id}).sort('created_at', -1))
        return [self._format_task(task) for task in tasks]

    def get_task_by_id(self, task_id: str, user_id: int) -> Optional[Dict]:
        """Get a specific task by ID and user"""
        try:
            object_id = ObjectId(task_id)
            task = self.collection.find_one({'_id': object_id, 'user_id': user_id})
            return self._format_task(task) if task else None
        except Exception as e:
            logger.error(f"Error getting task {task_id}: {e}")
            return None

    def update_task(self, task_id: str, user_id: int, update_data: Dict) -> Optional[Dict]:
        """Update a task"""
        try:
            object_id = ObjectId(task_id)
            update_data['updated_at'] = datetime.utcnow()
            
            result = self.collection.update_one(
                {'_id': object_id, 'user_id': user_id},
                {'$set': update_data}
            )
            
            if result.modified_count > 0:
                return self.get_task_by_id(task_id, user_id)
            return None
            
        except Exception as e:
            logger.error(f"Error updating task {task_id}: {e}")
            return None

    def delete_task(self, task_id: str, user_id: int) -> bool:
        """Delete a task"""
        try:
            object_id = ObjectId(task_id)
            result = self.collection.delete_one({'_id': object_id, 'user_id': user_id})
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Error deleting task {task_id}: {e}")
            return False

    def _format_task(self, task: Dict) -> Dict:
        """Format task for API response"""
        if not task:
            return None
            
        return {
            'id': str(task['_id']),
            'title': task['title'],
            'description': task['description'],
            'completed': task['completed'],
            'user_id': task['user_id'],
            'created_at': task['created_at'].isoformat() if task['created_at'] else None,
            'updated_at': task['updated_at'].isoformat() if task['updated_at'] else None,
        }

# Global task service instance
task_service = TaskService()
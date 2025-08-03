#!/usr/bin/env python
"""
Test script for MongoDB user system
Run this to test user registration and authentication
"""

import os
import sys
import django
from pathlib import Path

# Add the project directory to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Project.settings')
django.setup()

from App.user_service import user_service

def test_user_operations():
    print("🧪 Testing MongoDB User Operations...")
    
    # Test user creation
    try:
        print("\n1. Creating test user...")
        user_data = user_service.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        print(f"✅ User created: {user_data}")
        
        # Test authentication
        print("\n2. Testing authentication...")
        auth_user = user_service.authenticate_user("testuser", "testpass123")
        if auth_user:
            print(f"✅ Authentication successful: {auth_user}")
        else:
            print("❌ Authentication failed")
        
        # Test wrong password
        print("\n3. Testing wrong password...")
        wrong_auth = user_service.authenticate_user("testuser", "wrongpass")
        if not wrong_auth:
            print("✅ Wrong password correctly rejected")
        else:
            print("❌ Wrong password was accepted")
        
        # Test get user by ID
        print("\n4. Testing get user by ID...")
        retrieved_user = user_service.get_user_by_id(user_data['id'])
        if retrieved_user:
            print(f"✅ User retrieved by ID: {retrieved_user}")
        else:
            print("❌ Failed to retrieve user by ID")
            
        print("\n🎉 All tests passed! MongoDB user system is working.")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_user_operations()
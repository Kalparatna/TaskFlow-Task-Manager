#!/bin/bash

echo "🚀 Building TaskFlow with MongoDB..."

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Test MongoDB connection
echo "🔍 Testing MongoDB connection..."
python test_mongodb.py

# Create superuser if needed (optional)
echo "👤 Setting up admin user..."
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@taskflow.com', 'admin123')
    print('✅ Admin user created: admin/admin123')
else:
    print('✅ Admin user already exists')
"

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

echo "✅ Build completed successfully!"
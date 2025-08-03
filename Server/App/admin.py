from django.contrib import admin
from .models import MongoDBUser, MongoDBTask

@admin.register(MongoDBUser)
class MongoDBUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'mongodb_id', 'created_at']
    list_filter = ['created_at']
    search_fields = ['username', 'email']
    readonly_fields = ['mongodb_id']

@admin.register(MongoDBTask)
class MongoDBTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'completed', 'mongodb_id', 'user_mongodb_id', 'created_at', 'updated_at']
    list_filter = ['completed', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['mongodb_id', 'user_mongodb_id']

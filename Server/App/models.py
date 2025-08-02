from django.db import models
from django.contrib.auth.models import User

# We'll use MongoDB for tasks, but keep this model for Django admin compatibility
class Task(models.Model):
    """
    This model is for Django admin interface only.
    Actual task data is stored in MongoDB via mongodb_service.py
    """
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks', null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

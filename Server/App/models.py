from django.db import models

# Note: All user and task data is now stored in MongoDB
# These models are kept for Django admin compatibility only

class MongoDBUser(models.Model):
    """
    Placeholder model for Django admin compatibility.
    Actual user data is stored in MongoDB via user_service.py
    """
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField()
    mongodb_id = models.CharField(max_length=24, unique=True)  # Store MongoDB ObjectId
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "MongoDB User"
        verbose_name_plural = "MongoDB Users"

class MongoDBTask(models.Model):
    """
    Placeholder model for Django admin compatibility.
    Actual task data is stored in MongoDB via mongodb_service.py
    """
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    mongodb_id = models.CharField(max_length=24, unique=True)  # Store MongoDB ObjectId
    user_mongodb_id = models.CharField(max_length=24)  # Store user's MongoDB ObjectId
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "MongoDB Task"
        verbose_name_plural = "MongoDB Tasks"
        ordering = ['-created_at']

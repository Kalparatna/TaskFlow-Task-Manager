"""
Django management command to migrate existing Django users to MongoDB
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from App.user_service import user_service

class Command(BaseCommand):
    help = 'Migrate existing Django users to MongoDB'

    def handle(self, *args, **options):
        self.stdout.write("🔄 Starting user migration to MongoDB...")
        
        django_users = User.objects.all()
        migrated_count = 0
        skipped_count = 0
        
        for django_user in django_users:
            try:
                # Check if user already exists in MongoDB
                existing_user = user_service.get_user_by_username(django_user.username)
                
                if existing_user:
                    self.stdout.write(f"⏭️  Skipping {django_user.username} (already exists in MongoDB)")
                    skipped_count += 1
                    continue
                
                # Create user in MongoDB
                # Note: We can't migrate the password hash, so we'll set a default password
                user_data = user_service.create_user(
                    username=django_user.username,
                    email=django_user.email,
                    password="changeme123"  # User will need to reset password
                )
                
                self.stdout.write(f"✅ Migrated user: {django_user.username}")
                migrated_count += 1
                
            except Exception as e:
                self.stdout.write(f"❌ Failed to migrate {django_user.username}: {e}")
        
        self.stdout.write(
            self.style.SUCCESS(
                f"\n🎉 Migration complete!\n"
                f"   Migrated: {migrated_count} users\n"
                f"   Skipped: {skipped_count} users\n"
                f"   Note: Migrated users have default password 'changeme123'"
            )
        )
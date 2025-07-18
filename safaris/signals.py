from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Profile, UserProfile, Booking, BookingHistory
from django.contrib.auth.models import User

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

@receiver(post_save, sender=Booking)
def create_booking_history(sender, instance, created, **kwargs):
    if created:
        try:
            user = User.objects.get(email=instance.email)
            # Only create if not already exists
            if not BookingHistory.objects.filter(booking=instance).exists():
                BookingHistory.objects.create(user=user, booking=instance)
        except User.DoesNotExist:
            pass  # Booking was made by a guest, not a registered user

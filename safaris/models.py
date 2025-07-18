from django.db import models
from django.core.files.storage import default_storage
import os
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

User = get_user_model()

def destination_image_path(instance, filename):
    return f'destinations/{instance.name}/{filename}'

def safari_image_path(instance, filename):
    return f'safaris/{instance.title}/{filename}'

def about_image_path(instance, filename):
    return f'about/{instance.title}/{filename}'  # Customize the path as needed

def accommodation_image_path(instance, filename):
    return f'accommodations/{instance.name}/{filename}'

class Destination(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to=destination_image_path, null=True)
    highlights = models.TextField()
    best_time = models.CharField(max_length=200)
    weather_information = models.TextField(blank=True, null=True)
    local_culture = models.TextField(blank=True, null=True)
    wildlife_information = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.location}"

    def save(self, *args, **kwargs):
        # Delete old image if it's being replaced
        if self.pk:
            old_instance = Destination.objects.get(pk=self.pk)
            if old_instance.image and old_instance.image != self.image:
                default_storage.delete(old_instance.image.path)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['name']

class Safari(models.Model):
    DIFFICULTY_LEVELS = [
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('challenging', 'Challenging'),
    ]

    title = models.CharField(max_length=200)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    description = models.TextField()
    duration = models.IntegerField(help_text="Duration in days")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to=safari_image_path)
    included = models.TextField()
    excluded = models.TextField()
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='moderate')
    max_group_size = models.PositiveIntegerField(default=12)
    min_age_requirement = models.PositiveIntegerField(default=12)
    seasonal_availability = models.JSONField(
        default=dict,
        help_text="JSON format: {'jan': true, 'feb': true, ...}"
    )
    departure_points = models.JSONField(
        default=list,
        help_text="List of departure locations with pickup times"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class Itinerary(models.Model):
    safari = models.ForeignKey(Safari, on_delete=models.CASCADE, related_name='itineraries')
    day_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    activities = models.JSONField(
        default=list,
        help_text="List of activities for the day"
    )
    accommodation = models.ForeignKey(
        'Accommodation',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='itinerary_stays'
    )
    meals_included = models.JSONField(
        default=list,
        help_text="List of meals included (breakfast, lunch, dinner)"
    )
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.safari.title} - Day {self.day_number}: {self.title}"

    class Meta:
        ordering = ['safari', 'day_number']
        unique_together = ['safari', 'day_number']

class Booking(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    date = models.DateField()
    guests = models.IntegerField()
    special_requirements = models.TextField(blank=True, default='')
    safari = models.ForeignKey(Safari, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('confirmed', 'Confirmed'),
            ('cancelled', 'Cancelled')
        ],
        default='pending'
    )
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('paid', 'Paid'),
            ('refunded', 'Refunded'),
            ('failed', 'Failed')
        ],
        default='pending'
    )
    payment_history = models.JSONField(default=list, blank=True, help_text="List of payment transaction records")
    cancellation_policy = models.TextField(blank=True, null=True)
    refund_terms = models.TextField(blank=True, null=True)
    insurance_options = models.JSONField(default=dict, blank=True, help_text="Details of selected insurance policy")
    emergency_contact_name = models.CharField(max_length=200, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True)
    special_dietary_requirements = models.TextField(blank=True, null=True)
    payment_method = models.CharField(
        max_length=30,
        choices=[
            ('bank_transfer', 'Bank Transfer'),
            ('cash_on_arrival', 'Cash on Arrival'),
            ('online', 'Online Payment'),
        ],
        default='online',
        help_text='How the client will pay for the safari.'
    )
    deposit_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00,
        help_text='Deposit paid online for cash on arrival bookings.'
    )
    proof_of_payment = models.FileField(
        upload_to='payment_proofs/', blank=True, null=True,
        help_text='Upload proof of bank transfer payment.'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.safari.title} ({self.date})"

class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    preferences = models.TextField(blank=True, null=True)  # Store user preferences for safaris
    # Add more fields as needed

    def __str__(self):
        return self.user.username

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    safari = models.ForeignKey(Safari, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()  # Rating out of 5
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_moderated = models.BooleanField(default=False)  # For admin moderation

    def __str__(self):
        return f"{self.user.username} - {self.safari.title} - {self.rating}"

class NewsletterSubscription(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class HomePage(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField()
    hero_image = models.ImageField(upload_to='home/')
    # Add any other fields you want to manage

    def __str__(self):
        return self.title

class AboutPage(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to=about_image_path, null=True)  # Use the custom upload path

    def __str__(self):
        return self.title

class TeamMember(models.Model):
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=100)
    image = models.ImageField(upload_to='team/')
    description = models.TextField()

    def __str__(self):
        return self.name

class Testimonial(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    comment = models.TextField()
    rating = models.PositiveIntegerField()  # Rating out of 5
    image = models.ImageField(upload_to='testimonials/', null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.rating} stars"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    preferences = models.JSONField(default=dict, blank=True, null=True, help_text="User preferences for personalized recommendations (JSON format)")
    loyalty_points = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    phone = models.CharField(max_length=32, blank=True, null=True)

    def __str__(self):
        return self.user.username

class ChatMessage(models.Model):
    text = models.TextField()
    sender = models.CharField(max_length=10)  # 'user' or 'bot'
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.text[:50]}"

class Accommodation(models.Model):
    ACCOMMODATION_TYPES = [
        ('lodge', 'Lodge'),
        ('camp', 'Camp'),
        ('hotel', 'Hotel'),
    ]

    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=ACCOMMODATION_TYPES)
    location = models.CharField(max_length=200)
    description = models.TextField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    amenities = models.TextField()
    image = models.ImageField(upload_to=accommodation_image_path)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.get_type_display()}"

    def save(self, *args, **kwargs):
        if self.pk:
            old_instance = Accommodation.objects.get(pk=self.pk)
            if old_instance.image and old_instance.image != self.image:
                default_storage.delete(old_instance.image.path)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-is_featured', 'name']

class Package(models.Model):
    title = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    safaris = models.ManyToManyField(Safari, related_name='packages')
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    special_offers = models.TextField(blank=True, null=True)
    seasonal_pricing = models.JSONField(
        default=dict,
        help_text="JSON format: {'month_year': price, 'jan_2025': 1500, ...}"
    )
    group_discounts = models.JSONField(
        default=dict,
        help_text="JSON format: {'min_guests': discount_percentage, '5': 5, '10': 10}"
    )
    image = models.ImageField(upload_to='packages/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title']

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    safari = models.ForeignKey(Safari, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'safari')
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.user.username}'s Wishlist: {self.safari.title}"

class BookingHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='booking_history')
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    booked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-booked_at']
        verbose_name_plural = "Booking History"

    def __str__(self):
        return f"{self.user.username}'s Booking of {self.booking.safari.title} on {self.booked_at.strftime('%Y-%m-%d')}"

class FAQ(models.Model):
    question = models.CharField(max_length=500)
    answer = models.TextField()
    category = models.CharField(max_length=100, blank=True, null=True)
    order = models.PositiveIntegerField(default=0, help_text="Order in which FAQ should appear")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'question']
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.question

class Blog(models.Model):
    title = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    content = models.TextField()
    image = models.ImageField(upload_to='blog/', null=True, blank=True)
    published_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date']

    def __str__(self):
        return self.title

class Gallery(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='gallery/')
    safari = models.ForeignKey(Safari, on_delete=models.SET_NULL, null=True, blank=True)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Galleries"

    def __str__(self):
        return self.title 

class AccommodationEnquiry(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='accommodation_enquiries')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=32, blank=True, null=True)
    accommodation = models.ForeignKey('Accommodation', on_delete=models.CASCADE, related_name='enquiries')
    price_range = models.CharField(max_length=100, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('in_progress', 'In Progress'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending')
    admin_response = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Enquiry for {self.accommodation.name} by {self.name}" 

class AccommodationGallery(models.Model):
    accommodation = models.ForeignKey('Accommodation', on_delete=models.CASCADE, related_name='gallery_images')
    image = models.ImageField(upload_to='accommodations/gallery/')
    caption = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.accommodation.name} Gallery Image" 

class AccommodationEnquiryMessage(models.Model):
    enquiry = models.ForeignKey('AccommodationEnquiry', on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10, choices=[('user', 'User'), ('admin', 'Admin')])
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender} message for Enquiry {self.enquiry.id} at {self.created_at}" 

class Payment(models.Model):
    GATEWAY_CHOICES = [
        ('intasend', 'IntaSend'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    booking = models.ForeignKey('Booking', on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    accommodation_enquiry = models.ForeignKey('AccommodationEnquiry', on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reference = models.CharField(max_length=100, unique=True)
    gateway = models.CharField(max_length=20, choices=GATEWAY_CHOICES)
    raw_response = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    payment_type = models.CharField(
        max_length=10,
        choices=[('full', 'Full'), ('deposit', 'Deposit')],
        default='full',
        help_text='Is this a full or deposit payment?'
    )
    is_deposit = models.BooleanField(default=False, help_text='True if this payment is a deposit.')
    def __str__(self):
        return f"{self.user} - {self.amount} {self.currency} ({self.gateway}) [{self.status}]" 
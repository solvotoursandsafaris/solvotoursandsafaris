from django import forms
from .models import Profile, Review, NewsletterSubscription

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['preferences']  # Add more fields as needed

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['safari', 'rating', 'comment']
        widgets = {
            'rating': forms.Select(choices=[(i, i) for i in range(1, 6)]),  # Dropdown for ratings 1-5
        }

class NewsletterSubscriptionForm(forms.ModelForm):
    class Meta:
        model = NewsletterSubscription
        fields = ['email']

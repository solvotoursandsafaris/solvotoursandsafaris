from rest_framework import viewsets, permissions, filters, generics
from rest_framework.decorators import action, api_view, permission_classes, parser_classes
from rest_framework.response import Response
from django.db.models import Q
from .models import Destination, Safari, Booking, ContactMessage, Profile, Review, NewsletterSubscription, User, HomePage, AboutPage, TeamMember, Testimonial, UserProfile, ChatMessage, Accommodation, Itinerary, Package, Wishlist, BookingHistory, FAQ, Blog, Gallery, AccommodationEnquiry, AccommodationGallery, AccommodationEnquiryMessage, Payment
from .serializers import DestinationSerializer, SafariSerializer, BookingSerializer, ContactMessageSerializer, UserSerializer, HomePageSerializer, AboutPageSerializer, TeamMemberSerializer, TestimonialSerializer, UserProfileSerializer, ChatMessageSerializer, AccommodationSerializer, ItinerarySerializer, PackageSerializer, WishlistSerializer, BookingHistorySerializer, FAQSerializer, BlogSerializer, GallerySerializer, AccommodationEnquirySerializer, AccommodationEnquiryMessageSerializer, PaymentSerializer
from .utils import send_booking_confirmation
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import ProfileForm, ReviewForm, NewsletterSubscriptionForm  # Create a form for the Profile model, Review model, and NewsletterSubscription model
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import status
from rest_framework.views import APIView
import logging
from rest_framework.parsers import MultiPartParser, FormParser
import requests
import uuid
import json
import os

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

class SafariViewSet(viewsets.ModelViewSet):
    queryset = Safari.objects.all()
    serializer_class = SafariSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'duration']

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_safaris = self.queryset.order_by('-price')[:3]
        serializer = self.get_serializer(featured_safaris, many=True)
        return Response(serializer.data)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(email=self.request.user.email)

    def perform_create(self, serializer):
        booking = serializer.save()
        # Payment logic
        payment_method = booking.payment_method
        if payment_method == 'cash_on_arrival':
            # Require deposit (e.g., 30%)
            deposit = booking.total_price * 0.3
            booking.deposit_amount = deposit
            booking.payment_status = 'pending'
            booking.save()
            # Payment creation for cash_on_arrival can be handled here if needed, but not with Stripe
        elif payment_method == 'bank_transfer':
            # Require proof of payment
            booking.payment_status = 'pending'
            booking.save()
            # Admin will confirm after proof upload
        elif payment_method == 'online':
            # Full payment online
            booking.payment_status = 'pending'
            booking.save()
            # Online payment handled elsewhere (Stripe removed)
        send_booking_confirmation(booking)  # Send confirmation email

class ContactMessageCreate(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer 

@login_required
def profile_view(request):
    profile = request.user.profile
    return render(request, 'profile.html', {'profile': profile})

@login_required
def edit_profile(request):
    profile = request.user.profile
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            return redirect('profile')
    else:
        form = ProfileForm(instance=profile)
    return render(request, 'edit_profile.html', {'form': form})

@login_required
def submit_review(request):
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.user = request.user  # Set the user to the logged-in user
            review.save()
            return redirect('safari-detail', pk=review.safari.pk)  # Redirect to safari detail page
    else:
        form = ReviewForm()
    return render(request, 'submit_review.html', {'form': form})

@login_required
def moderate_reviews(request):
    reviews = Review.objects.filter(is_moderated=False)  # Get unmoderated reviews
    return render(request, 'moderate_reviews.html', {'reviews': reviews})

@login_required
def approve_review(request, review_id):
    review = Review.objects.get(id=review_id)
    review.is_moderated = True
    review.save()
    return redirect('moderate-reviews') 

def send_booking_confirmation(booking):
    html_message = render_to_string('emails/booking_confirmation_email.html', {'booking': booking})
    subject = 'Your Booking Confirmation'
    from_email = 'h4mm0ndc@zohomail.com'  # Replace with your email
    to_email = booking.email

    email = EmailMultiAlternatives(subject, '', from_email, [to_email])
    email.attach_alternative(html_message, "text/html")
    email.send() 

@login_required
def subscribe_newsletter(request):
    if request.method == 'POST':
        form = NewsletterSubscriptionForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')  # Redirect to a success page
    else:
        form = NewsletterSubscriptionForm()
    return render(request, 'subscribe_newsletter.html', {'form': form}) 

def send_promotional_email(subject, message):
    subscribers = NewsletterSubscription.objects.all()
    for subscriber in subscribers:
        send_mail(subject, message, 'h4mm0ndc@zohomail.com', [subscriber.email]) 

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer 

class HomePageView(generics.ListAPIView):
    queryset = HomePage.objects.all()
    serializer_class = HomePageSerializer

class AboutPageView(generics.ListAPIView):
    queryset = AboutPage.objects.all()
    serializer_class = AboutPageSerializer 

class TeamMemberView(generics.ListAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer

class TestimonialView(generics.ListAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer 

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def user_profile(request):
    user = request.user
    try:
        profile = UserProfile.objects.get(user=user)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    elif request.method == 'PUT':
        data = request.data.copy()
        files = request.FILES
        serializer = UserProfileSerializer(profile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Handle image upload if present
            if 'image' in files:
                profile.image = files['image']
                profile.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class ChatMessageView(APIView):
    def post(self, request):
        logging.info(f"Received data: {request.data}")
        serializer = ChatMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logging.info("Message saved successfully")
            return Response(serializer.data, status=201)
        logging.error(f"Error saving message: {serializer.errors}")
        return Response(serializer.errors, status=400) 

class AccommodationViewSet(viewsets.ModelViewSet):
    queryset = Accommodation.objects.all()
    serializer_class = AccommodationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'location']
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_accommodations = Accommodation.objects.filter(is_featured=True)
        serializer = self.get_serializer(featured_accommodations, many=True)
        return Response(serializer.data) 

class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'safari__title']
    ordering_fields = ['day_number', 'safari']

class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'safaris__title']
    ordering_fields = ['base_price', 'title']

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BookingHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BookingHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BookingHistory.objects.filter(user=self.request.user)

class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['question', 'answer', 'category']
    ordering_fields = ['order', 'question']

class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'author__username']
    ordering_fields = ['published_date', 'title']
    lookup_field = 'slug' # Use slug for lookup

class GalleryViewSet(viewsets.ModelViewSet):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'safari__title', 'destination__name']
    ordering_fields = ['uploaded_at', 'title'] 

class AccommodationEnquiryCreate(generics.CreateAPIView):
    queryset = AccommodationEnquiry.objects.all()
    serializer_class = AccommodationEnquirySerializer

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

class UserAccommodationEnquiryList(generics.ListAPIView):
    serializer_class = AccommodationEnquirySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AccommodationEnquiry.objects.filter(user=self.request.user).order_by('-created_at') 

class AccommodationEnquiryMessageCreate(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        enquiry = AccommodationEnquiry.objects.get(pk=pk)
        sender = 'admin' if request.user.is_staff else 'user'
        message = request.data.get('message')
        msg = AccommodationEnquiryMessage.objects.create(
            enquiry=enquiry,
            sender=sender,
            message=message,
            is_read=(sender == 'admin')  # admin messages are read by default
        )
        return Response(AccommodationEnquiryMessageSerializer(msg).data, status=201)

class AccommodationEnquiryMarkRead(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        enquiry = AccommodationEnquiry.objects.get(pk=pk)
        # Only mark as read for messages not sent by the current user
        for msg in enquiry.messages.filter(sender='admin', is_read=False):
            msg.is_read = True
            msg.save()
        return Response({'status': 'marked as read'}) 

@csrf_exempt
@api_view(['POST'])
def webhook_paypal(request):
    # PayPal webhook/callback
    event = json.loads(request.body.decode('utf-8'))
    from .models import Payment, Booking, AccommodationEnquiry
    event_type = event.get('event_type')
    resource = event.get('resource', {})
    custom_id = resource.get('custom_id')
    status = resource.get('status')
    # Find payment by custom_id
    try:
        payment = Payment.objects.get(reference=custom_id, gateway='paypal')
        if status in ['COMPLETED', 'APPROVED'] or event_type in ['CHECKOUT.ORDER.APPROVED', 'PAYMENT.CAPTURE.COMPLETED']:
            payment.status = 'completed'
            payment.save()
            if payment.booking:
                payment.booking.payment_status = 'paid'
                payment.booking.status = 'confirmed'
                payment.booking.save()
            if payment.accommodation_enquiry:
                payment.accommodation_enquiry.status = 'completed'
                payment.accommodation_enquiry.save()
            print(f"[PayPal] Payment completed for reference {custom_id}")
        elif status == 'FAILED' or event_type == 'PAYMENT.CAPTURE.DENIED':
            payment.status = 'failed'
            payment.save()
            print(f"[PayPal] Payment failed for reference {custom_id}")
    except Payment.DoesNotExist:
        pass
    return Response({'status': 'success'})

@csrf_exempt
@api_view(['POST'])
def mpesa_callback(request):
    # Safaricom Daraja M-Pesa callback
    data = json.loads(request.body.decode('utf-8'))
    from .models import Payment, Booking, AccommodationEnquiry
    result_code = data.get('Body', {}).get('stkCallback', {}).get('ResultCode')
    reference = data.get('Body', {}).get('stkCallback', {}).get('CheckoutRequestID')
    # Find payment by reference
    try:
        payment = Payment.objects.get(reference=reference, gateway='mpesa')
        if result_code == 0:
            payment.status = 'completed'
            payment.save()
            if payment.booking:
                payment.booking.payment_status = 'paid'
                payment.booking.status = 'confirmed'
                payment.booking.save()
            if payment.accommodation_enquiry:
                payment.accommodation_enquiry.status = 'completed'
                payment.accommodation_enquiry.save()
            print(f"[M-Pesa] Payment completed for reference {reference}")
        else:
            payment.status = 'failed'
            payment.save()
            print(f"[M-Pesa] Payment failed for reference {reference}")
    except Payment.DoesNotExist:
        pass
    return Response({'status': 'success'}) 
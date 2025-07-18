from rest_framework import serializers
from .models import Destination, Safari, Booking, HomePage, AboutPage, TeamMember, Testimonial, UserProfile, ChatMessage, Accommodation, Itinerary, Package, Wishlist, BookingHistory, FAQ, Blog, Gallery, AccommodationEnquiry, AccommodationGallery, AccommodationEnquiryMessage, Payment
from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import ContactMessage

User = get_user_model()

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'

class ItinerarySerializer(serializers.ModelSerializer):
    accommodation = serializers.StringRelatedField()
    class Meta:
        model = Itinerary
        fields = '__all__'

class SafariSerializer(serializers.ModelSerializer):
    itineraries = ItinerarySerializer(many=True, read_only=True)
    class Meta:
        model = Safari
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'date',
            'guests',
            'special_requirements',
            'safari',
            'status',
            'total_price',
            'created_at',
            'updated_at',
            'payment_status',
            'payment_history',
            'cancellation_policy',
            'refund_terms',
            'insurance_options',
            'emergency_contact_name',
            'emergency_contact_phone',
            'special_dietary_requirements',
            'payment_method',
            'deposit_amount',
            'proof_of_payment',
        ]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()  # This should call the create method of the serializer
        # Optionally, you can send a welcome email or perform other actions here 

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']

class HomePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePage
        fields = '__all__'

class AboutPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPage
        fields = '__all__'

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)

    def validate_preferences(self, value):
        import json
        if value == '' or value is None:
            return {}
        if isinstance(value, str):
            try:
                return json.loads(value)
            except Exception:
                return value
        return value

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'username', 'email', 'preferences', 'loyalty_points', 'image', 'phone']

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'

class AccommodationGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = AccommodationGallery
        fields = ['id', 'image', 'caption', 'uploaded_at']

class AccommodationSerializer(serializers.ModelSerializer):
    gallery_images = AccommodationGallerySerializer(many=True, read_only=True)
    class Meta:
        model = Accommodation
        fields = '__all__'

class PackageSerializer(serializers.ModelSerializer):
    safaris = SafariSerializer(many=True, read_only=True)
    class Meta:
        model = Package
        fields = '__all__'

class WishlistSerializer(serializers.ModelSerializer):
    safari_details = SafariSerializer(source='safari', read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'safari', 'safari_details', 'added_at']
        read_only_fields = ['user', 'added_at']

class BookingHistorySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    booking_details = BookingSerializer(source='booking', read_only=True)

    class Meta:
        model = BookingHistory
        fields = ['id', 'user', 'booking', 'booking_details', 'booked_at']
        read_only_fields = ['user', 'booked_at']

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'

class BlogSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField() # Display author's username
    class Meta:
        model = Blog
        fields = '__all__'

class GallerySerializer(serializers.ModelSerializer):
    safari = serializers.StringRelatedField(read_only=True) # Display safari title
    destination = serializers.StringRelatedField(read_only=True) # Display destination name
    class Meta:
        model = Gallery
        fields = '__all__' 

class AccommodationEnquiryMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccommodationEnquiryMessage
        fields = ['id', 'sender', 'message', 'created_at', 'is_read']

class AccommodationEnquirySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    messages = AccommodationEnquiryMessageSerializer(many=True, read_only=True)
    class Meta:
        model = AccommodationEnquiry
        fields = ['id', 'user', 'name', 'email', 'phone', 'accommodation', 'price_range', 'message', 'status', 'admin_response', 'created_at', 'messages'] 

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__' 
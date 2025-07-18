from django.contrib import admin
from .models import Destination, Safari, Booking, Review, HomePage, AboutPage, TeamMember, Testimonial, ChatMessage, Accommodation, Itinerary, Package, Wishlist, BookingHistory, FAQ, Blog, Gallery, AccommodationEnquiry, AccommodationGallery, AccommodationEnquiryMessage, Payment
from django.contrib.auth import get_user_model
from .models import ContactMessage

User = get_user_model()

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Safari)
class SafariAdmin(admin.ModelAdmin):
    list_display = ('title', 'destination', 'duration', 'price', 'difficulty_level', 'max_group_size', 'min_age_requirement')
    list_filter = ('destination', 'duration', 'difficulty_level')
    search_fields = ('title', 'description')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('name', 'safari', 'date', 'guests', 'status', 'payment_status', 'payment_method', 'deposit_amount', 'total_price', 'created_at')
    list_filter = ('status', 'payment_status', 'payment_method', 'date')
    search_fields = ('name', 'email', 'safari__title', 'emergency_contact_name')
    readonly_fields = ('payment_history', 'created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('safari', 'name', 'email', 'phone', 'date', 'guests', 'total_price', 'status', 'payment_status', 'payment_method', 'deposit_amount', 'proof_of_payment')
        }),
        ('Additional Information', {
            'fields': ('special_requirements', 'special_dietary_requirements', 'cancellation_policy', 'refund_terms', 'insurance_options', 'payment_history'),
            'classes': ('collapse',),
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone'),
            'classes': ('collapse',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    list_filter = ('is_staff', 'is_active')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    search_fields = ('name', 'email', 'subject')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'safari', 'rating', 'is_moderated', 'created_at')
    list_filter = ('is_moderated',)
    search_fields = ('user__username', 'safari__title')

@admin.register(HomePage)
class HomePageAdmin(admin.ModelAdmin):
    list_display = ('title',)

@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    list_display = ('title',)

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role')

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'rating')

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('text', 'sender', 'timestamp')
    search_fields = ('text', 'sender')
    list_filter = ('sender', 'timestamp')

class AccommodationGalleryInline(admin.TabularInline):
    model = AccommodationGallery
    extra = 1

@admin.register(Accommodation)
class AccommodationAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'location', 'price_per_night', 'rating', 'is_featured')
    list_filter = ('type', 'is_featured', 'rating')
    search_fields = ('name', 'location', 'description')
    list_editable = ('is_featured', 'rating')
    inlines = [AccommodationGalleryInline]

@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ('safari', 'day_number', 'title', 'accommodation', 'start_time', 'end_time')
    list_filter = ('safari',)
    search_fields = ('title', 'description', 'safari__title')

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'base_price', 'discount_percentage', 'created_at')
    list_filter = ('safaris', 'discount_percentage')
    search_fields = ('title', 'description')
    filter_horizontal = ('safaris',)

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'safari', 'added_at')
    list_filter = ('user', 'safari')
    search_fields = ('user__username', 'safari__title')

@admin.register(BookingHistory)
class BookingHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'booking', 'booked_at')
    list_filter = ('user', 'booking__safari')
    search_fields = ('user__username', 'booking__safari__title')

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'order', 'created_at')
    list_filter = ('category',)
    search_fields = ('question', 'answer')
    list_editable = ('order',)

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'published_date', 'updated_date')
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ('author', 'published_date')
    search_fields = ('title', 'content')

@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'safari', 'destination', 'uploaded_at')
    list_filter = ('safari', 'destination')
    search_fields = ('title', 'description', 'safari__title', 'destination__name')

class AccommodationEnquiryMessageInline(admin.TabularInline):
    model = AccommodationEnquiryMessage
    extra = 1
    readonly_fields = ('created_at',)

@admin.register(AccommodationEnquiry)
class AccommodationEnquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'accommodation', 'status', 'created_at')
    search_fields = ('name', 'email', 'accommodation__name')
    list_filter = ('accommodation', 'created_at', 'status')
    fields = ('name', 'email', 'phone', 'accommodation', 'price_range', 'message', 'status', 'admin_response', 'created_at', 'user')
    readonly_fields = ('created_at', 'user')
    inlines = [AccommodationEnquiryMessageInline]

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('user', 'booking', 'amount', 'currency', 'status', 'gateway', 'payment_type', 'is_deposit', 'created_at')
    list_filter = ('status', 'gateway', 'payment_type', 'is_deposit', 'created_at')
    search_fields = ('user__email', 'booking__id', 'reference')

admin.site.register(AccommodationGallery)
admin.site.register(AccommodationEnquiryMessage) 
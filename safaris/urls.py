from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .auth import UserCreate, UserLogin
from safaris.views import ContactMessageCreate, profile_view, edit_profile, submit_review, moderate_reviews, approve_review, subscribe_newsletter, HomePageView, AboutPageView, TeamMemberView, TestimonialView, user_profile, ChatMessageView, ItineraryViewSet, PackageViewSet, WishlistViewSet, BookingHistoryViewSet, FAQViewSet, BlogViewSet, GalleryViewSet, AccommodationEnquiryCreate, UserAccommodationEnquiryList, AccommodationEnquiryMessageCreate, AccommodationEnquiryMarkRead, AccommodationViewSet, SafariViewSet, DestinationViewSet, BookingViewSet, IntaSendInitiatePayment, IntaSendWebhook, pay_paypal, pay_mpesa, webhook_paypal, mpesa_callback
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'itineraries', ItineraryViewSet, basename='itinerary')
router.register(r'packages', PackageViewSet, basename='package')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'booking-history', BookingHistoryViewSet, basename='booking-history')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'blog', BlogViewSet, basename='blog')
router.register(r'gallery', GalleryViewSet, basename='gallery')
router.register(r'accommodations', AccommodationViewSet, basename='accommodation')
router.register(r'safaris', SafariViewSet, basename='safari')
router.register(r'destinations', DestinationViewSet, basename='destination')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('register/', UserCreate.as_view(), name='user-register'),
    path('login/', UserLogin.as_view(), name='user-login'),
    path('contact/', ContactMessageCreate.as_view(), name='contact-message'),
    path('profile/', profile_view, name='profile'),
    path('profile/edit/', edit_profile, name='edit-profile'),
    path('accounts/', include('allauth.urls')),
    path('review/submit/', submit_review, name='submit-review'),
    path('admin/reviews/', moderate_reviews, name='moderate-reviews'),
    path('admin/reviews/approve/<int:review_id>/', approve_review, name='approve-review'),
    path('subscribe/', subscribe_newsletter, name='subscribe-newsletter'),
    path('home/', HomePageView.as_view(), name='home-page'),
    path('about/', AboutPageView.as_view(), name='about-page'),
    path('team/', TeamMemberView.as_view(), name='team-member'),
    path('testimonials/', TestimonialView.as_view(), name='testimonial'),
    path('user_profile/', user_profile, name='user_profile'),
    path('chat/', ChatMessageView.as_view(), name='chat-message'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('accommodation-enquiry/', AccommodationEnquiryCreate.as_view(), name='accommodation-enquiry'),
    path('my-accommodation-enquiries/', UserAccommodationEnquiryList.as_view(), name='my-accommodation-enquiries'),
    path('accommodation-enquiries/<int:pk>/messages/', AccommodationEnquiryMessageCreate.as_view(), name='accommodation-enquiry-messages'),
    path('accommodation-enquiries/<int:pk>/mark-read/', AccommodationEnquiryMarkRead.as_view(), name='accommodation-enquiry-mark-read'),
] + router.urls + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    path('payments/intasend/initiate/', IntaSendInitiatePayment.as_view(), name='intasend-initiate'),
    path('payments/intasend/webhook/', IntaSendWebhook.as_view(), name='intasend-webhook'),
    path('pay/paypal/', pay_paypal, name='pay_paypal'),
    path('pay/mpesa/', pay_mpesa, name='pay_mpesa'),
    path('webhook/paypal/', webhook_paypal, name='webhook_paypal'),
    path('mpesa-callback/', mpesa_callback, name='mpesa_callback'),
]

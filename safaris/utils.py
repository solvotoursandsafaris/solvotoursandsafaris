from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_booking_confirmation(booking):
    """Send booking confirmation email to customer"""
    try:
        context = {
            'booking': booking,
            'safari': booking.safari,
        }
        
        html_message = render_to_string('emails/booking_confirmation.html', context)
        plain_message = render_to_string('emails/booking_confirmation.txt', context)
        
        send_mail(
            subject=f'Booking Confirmation - {booking.safari.title}',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.email],
            html_message=html_message,
            fail_silently=True  # Don't let email errors affect the booking process
        )
    except Exception as e:
        logger.error(f"Failed to send booking confirmation email: {str(e)}")
        # Continue with booking process even if email fails 
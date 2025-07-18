from django.core.management.base import BaseCommand
from safaris.models import Safari, Destination, Itinerary
from django.core.files.base import ContentFile
from django.conf import settings
import os
import shutil

class Command(BaseCommand):
    help = 'Creates initial safari packages'

    def handle(self, *args, **kwargs):
        safaris = [
            {
                "title": "Masai Mara Migration Safari",
                "destination_name": "Masai Mara National Reserve",
                "description": "Experience the Great Migration in the Masai Mara. This 4-day safari offers front-row seats to one of nature's most spectacular shows. Watch as millions of wildebeest and zebras cross the Mara River, with predators in pursuit.",
                "duration": 4,
                "price": 1299.00,
                "image": "masai-mara-safari.jpg",
                "included": """• Luxury tented camp accommodation
• All meals (breakfast, lunch, dinner)
• Professional safari guide
• 4x4 safari vehicle
• Game drives
• Park entrance fees
• Airport transfers
• Bottled water""",
                "excluded": """• International flights
• Travel insurance
• Visa fees
• Personal items
• Gratuities
• Hot air balloon safari (optional)"""
            },
            {
                "title": "Amboseli & Kilimanjaro View",
                "destination_name": "Amboseli National Park",
                "description": "A 3-day safari in Amboseli National Park, famous for its large elephant herds against the backdrop of Mount Kilimanjaro. Perfect for photography enthusiasts and wildlife lovers.",
                "duration": 3,
                "price": 999.00,
                "image": "amboseli-safari.jpg",
                "included": """• Lodge accommodation
• All meals
• Professional guide
• Game drives
• Park fees
• Transport
• Bottled water""",
                "excluded": """• Flights
• Travel insurance
• Personal items
• Tips
• Cultural village visits (optional)"""
            },
            {
                "title": "Tsavo Adventure Safari",
                "destination_name": "Tsavo East & West National Parks",
                "description": "Explore Kenya's largest national park complex over 5 days. See the famous red elephants, visit Mzima Springs, and experience diverse landscapes from savannah to volcanic hills.",
                "duration": 5,
                "price": 1499.00,
                "image": "tsavo-safari.jpg",
                "included": """• Mixed lodge/tented camp accommodation
• Full board meals
• Professional guide
• Game drives
• Park entrance fees
• Transport
• Bottled water""",
                "excluded": """• Flights
• Insurance
• Personal items
• Gratuities
• Optional activities"""
            },
            {
                "title": "Gorilla Trekking Experience",
                "destination_name": "Bwindi Impenetrable Forest",
                "description": "A unique 4-day adventure to track mountain gorillas in their natural habitat. Experience close encounters with these gentle giants and explore the beautiful Bwindi forest.",
                "duration": 4,
                "price": 2499.00,
                "image": "bwindi-safari.jpg",
                "included": """• Lodge accommodation
• All meals
• Gorilla permit
• Professional guide
• Forest trek
• Transport
• Local community visit""",
                "excluded": """• International flights
• Visa fees
• Travel insurance
• Personal items
• Tips
• Optional activities""",
                "itinerary_data": [
                    {
                        "day_number": 1,
                        "title": "Arrival in Entebbe",
                        "description": "Arrive at Entebbe International Airport, meet your guide, and transfer to your hotel. Briefing on the safari.",
                        "activities": ["Airport pickup", "Hotel check-in", "Safari briefing"],
                        "meals_included": ["dinner"],
                        "accommodation_name": "Entebbe Central Inn",
                        "start_time": "14:00",
                        "end_time": "18:00"
                    },
                    {
                        "day_number": 2,
                        "title": "Transfer to Bwindi",
                        "description": "Scenic drive to Bwindi Impenetrable Forest National Park. Enjoy the beautiful landscapes and local life along the way.",
                        "activities": ["Scenic drive", "Lunch en route", "Check into lodge"],
                        "meals_included": ["breakfast", "lunch", "dinner"],
                        "accommodation_name": "Bwindi Lodge",
                        "start_time": "08:00",
                        "end_time": "17:00"
                    },
                    {
                        "day_number": 3,
                        "title": "Gorilla Trekking Day",
                        "description": "The highlight of your safari! Trek through the forest to find a gorilla family. Spend an hour observing them.",
                        "activities": ["Gorilla trekking", "Photography", "Forest exploration"],
                        "meals_included": ["breakfast", "lunch", "dinner"],
                        "accommodation_name": "Bwindi Lodge",
                        "start_time": "07:00",
                        "end_time": "16:00"
                    },
                    {
                        "day_number": 4,
                        "title": "Departure",
                        "description": "After breakfast, drive back to Entebbe for your departure flight.",
                        "activities": ["Breakfast", "Drive to Entebbe", "Departure"],
                        "meals_included": ["breakfast"],
                        "accommodation_name": "",
                        "start_time": "08:00",
                        "end_time": "17:00"
                    }
                ]
            }
        ]

        # Create sample images directory if it doesn't exist
        sample_images_dir = os.path.join(settings.BASE_DIR, 'sample_images')
        os.makedirs(sample_images_dir, exist_ok=True)

        for safari_data in safaris:
            try:
                destination = Destination.objects.get(name=safari_data["destination_name"])
                
                # Create a placeholder image if it doesn't exist
                image_path = os.path.join(sample_images_dir, safari_data["image"])
                if not os.path.exists(image_path):
                    # Create an empty file as placeholder
                    with open(image_path, 'wb') as f:
                        f.write(b'')

                safari, created = Safari.objects.get_or_create(
                    title=safari_data["title"],
                    defaults={
                        "destination": destination,
                        "description": safari_data["description"],
                        "duration": safari_data["duration"],
                        "price": safari_data["price"],
                        "included": safari_data["included"],
                        "excluded": safari_data["excluded"],
                    }
                )

                # Add image if safari was created
                if created:
                    with open(image_path, 'rb') as f:
                        safari.image.save(safari_data["image"], ContentFile(f.read()), save=True)

                    # Create itineraries if data is provided
                    if "itinerary_data" in safari_data:
                        for day_data in safari_data["itinerary_data"]:
                            accommodation = None
                            if "accommodation_name" in day_data and day_data["accommodation_name"]:
                                # This assumes accommodation names are unique or you have a way to find them
                                # For simplicity, let's assume direct lookup by name for now.
                                try:
                                    accommodation = Accommodation.objects.get(name=day_data["accommodation_name"])
                                except Accommodation.DoesNotExist:
                                    self.stdout.write(self.style.WARNING(f'Accommodation \'{day_data["accommodation_name"]}\' not found for itinerary.'))

                            Itinerary.objects.create(
                                safari=safari,
                                day_number=day_data["day_number"],
                                title=day_data["title"],
                                description=day_data["description"],
                                activities=day_data.get("activities", []),
                                meals_included=day_data.get("meals_included", []),
                                accommodation=accommodation,
                                start_time=day_data.get("start_time"),
                                end_time=day_data.get("end_time")
                            )

            except Destination.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Destination not found: {safari_data["destination_name"]}')
                )

        self.stdout.write(self.style.SUCCESS('Successfully created safari packages')) 
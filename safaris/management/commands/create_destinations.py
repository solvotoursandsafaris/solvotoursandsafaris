from django.core.management.base import BaseCommand
from django.core.files import File
from safaris.models import Destination, Safari
import os

class Command(BaseCommand):
    help = 'Creates initial destinations and safaris'

    def handle(self, *args, **kwargs):
        # Kenya National Parks
        masai_mara = self.create_destination(
            name="Masai Mara National Reserve",
            location="Kenya",
            description="Home to the Great Migration and the Big Five. Experience the world's most spectacular wildlife show as millions of wildebeest cross the Mara River. Known for its exceptional big cat sightings and traditional Maasai culture.",
            highlights="Great Migration\nBig Five\nHot Air Balloon Safaris\nMaasai Villages",
            best_time="July to October (Migration Season)",
            image_path="destinations/masai_mara.jpg"
        )

        amboseli = self.create_destination(
            name="Amboseli National Park",
            location="Kenya",
            description="Famous for its large elephant herds and stunning views of Mount Kilimanjaro. The park offers some of the best opportunities to get close to free-ranging elephants.",
            highlights="Mount Kilimanjaro Views\nElephant Herds\nBird Watching\nObservation Hill",
            best_time="June to October, January to February",
            image_path="destinations/amboseli.jpg"
        )

        tsavo = self.create_destination(
            name="Tsavo East & West National Parks",
            location="Kenya",
            description="Kenya's largest national park complex, known for its red elephants, diverse landscapes, and rich biodiversity.",
            highlights="Red Elephants\nLugard Falls\nMzima Springs\nDiverse Landscapes",
            best_time="December to March, June to October",
            image_path="destinations/tsavo.jpg"
        )

        # Tanzania Destinations
        serengeti = self.create_destination(
            name="Serengeti National Park",
            location="Tanzania",
            description="Endless plains hosting the largest terrestrial mammal migration in the world. Offers year-round wildlife viewing and iconic African landscapes.",
            highlights="Great Migration\nBig Five\nBalloon Safaris\nKopjes",
            best_time="December to March (South), June to October (North)",
            image_path="destinations/serengeti.jpg"
        )

        ngorongoro = self.create_destination(
            name="Ngorongoro Crater",
            location="Tanzania",
            description="The world's largest intact volcanic caldera and a natural enclosure for a wide variety of wildlife.",
            highlights="Crater Views\nBig Five\nMaasai Culture\nDense Wildlife Population",
            best_time="June to September, December to March",
            image_path="destinations/ngorongoro.jpg"
        )

        # Rwanda Destinations
        volcanoes = self.create_destination(
            name="Volcanoes National Park",
            location="Rwanda",
            description="Home to endangered mountain gorillas and golden monkeys, set against the backdrop of the Virunga Mountains.",
            highlights="Gorilla Trekking\nGolden Monkey Tracking\nVolcano Hiking\nCultural Experiences",
            best_time="June to September, December to February",
            image_path="destinations/volcanoes.jpg"
        )

        # Uganda Destinations
        bwindi = self.create_destination(
            name="Bwindi Impenetrable Forest",
            location="Uganda",
            description="Home to half of the world's mountain gorilla population. A UNESCO World Heritage site offering intimate encounters with these gentle giants.",
            highlights="Gorilla Trekking\nBird Watching\nForest Walks\nBatwa Cultural Experiences",
            best_time="June to August, December to February",
            image_path="destinations/bwindi.jpg"
        )

        queen_elizabeth = self.create_destination(
            name="Queen Elizabeth National Park",
            location="Uganda",
            description="Famous for its tree-climbing lions and diverse ecosystems, from savannah to wetlands.",
            highlights="Tree-climbing Lions\nKazinga Channel\nChimpanzee Tracking\nCrater Drive",
            best_time="January to February, June to September",
            image_path="destinations/queen_elizabeth.jpg"
        )

        # Create Safaris
        self.create_safari(
            title="Gorilla Trekking Experience",
            destination=bwindi,
            description="A unique 4-day adventure to track mountain gorillas in their natural habitat. Experience close encounters with these gentle giants and explore the beautiful Bwindi forest.",
            duration=4,
            price=2499.00,
            included="Professional guide\nGorilla permit\nAccommodation\nMeals\nTransport",
            excluded="International flights\nVisa fees\nPersonal items\nTips",
            image_path="safaris/gorilla_trekking.jpg"
        )

        # Add more safaris...
        self.create_safari(
            title="Great Migration Safari",
            destination=masai_mara,
            description="Witness the spectacular wildebeest migration across the Mara River. This 6-day safari offers incredible wildlife viewing opportunities.",
            duration=6,
            price=3299.00,
            included="Game drives\nAccommodation\nMeals\nPark fees\nGuide",
            excluded="Flights\nVisa\nTravel insurance\nPersonal expenses",
            image_path="safaris/migration.jpg"
        )

        self.create_safari(
            title="Tanzania Complete",
            destination=ngorongoro,
            description="Experience the best of Tanzania combining Serengeti, Ngorongoro Crater, and Lake Manyara in this comprehensive safari adventure.",
            duration=8,
            price=4299.00,
            included="Luxury lodging\nGame drives\nCrater tour\nAll meals\nPrivate guide",
            excluded="Flights\nVisa\nTravel insurance\nPersonal items",
            image_path="safaris/tanzania_complete.jpg"
        )

        self.stdout.write(self.style.SUCCESS('Successfully created destinations and safaris'))

    def create_destination(self, name, location, description, highlights, best_time, image_path):
        try:
            image_full_path = os.path.join('media', image_path)
            destination = Destination.objects.create(
                name=name,
                location=location,
                description=description,
                highlights=highlights,
                best_time=best_time
            )
            if os.path.exists(image_full_path):
                with open(image_full_path, 'rb') as img_file:
                    destination.image.save(
                        os.path.basename(image_path),
                        File(img_file),
                        save=True
                    )
            return destination
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'Error creating destination {name}: {str(e)}'))
            return None

    def create_safari(self, title, destination, description, duration, price, included, excluded, image_path):
        try:
            image_full_path = os.path.join('media', image_path)
            safari = Safari.objects.create(
                title=title,
                destination=destination,
                description=description,
                duration=duration,
                price=price,
                included=included,
                excluded=excluded
            )
            if os.path.exists(image_full_path):
                with open(image_full_path, 'rb') as img_file:
                    safari.image.save(
                        os.path.basename(image_path),
                        File(img_file),
                        save=True
                    )
            return safari
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'Error creating safari {title}: {str(e)}'))
            return None 
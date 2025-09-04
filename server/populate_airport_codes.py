
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soar_backend.settings')
django.setup()

from api.models import AirportCode

def populate_airport_codes():
    """Populate the airport codes table with common airports"""
    airports = [
        # Major US Airports
        ('JFK', 'John F. Kennedy International Airport', 'New York', 'United States'),
        ('LAX', 'Los Angeles International Airport', 'Los Angeles', 'United States'),
        ('ORD', 'Chicago O\'Hare International Airport', 'Chicago', 'United States'),
        ('MIA', 'Miami International Airport', 'Miami', 'United States'),
        ('DFW', 'Dallas/Fort Worth International Airport', 'Dallas', 'United States'),
        ('SFO', 'San Francisco International Airport', 'San Francisco', 'United States'),
        ('SEA', 'Seattle-Tacoma International Airport', 'Seattle', 'United States'),
        ('LAS', 'McCarran International Airport', 'Las Vegas', 'United States'),
        ('PHX', 'Phoenix Sky Harbor International Airport', 'Phoenix', 'United States'),
        ('BOS', 'Logan International Airport', 'Boston', 'United States'),
        ('ATL', 'Hartsfield-Jackson Atlanta International Airport', 'Atlanta', 'United States'),
        ('DEN', 'Denver International Airport', 'Denver', 'United States'),
        
        # Major International Airports
        ('LHR', 'Heathrow Airport', 'London', 'United Kingdom'),
        ('CDG', 'Charles de Gaulle Airport', 'Paris', 'France'),
        ('FRA', 'Frankfurt Airport', 'Frankfurt', 'Germany'),
        ('AMS', 'Amsterdam Airport Schiphol', 'Amsterdam', 'Netherlands'),
        ('NRT', 'Narita International Airport', 'Tokyo', 'Japan'),
        ('ICN', 'Incheon International Airport', 'Seoul', 'South Korea'),
        ('SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore'),
        ('HKG', 'Hong Kong International Airport', 'Hong Kong', 'Hong Kong'),
        ('DXB', 'Dubai International Airport', 'Dubai', 'United Arab Emirates'),
        ('DOH', 'Hamad International Airport', 'Doha', 'Qatar'),
        ('PEK', 'Beijing Capital International Airport', 'Beijing', 'China'),
        ('PVG', 'Shanghai Pudong International Airport', 'Shanghai', 'China'),
        ('SYD', 'Sydney Kingsford Smith Airport', 'Sydney', 'Australia'),
        ('MEL', 'Melbourne Airport', 'Melbourne', 'Australia'),
        ('YYZ', 'Toronto Pearson International Airport', 'Toronto', 'Canada'),
        ('YVR', 'Vancouver International Airport', 'Vancouver', 'Canada'),
        
        # Business Travel Destinations
        ('ZUR', 'Zurich Airport', 'Zurich', 'Switzerland'),
        ('MUC', 'Munich Airport', 'Munich', 'Germany'),
        ('MAD', 'Madrid-Barajas Airport', 'Madrid', 'Spain'),
        ('FCO', 'Leonardo da Vinci International Airport', 'Rome', 'Italy'),
        ('MXP', 'Malpensa Airport', 'Milan', 'Italy'),
        ('VIE', 'Vienna International Airport', 'Vienna', 'Austria'),
        ('CPH', 'Copenhagen Airport', 'Copenhagen', 'Denmark'),
        ('ARN', 'Stockholm Arlanda Airport', 'Stockholm', 'Sweden'),
        ('OSL', 'Oslo Airport', 'Oslo', 'Norway'),
        ('HEL', 'Helsinki-Vantaa Airport', 'Helsinki', 'Finland'),
    ]
    
    created_count = 0
    updated_count = 0
    
    for code, name, city, country in airports:
        airport, created = AirportCode.objects.get_or_create(
            code=code,
            defaults={
                'name': name,
                'city': city,
                'country': country
            }
        )
        
        if created:
            created_count += 1
            print(f"Created: {code} - {name}")
        else:
            # Update existing record if data has changed
            if airport.name != name or airport.city != city or airport.country != country:
                airport.name = name
                airport.city = city
                airport.country = country
                airport.save()
                updated_count += 1
                print(f"Updated: {code} - {name}")
    
    print(f"\nAirport codes population completed:")
    print(f"Created: {created_count}")
    print(f"Updated: {updated_count}")
    print(f"Total airports in database: {AirportCode.objects.count()}")

if __name__ == '__main__':
    populate_airport_codes()

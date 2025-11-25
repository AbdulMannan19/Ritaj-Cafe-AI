import os
from dotenv import load_dotenv
import requests
from typing import Optional, Tuple, Dict
from math import radians, sin, cos, sqrt, atan2

load_dotenv()

RESTAURANT_LAT = 25.27496
RESTAURANT_LNG = 55.32946
MAX_DELIVERY_DISTANCE_KM = 5.0

class GeocodingService:
    def __init__(self):
        self.google_api_key = os.getenv("GOOGLE_MAPS_API_KEY")

    def geocode_address(self, address: str) -> Optional[Tuple[float, float]]:
        if not self.google_api_key:
            print("Warning: GOOGLE_MAPS_API_KEY not set")
            return None

        try:
            url = "https://maps.googleapis.com/maps/api/geocode/json"
            params = {"address": address, "key": self.google_api_key}

            response = requests.get(url, params=params)
            data = response.json()

            if data["status"] == "OK" and data["results"]:
                location = data["results"][0]["geometry"]["location"]
                return (location["lat"], location["lng"])
            else:
                print(f"Geocoding failed: {data.get('status')}")
                return None

        except Exception as e:
            print(f"Error geocoding address: {e}")
            return None

    def check_delivery_distance(self, delivery_address: str) -> Dict:

        delivery_coords = self.geocode_address(delivery_address)
        if not delivery_coords:
            return {
                "is_valid": False,
                "distance_km": None,
                "max_distance_km": MAX_DELIVERY_DISTANCE_KM,
                "message": "Unable to verify delivery address. Please provide a valid address.",
            }

        delivery_lat, delivery_lng = delivery_coords

        R = 6371.0

        lat1_rad = radians(RESTAURANT_LAT)
        lon1_rad = radians(RESTAURANT_LNG)
        lat2_rad = radians(delivery_lat)
        lon2_rad = radians(delivery_lng)

        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad

        a = sin(dlat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        distance = R * c

        is_valid = distance <= MAX_DELIVERY_DISTANCE_KM

        message = (
            ""
            if is_valid
            else f"Sorry, delivery address is {distance:.2f} km away. We only deliver within {MAX_DELIVERY_DISTANCE_KM} km."
        )

        return {
            "is_valid": is_valid,
            "distance_km": round(distance, 2),
            "max_distance_km": MAX_DELIVERY_DISTANCE_KM,
            "message": message,
        }


geocoding_service = GeocodingService()

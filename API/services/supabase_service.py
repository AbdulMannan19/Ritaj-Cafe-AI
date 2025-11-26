import os
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Optional, Dict, Any, List
from datetime import datetime

from .day_service import DayService

load_dotenv()


class SupabaseService:
    def __init__(self):
        supabase_url = os.getenv(
            "SUPABASE_URL", "https://bkqboaktmxvmcphvaaan.supabase.co"
        )
        supabase_key = os.getenv(
            "SUPABASE_ANON_KEY",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcWJvYWt0bXh2bWNwaHZhYWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzE5MzksImV4cCI6MjA3NTc0NzkzOX0.5MvF2YMKHAmY3CIRzPZuHpLyNY12KAnoZLCe4XFByCs",
        )

        self.supabase: Client = create_client(supabase_url, supabase_key)

    def get_menu_items(
        self, category: Optional[str] = None
    ) -> Dict[str, List[Dict[str, Any]]]:
        try:
            query = self.supabase.table("menu").select(
                "name, category, description, price, is_available"
            )

            if category:
                categories = [cat.strip() for cat in category.split(",")]
                # Capitalize first letter for case-insensitive matching
                categories = [cat.capitalize() for cat in categories]
                if len(categories) == 1:
                    query = query.eq("category", categories[0])
                else:
                    query = query.in_("category", categories)

            response = query.execute()

            current_day = DayService.get_current_day()

            grouped_menu = {}
            for item in response.data:
                # Check availability based on day
                if item.get("description") and "Available on" in item["description"]:
                    try:
                        required_day = item["description"].split("Available on")[1].strip()
                        # Case-insensitive check
                        if required_day.lower() != current_day.lower():
                            item["is_available"] = False
                    except Exception as e:
                        print(f"Error parsing day availability for {item['name']}: {e}")

                cat = item["category"]
                if cat not in grouped_menu:
                    grouped_menu[cat] = []
                item_without_category = {
                    k: v for k, v in item.items() if k != "category"
                }
                grouped_menu[cat].append(item_without_category)

            return grouped_menu

        except Exception as e:
            print(f"Error fetching menu items: {e}")
            return {}

    def place_order(
        self,
        items: Dict[str, int],
        delivery_address: str,
        customer_phone_number: str,
        special_requests: Optional[str] = None,
    ) -> Optional[int]:
        try:
            total_amount = 0
            items_with_ids = {}

            for item_name, quantity in items.items():
                menu_item = (
                    self.supabase.table("menu")
                    .select("item_id, price")
                    .eq("name", item_name)
                    .execute()
                )
                if menu_item.data:
                    item_id = menu_item.data[0]["item_id"]
                    price = float(menu_item.data[0]["price"])
                    items_with_ids[str(item_id)] = quantity
                    total_amount += price * quantity
                else:
                    print(f"Item '{item_name}' not found in menu")
                    return None

            order_data = {
                "items": items_with_ids,
                "total_amount": total_amount,
                "special_requests": special_requests,
                "delivery_address": delivery_address,
                "customer_phone_number": customer_phone_number,
                "order_date": datetime.now().isoformat(),
                "status": "PREPARING",
            }

            order_response = self.supabase.table("orders").insert(order_data).execute()

            if order_response.data:
                return order_response.data[0]["order_id"]
            else:
                return None

        except Exception as e:
            print(f"Error placing order: {e}")
            return None

    def get_order_status(self, phone_number: str) -> List[Dict[str, Any]]:
        try:
            response = (
                self.supabase.table("orders")
                .select(
                    "order_id, items, total_amount, special_requests, order_date, delivery_address, status, courier_name, courier_phone_number"
                )
                .eq("customer_phone_number", phone_number)
                .execute()
            )

            # Replace item_ids with item names and format order_date in each order
            for order in response.data:
                if "items" in order and order["items"]:
                    items_with_names = {}
                    for item_id, quantity in order["items"].items():
                        # Look up item name by item_id
                        menu_item = (
                            self.supabase.table("menu")
                            .select("name")
                            .eq("item_id", int(item_id))
                            .execute()
                        )
                        if menu_item.data:
                            item_name = menu_item.data[0]["name"]
                            items_with_names[item_name] = quantity
                        else:
                            # Fallback to item_id if name not found
                            items_with_names[f"Item {item_id}"] = quantity

                    order["items"] = items_with_names

                # Format order_date to be more readable (YYYY-MM-DD HH:MM)
                if "order_date" in order and order["order_date"]:
                    try:
                        dt = datetime.fromisoformat(
                            order["order_date"].replace("Z", "+00:00")
                        )
                        order["order_date"] = dt.strftime("%Y-%m-%d %H:%M")
                    except:
                        # Keep original if parsing fails
                        pass

            return response.data

        except Exception as e:
            print(f"Error fetching order status: {e}")
            return []

import os
from dotenv import load_dotenv
import google.generativeai as genai
from typing import Dict, Any, Optional
from .supabase_service import SupabaseService
from .geocoding_service import GeocodingService
from .day_service import DayService

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
RESTAURANT_NAME = "Ritaj Restaurant"
MENU_LINK = "https://baba-chai.vercel.app"


def generate_system_prompt(menu_data: Dict[str, Any]) -> str:
    
    menu_text = "MENU:\n\n"
    for category, items in menu_data.items():
        menu_text += f"{category.upper()}:\n"
        for item in items:
            menu_text += f"  - {item['name']} ${item['price']}"
            if not item.get('is_available', True):
                menu_text += " (Not available currently)"
            menu_text += "\n"
        menu_text += "\n"
    
    # Add hardcoded daily specials
    menu_text += """DAILY SPECIALS (All $18.00, available only on specific days):

LUNCH:
  - Kadhai Gosht with Batana Rice (Monday)
  - Khichdi Khatta Keema (Tuesday)
  - Green Mutton (Tuesday)
  - Mutton Khorma with Bagara Khana-Dalcha (Wednesday)
  - Dum Ka Mutton (Thursday)
  - Mutton Maikhaliya (Friday)
  - Mutton Khorma with Bagara Khana-Dalcha (Saturday)
  - Hyderabadi Mutton with Zeera Rice (Sunday)

DINNER:
  - Turai Gosht (Monday)
  - Gosht Ki Kadhi (Tuesday)
  - Mutton Marag (Wednesday)
  - Mutton Do Peyaza (Wednesday)
  - Tomato Gosht (Thursday)
  - Alo-Methi Gosht (Friday)
  - Arwi Gosht (Saturday)
  - Kofta Masala (Saturday)
  - Bhindi Gosht (Sunday)

"""
    
    return f"""You are Emma, a friendly assistant for {RESTAURANT_NAME}. Help customers browse menu, place orders, and check order status.

GREETING: Always start the first conversation with: "Hello, I am Emma from {RESTAURANT_NAME}, what would you like to order today?"

{menu_text}

MENU SHARING:
- If customer asks for full menu, share this link: {MENU_LINK}
- You already have the complete menu above - use it to help customers

DAILY SPECIALS:
- When customer asks about daily specials or today's specials, ALWAYS use get_current_day() tool first
- The tool returns the current day in UAE timezone
- Then recommend the appropriate lunch/dinner specials for that day

Available tools:
- place_order(items: dict, delivery_address: string, special_requests: optional string) - Place order
- get_order_status() - Check customer's orders
- get_current_day() - Get the current day of the week (UAE time) to check daily specials availability

IMPORTANT ORDERING RULES:
1. Match customer's item names to actual menu items (e.g., "Glory milkshake" → "Glory", "fries" → "French Fries")
2. Use EXACT menu item names from the menu above when calling place_order
3. Before placing orders, collect: items with quantities, delivery address
4. Items format: {{"Exact Menu Item Name": quantity}}

ORDER CONFIRMATION FLOW (CRITICAL):
1. After collecting items and address, CALCULATE the total price using menu prices
2. CONFIRM with customer by showing:
   - List of all items with quantities
   - Individual prices
   - Total price
   - Delivery address
3. Ask: "Would you like to confirm this order?"
4. ONLY call place_order tool AFTER customer confirms (says yes, confirm, ok, etc.)
5. If customer says no or wants to change, let them modify the order

POST-ORDER CONFIRMATION:
- When order is placed successfully, DO NOT mention the Order ID number to the customer
- Instead say: "Your order has been placed successfully! We'll keep you updated on WhatsApp."
- Be warm and friendly

Example flow:
- Customer: "I want a Glory milkshake and fries"
- You: Ask for delivery address
- Customer: "123 Main St"
- You: "Let me confirm your order:
       - Glory x1 - $5.99
       - French Fries x1 - $3.99
       Total: $9.98
       Delivery to: 123 Main St
       Would you like to confirm this order?"
- Customer: "Yes"
- You: Call place_order with {{"Glory": 1, "French Fries": 1, "delivery_address": "123 Main St"}}
- You: "Your order has been placed successfully! We'll keep you updated on WhatsApp."
"""

class ToolHandler:
    def __init__(
        self,
        phone_number: str,
        db_service: Optional[SupabaseService] = None,
        geocoding_service: Optional[GeocodingService] = None,
        day_service: Optional[DayService] = None,
    ):
        self.phone_number = phone_number
        self.db_service = db_service or SupabaseService()
        self.geocoding_service = geocoding_service or GeocodingService()
        self.day_service = day_service or DayService()

    def execute_tool(self, tool_name: str, tool_input: Dict[str, Any]) -> str:
        try:
            if tool_name == "place_order":
                return self._place_order(tool_input)
            elif tool_name == "get_order_status":
                return self._get_order_status()
            elif tool_name == "get_current_day":
                return self._get_current_day()
            else:
                return f"Unknown tool: {tool_name}"
        except Exception as e:
            return f"Error: {str(e)}"

    def _get_menu(self, category: str = None) -> str:
        menu_data = self.db_service.get_menu_items(category)
        
        if not menu_data:
            return "No menu items found"
        
        result = "MENU:\n\n"
        for cat, items in menu_data.items():
            result += f"{cat.upper()}:\n"
            for item in items:
                result += f"- {item['name']} ${item['price']}\n"
            result += "\n"
        return result

    def _place_order(self, order_data: Dict[str, Any]) -> str:
        if not order_data.get("items"):
            return "Error: No items specified in the order"

        if not order_data.get("delivery_address"):
            return "Error: No delivery address specified"

        delivery_address = order_data["delivery_address"]

        # Check delivery distance (commented out - no Google Maps API key yet)
        # distance_check = self.geocoding_service.check_delivery_distance(
        #     delivery_address
        # )
        # if not distance_check["is_valid"]:
        #     return distance_check["message"]

        # Convert items to dict (handles MapComposite from Gemini)
        items = order_data.get("items", {})

        # Convert MapComposite or any dict-like object to regular dict
        if not isinstance(items, dict):
            try:
                items = dict(items)
            except:
                return f"Error: Cannot convert items to dictionary, got {type(items)}"

        # Convert any numeric string values to integers
        cleaned_items = {}
        for item_name, quantity in items.items():
            try:
                cleaned_items[str(item_name)] = int(quantity)
            except (ValueError, TypeError):
                return f"Error: Invalid quantity for {item_name}: {quantity}"

        # Place order using database service
        order_id = self.db_service.place_order(
            items=cleaned_items,
            delivery_address=delivery_address,
            customer_phone_number=self.phone_number,
            special_requests=order_data.get("special_requests"),
        )

        if order_id:
            return f"Order placed! Order ID: {order_id}"
        else:
            return "Failed to place order. Please check if all items exist in the menu."

    def _get_order_status(self) -> str:
        orders = self.db_service.get_order_status(self.phone_number)
        
        if not orders:
            return "No orders found"

        result = f"Your Orders ({len(orders)}):\n\n"
        for order in orders:
            result += f"Order #{order['order_id']} - {order['status']}\n"
            result += f"Items: {order['items']}\n"
            result += f"Total: ${order['total_amount']}\n\n"
        return result
    
    def _get_current_day(self) -> str:
        """Get the current day of the week"""
        return self.day_service.get_current_day()


class LLMService:
    def __init__(self, phone_number: str):
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not found")

        genai.configure(api_key=GEMINI_API_KEY)

        # Initialize services
        self.db_service = SupabaseService()
        self.geocoding_service = GeocodingService()
        
        # Fetch menu once at initialization
        menu_data = self.db_service.get_menu_items()
        system_prompt = generate_system_prompt(menu_data)

        # Define tools for Gemini (removed get_menu tool)
        tools = [
            genai.protos.Tool(
                function_declarations=[
                    genai.protos.FunctionDeclaration(
                        name="place_order",
                        description="Places a food order for the customer. Items should be a dictionary mapping exact menu item names to their quantities as integers.",
                        parameters=genai.protos.Schema(
                            type=genai.protos.Type.OBJECT,
                            properties={
                                "items": genai.protos.Schema(
                                    type=genai.protos.Type.OBJECT,
                                    description="Dictionary mapping exact menu item names (strings) to quantities (integers). Example: {'French Fries': 1, 'Burger': 2}",
                                ),
                                "delivery_address": genai.protos.Schema(
                                    type=genai.protos.Type.STRING,
                                    description="Full delivery address",
                                ),
                                "special_requests": genai.protos.Schema(
                                    type=genai.protos.Type.STRING,
                                    description="Optional special instructions",
                                ),
                            },
                            required=["items", "delivery_address"],
                        ),
                    ),
                    genai.protos.FunctionDeclaration(
                        name="get_order_status",
                        description="Gets order status for the customer",
                        parameters=genai.protos.Schema(
                            type=genai.protos.Type.OBJECT, properties={}
                        ),
                    ),
                    genai.protos.FunctionDeclaration(
                        name="get_current_day",
                        description="Gets the current day of the week (e.g., Monday, Tuesday) to check which daily specials are available",
                        parameters=genai.protos.Schema(
                            type=genai.protos.Type.OBJECT, properties={}
                        ),
                    ),
                ]
            )
        ]

        # Initialize model with dynamic system prompt
        self.model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_prompt,
            tools=tools,
        )

        # Initialize tool handler
        self.tool_handler = ToolHandler(
            phone_number, self.db_service, self.geocoding_service
        )
        self.chat_session = self.model.start_chat(
            enable_automatic_function_calling=True
        )

    def chat(self, user_message: str) -> str:
        try:
            # Manual function calling approach
            response = self.chat_session.send_message(user_message)

            # Handle function calls manually
            max_iterations = 5  # Prevent infinite loops
            iteration = 0

            while iteration < max_iterations:
                # Check if response has function calls
                if (
                    not response.candidates
                    or not response.candidates[0].content.parts
                ):
                    break

                has_function_call = False

                for part in response.candidates[0].content.parts:
                    if hasattr(part, "function_call") and part.function_call.name:
                        has_function_call = True
                        func_call = part.function_call
                        tool_name = func_call.name
                        tool_args = dict(func_call.args) if func_call.args else {}

                        print(f"[Using: {tool_name}]")
                        if tool_name == "place_order":
                            print(f"[Debug] Order data: {tool_args}")

                        # Execute tool
                        result = self.tool_handler.execute_tool(tool_name, tool_args)
                        print(
                            f"[Debug] Tool result: {result[:200]}..."
                        )  # Print first 200 chars

                        # Send function response back
                        response = self.chat_session.send_message(
                            genai.protos.Content(
                                parts=[
                                    genai.protos.Part(
                                        function_response=genai.protos.FunctionResponse(
                                            name=tool_name, response={"result": result}
                                        )
                                    )
                                ]
                            )
                        )
                        break  # Process one function at a time

                if not has_function_call:
                    break

                iteration += 1

            # Extract text response
            if response.candidates and response.candidates[0].content.parts:
                for part in response.candidates[0].content.parts:
                    if hasattr(part, "text") and part.text:
                        return part.text

            return "I'm having trouble responding. Please try again."

        except Exception as e:
            return f"Error: {str(e)}"

    def reset_conversation(self):
        """Reset chat session (keeps same menu data)"""
        self.chat_session = self.model.start_chat(
            enable_automatic_function_calling=True
        )
    
    def refresh_menu(self):
        """Refresh menu data and recreate model (call this when menu updates)"""
        menu_data = self.db_service.get_menu_items()
        system_prompt = generate_system_prompt(menu_data)
        
        self.model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_prompt,
            tools=self.model._tools,
        )
        self.chat_session = self.model.start_chat(
            enable_automatic_function_calling=True
        )

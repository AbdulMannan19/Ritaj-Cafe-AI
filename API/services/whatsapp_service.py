import os
import hmac
import hashlib
import requests
from dotenv import load_dotenv
from typing import Dict, Optional
from .llm_service import LLMService

load_dotenv()


class WhatsAppService:
    def __init__(self):
        self.phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
        self.access_token = os.getenv("WHATSAPP_ACCESS_TOKEN")
        self.app_secret = os.getenv("WHATSAPP_APP_SECRET")
        self.verify_token = os.getenv("VERIFY_TOKEN")
        self.graph_url = (
            f"https://graph.facebook.com/v20.0/{self.phone_number_id}/messages"
        )

        # Store active chat sessions (in production, use Redis or database)
        self.chat_sessions = {}

    def verify_webhook(self, mode: str, token: str, challenge: str) -> tuple:
        """Verify webhook for WhatsApp"""
        if mode == "subscribe" and token == self.verify_token:
            print(f"✅ Webhook verified with token: {token}")
            return challenge, 200
        print("❌ Webhook verification failed")
        return "Verification failed", 403

    def verify_signature(self, request_data: bytes, signature: str) -> bool:
        """Verify webhook signature for security"""
        if not signature:
            return False

        try:
            sha, signature_hash = signature.split("=")
            mac = hmac.new(
                self.app_secret.encode(), request_data, hashlib.sha256
            ).hexdigest()
            return hmac.compare_digest(mac, signature_hash)
        except Exception as e:
            print(f"Signature verification error: {e}")
            return False

    def process_webhook_event(self, data: Dict) -> str:
        """Process incoming WhatsApp message"""
        try:
            entry = data["entry"][0]
            changes = entry["changes"][0]["value"]
            messages = changes.get("messages")

            if messages:
                msg = messages[0]
                sender = msg["from"]
                text = msg["text"]["body"]

                print(f"User: {text}")

                # Get or create chat session for this user
                if sender not in self.chat_sessions:
                    print(f"🆕 Creating new chat session for {sender}")
                    self.chat_sessions[sender] = LLMService(sender)

                # Get response from LLM
                llm = self.chat_sessions[sender]
                response = llm.chat(text)

                # Send response back
                self.send_message(sender, response)
                print(f"Bot: {response}")

            return "EVENT_RECEIVED"

        except Exception as e:
            print(f"❌ Error processing message: {e}")
            import traceback

            traceback.print_exc()
            return "ERROR"

    def send_message(self, to: str, text: str) -> Dict:
        """Send a WhatsApp message"""
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
        }

        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "text",
            "text": {"body": text},
        }

        try:
            response = requests.post(self.graph_url, headers=headers, json=payload)
            print(f"📤 Send Message Response: {response.status_code}")
            return response.json()
        except Exception as e:
            print(f"❌ Error sending message: {e}")
            return {"error": str(e)}

    def get_active_sessions_count(self) -> int:
        """Get count of active chat sessions"""
        return len(self.chat_sessions)


# Singleton instance
whatsapp_service = WhatsAppService()

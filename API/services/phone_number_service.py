class PhoneNumberService:
    def __init__(self):
        self._phone_by_call_id = {}

    def set_phone(self, call_id: str, phone_number: str) -> bool:
        if not call_id:
            return False
        self._phone_by_call_id[call_id] = phone_number
        return True

    def get_phone(self, call_id: str) -> str:
        return self._phone_by_call_id.get(call_id)

    def clear_phone(self, call_id: str) -> bool:
        if call_id in self._phone_by_call_id:
            del self._phone_by_call_id[call_id]
            return True
        return False

    def get_active_sessions_count(self) -> int:
        return len(self._phone_by_call_id)


phone_number_service = PhoneNumberService()

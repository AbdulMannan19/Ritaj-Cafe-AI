from datetime import datetime
import pytz


class DayService:
    @staticmethod
    def get_current_day() -> str:
        uae_tz = pytz.timezone('Asia/Dubai')
        uae_time = datetime.now(uae_tz)
        return uae_time.strftime("%A")

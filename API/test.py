from services.llm_service import LLMService
from dotenv import load_dotenv

load_dotenv()

def main():
    print("=== Restaurant Chat Test ===")
    print("Type 'exit' or 'quit' to stop\n")
    
    test_phone = "+19132636353"
    llm_service = LLMService(phone_number=test_phone)
    
    print("Bot: Starting conversation...\n")
    
    while True:
        user_input = input("You: ").strip()
        
        if user_input.lower() in ['exit', 'quit', 'q']:
            print("Goodbye!")
            break
            
        if not user_input:
            continue
            
        response = llm_service.chat(user_input)
        print(f"\nBot: {response}\n")

if __name__ == "__main__":
    main()

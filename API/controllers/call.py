from flask import Blueprint, request, jsonify
from services import SupabaseService, phone_number_service, whatsapp_service

call_bp = Blueprint('call', __name__, url_prefix='/call')
db_service = SupabaseService()

@call_bp.route('/webhook', methods=['POST'])
def register_call():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    call_data = data.get('call', {})
    
    call_id = call_data.get('call_id')
    phone_number = call_data.get('from_number') or call_data.get('caller_id')
    
    if not call_id:
        return jsonify({'error': 'call_id is required'}), 400
    
    if not phone_number:
        return jsonify({'error': 'phone_number is required'}), 400
    
    phone_number_service.set_phone(call_id, phone_number)
    
    print(f"Call: {call_id} | Phone: {phone_number}")
    
    return jsonify({
        'message': 'Call registered successfully',
        'call_id': call_id,
        'phone_number': phone_number
    }), 200


@call_bp.route('/place-order', methods=['POST'])
def place_order():
    """Place an order via call"""
    raw_data = request.get_json()
    
    if not raw_data:
        return jsonify({'error': 'No JSON data provided'}), 400
    
    # Extract real call_id from nested 'call' object
    call_data = raw_data.get('call', {})
    call_id = call_data.get('call_id')
    
    if not call_id:
        return jsonify({'error': 'call_id is required'}), 400
    
    # Get order data from 'args'
    args = raw_data.get('args', {})
    
    items = args.get('items')
    delivery_address = args.get('delivery_address')
    special_requests = args.get('special_requests')
    
    if not items:
        return jsonify({'error': 'items is required'}), 400
    
    if not delivery_address:
        return jsonify({'error': 'delivery_address is required'}), 400
    
    # Get phone number from call session
    customer_phone_number = phone_number_service.get_phone(call_id)
    
    if not customer_phone_number:
        return jsonify({'error': f'No phone number for call_id: {call_id}'}), 400
    
    order_id = db_service.place_order(items, delivery_address, customer_phone_number, special_requests)
    
    if order_id:
        print(f"✅ Order {order_id} placed for {customer_phone_number}")
        return jsonify({'order_id': order_id, 'message': 'Order placed successfully'}), 201
    else:
        return jsonify({'error': 'Failed to place order'}), 500


@call_bp.route('/order-status', methods=['POST'])
def get_order_status():
    """Get order/delivery status for a call session"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Extract real call_id from nested 'call' object
    call_data = data.get('call', {})
    call_id = call_data.get('call_id')
    
    if not call_id:
        return jsonify({'error': 'call_id is required'}), 400
    
    phone_number = phone_number_service.get_phone(call_id)
    
    if not phone_number:
        return jsonify({'error': f'No phone number for call_id: {call_id}'}), 400
    
    orders = db_service.get_order_status(phone_number)
    
    print(f"📋 Order status checked for {phone_number}")
    
    return jsonify(orders)


@call_bp.route('/send-menu', methods=['POST'])
def send_menu_link():
    """Send menu link to customer via WhatsApp"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    call_data = data.get('call', {})
    call_id = call_data.get('call_id')
    
    if not call_id:
        return jsonify({'error': 'call_id is required'}), 400
    
    phone_number = phone_number_service.get_phone(call_id)
    
    if not phone_number:
        return jsonify({'error': f'No phone for call_id: {call_id}'}), 400
    
    message = "Here's our complete menu: https://baba-chai.vercel.app"
    
    try:
        whatsapp_service.send_message(phone_number, message)
        print(f"✅ Menu sent to {phone_number}")
        
        return jsonify({
            'message': 'Menu link sent',
            'phone_number': phone_number
        }), 200
    except Exception as e:
        print(f"❌ WhatsApp error: {e}")
        return jsonify({'error': str(e)}), 500


@call_bp.route('/get-current-day', methods=['POST'])
def get_current_day():
    """Get the current day of the week for daily specials"""
    from services.day_service import DayService
    
    day_service = DayService()
    current_day = day_service.get_current_day()
    
    print(f"📅 Current day requested: {current_day}")
    
    return jsonify({'day': current_day}), 200

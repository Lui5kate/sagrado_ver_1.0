from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import MenuItem, Order, OrderItem
from django.core.mail import send_mail
from django.conf import settings
import json
from decimal import Decimal

def home(request):
    return render(request, 'home.html')

def about(request):
    return render(request, 'about.html')

def menu(request):
    menu_items = MenuItem.objects.filter(is_available=True)
    categories = MenuItem.objects.values_list('category', flat=True).distinct()
    return render(request, 'menu.html', {
        'menu_items': menu_items,
        'categories': categories
    })

def contact(request):
    return render(request, 'contact.html')

def book(request):
    return render(request, 'book.html')

def order_online(request):
    menu_items = MenuItem.objects.filter(is_available=True)
    categories = MenuItem.objects.values_list('category', flat=True).distinct()
    return render(request, 'order.html', {
        'menu_items': menu_items,
        'categories': categories
    })

@csrf_exempt
def submit_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Crear el pedido
            order = Order.objects.create(
                name=data['name'],
                email=data['email'],
                phone=data['phone'],
                address=data['address'],
                notes=data.get('notes', ''),
                total_amount=Decimal(data['total_amount'])
            )
            
            # Crear los items del pedido
            items_text = ''
            for item in data['items']:
                menu_item = MenuItem.objects.get(id=item['id'])
                OrderItem.objects.create(
                    order=order,
                    menu_item=menu_item,
                    quantity=item['quantity'],
                    price=menu_item.price
                )
                items_text += f"- {menu_item.name} x{item['quantity']} (${menu_item.price})\n"
            
            # Enviar correo al restaurante
            subject = f"Nuevo pedido de {order.name}"
            message = f"Has recibido un nuevo pedido en línea:\n\n"
            message += f"Nombre: {order.name}\nEmail: {order.email}\nTeléfono: {order.phone}\nDirección: {order.address}\nNotas: {order.notes}\n\n"
            message += f"Productos:\n{items_text}\nTotal: ${order.total_amount}\n"
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.RESTAURANT_EMAIL],
                fail_silently=True
            )
            # Enviar correo al cliente
            subject_cliente = "Confirmación de tu pedido en Sagrado Cantina"
            message_cliente = f"Hola {order.name},\n\nGracias por tu pedido. Estos son los detalles:\n\n"
            message_cliente += f"Productos:\n{items_text}\nTotal: ${order.total_amount}\n\nPronto nos pondremos en contacto contigo para confirmar la entrega.\n\n¡Gracias por elegirnos!"
            send_mail(
                subject_cliente,
                message_cliente,
                settings.DEFAULT_FROM_EMAIL,
                [order.email],
                fail_silently=True
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Pedido recibido. Te enviaremos un correo con la confirmación.',
                'order_id': order.id
            })
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)

@login_required
def order_history(request):
    orders = Order.objects.filter(customer=request.user).order_by('-order_date')
    return render(request, 'order_history.html', {'orders': orders})

@login_required
def order_detail(request, order_id):
    order = Order.objects.get(id=order_id, customer=request.user)
    return render(request, 'order_detail.html', {'order': order})

# Sistema de Pagos - Sagrado Cantina

Este documento contiene las instrucciones para configurar el sistema de pagos integrado en el sitio web de Sagrado Cantina.

## Pasarelas de Pago Soportadas

El sistema incluye integración con las siguientes pasarelas de pago:

### 1. Stripe
- **Descripción**: Procesamiento de tarjetas de crédito/débito
- **Tarjetas soportadas**: Visa, Mastercard, American Express, Discover
- **Moneda**: NZD (Dólar Neozelandés)
- **Configuración**: Requiere cuenta de Stripe y claves API

### 2. PayPal
- **Descripción**: Pagos a través de cuenta PayPal
- **Moneda**: NZD
- **Configuración**: Requiere cuenta de PayPal Business y credenciales

### 3. Square
- **Descripción**: Procesamiento de tarjetas de crédito/débito
- **Tarjetas soportadas**: Visa, Mastercard, American Express, Discover
- **Moneda**: NZD
- **Configuración**: Requiere cuenta de Square

### 4. Afterpay
- **Descripción**: Compra ahora, paga después
- **Moneda**: NZD
- **Configuración**: Requiere cuenta de Afterpay Business

## Configuración Paso a Paso

### 1. Configuración de Stripe

1. **Crear cuenta Stripe**:
   - Ve a [stripe.com](https://stripe.com)
   - Regístrate para una cuenta de negocio
   - Completa la verificación de identidad

2. **Obtener claves API**:
   - En el dashboard de Stripe, ve a Developers > API keys
   - Copia la "Publishable key" y "Secret key"

3. **Configurar en el código**:
   ```javascript
   // En static/js/payment.js, línea 89
   this.stripe = Stripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY');
   ```
   
   Reemplaza `YOUR_STRIPE_PUBLISHABLE_KEY` con tu clave pública de Stripe.

4. **Configurar en Django** (backend):
   ```python
   # En settings.py
   STRIPE_PUBLISHABLE_KEY = 'pk_test_your_key_here'
   STRIPE_SECRET_KEY = 'sk_test_your_secret_key_here'
   ```

### 2. Configuración de PayPal

1. **Crear cuenta PayPal Business**:
   - Ve a [paypal.com](https://paypal.com)
   - Regístrate para una cuenta Business
   - Completa la verificación

2. **Obtener credenciales**:
   - En el dashboard de PayPal, ve a Tools > API credentials
   - Crea una nueva aplicación
   - Copia el Client ID

3. **Configurar en el código**:
   ```javascript
   // En static/js/payment.js, línea 95
   paypalScript.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=NZD';
   ```
   
   Reemplaza `YOUR_PAYPAL_CLIENT_ID` con tu Client ID de PayPal.

### 3. Configuración de Square

1. **Crear cuenta Square**:
   - Ve a [square.com](https://square.com)
   - Regístrate para una cuenta de negocio
   - Completa la verificación

2. **Obtener credenciales**:
   - En el dashboard de Square, ve a Developers > API keys
   - Crea una nueva aplicación
   - Copia las credenciales

3. **Configurar en Django**:
   ```python
   # En settings.py
   SQUARE_APPLICATION_ID = 'your_application_id'
   SQUARE_ACCESS_TOKEN = 'your_access_token'
   SQUARE_LOCATION_ID = 'your_location_id'
   ```

### 4. Configuración de Afterpay

1. **Crear cuenta Afterpay Business**:
   - Ve a [afterpay.com](https://afterpay.com)
   - Regístrate para una cuenta de negocio
   - Completa la verificación

2. **Obtener credenciales**:
   - Contacta con Afterpay para obtener credenciales de API
   - Configura tu tienda en su sistema

3. **Configurar en Django**:
   ```python
   # En settings.py
   AFTERPAY_PUBLIC_KEY = 'your_public_key'
   AFTERPAY_SECRET_KEY = 'your_secret_key'
   AFTERPAY_ENVIRONMENT = 'sandbox'  # o 'production'
   ```

## Configuración del Backend (Django)

### 1. Instalar dependencias

```bash
pip install stripe
pip install paypal-checkout-serversdk
pip install square
```

### 2. Crear vistas de API

Crea las siguientes vistas en tu aplicación Django:

```python
# views.py
import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def process_payment(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        try:
            # Crear el pago con Stripe
            payment_intent = stripe.PaymentIntent.create(
                amount=int(float(data['amount']) * 100),  # Convertir a centavos
                currency=data['currency'],
                payment_method=data['payment_method_id'],
                confirm=True,
                return_url=request.build_absolute_uri('/payment-success/')
            )
            
            return JsonResponse({
                'success': True,
                'transaction_id': payment_intent.id,
                'amount': data['amount']
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})
```

### 3. Configurar URLs

```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/process-payment/', views.process_payment, name='process_payment'),
    path('api/square-payment/', views.square_payment, name='square_payment'),
    path('api/afterpay-payment/', views.afterpay_payment, name='afterpay_payment'),
    path('payment-success/', views.payment_success, name='payment_success'),
]
```

## Configuración de Seguridad

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Square
SQUARE_APPLICATION_ID=your_square_app_id
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_LOCATION_ID=your_square_location_id

# Afterpay
AFTERPAY_PUBLIC_KEY=your_afterpay_public_key
AFTERPAY_SECRET_KEY=your_afterpay_secret_key
AFTERPAY_ENVIRONMENT=sandbox
```

### 2. Configuración de Django Settings

```python
# settings.py
import os
from dotenv import load_dotenv

load_dotenv()

# Payment settings
STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY')
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID')
PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET')
SQUARE_APPLICATION_ID = os.getenv('SQUARE_APPLICATION_ID')
SQUARE_ACCESS_TOKEN = os.getenv('SQUARE_ACCESS_TOKEN')
SQUARE_LOCATION_ID = os.getenv('SQUARE_LOCATION_ID')
AFTERPAY_PUBLIC_KEY = os.getenv('AFTERPAY_PUBLIC_KEY')
AFTERPAY_SECRET_KEY = os.getenv('AFTERPAY_SECRET_KEY')
AFTERPAY_ENVIRONMENT = os.getenv('AFTERPAY_ENVIRONMENT', 'sandbox')
```

## Pruebas

### 1. Modo Sandbox/Test

Todas las pasarelas de pago ofrecen entornos de prueba:

- **Stripe**: Usa claves que empiecen con `pk_test_` y `sk_test_`
- **PayPal**: Usa el entorno Sandbox
- **Square**: Usa el entorno Sandbox
- **Afterpay**: Usa el entorno Sandbox

### 2. Tarjetas de Prueba

#### Stripe
- **Visa**: 4242424242424242
- **Mastercard**: 5555555555554444
- **American Express**: 378282246310005
- **CVC**: Cualquier número de 3 dígitos
- **Fecha de expiración**: Cualquier fecha futura

#### PayPal
- Usa una cuenta de PayPal Sandbox para pruebas

## Producción

### 1. Cambiar a Modo Producción

1. **Stripe**: Cambia a claves que empiecen con `pk_live_` y `sk_live_`
2. **PayPal**: Cambia al entorno Live
3. **Square**: Cambia al entorno Production
4. **Afterpay**: Cambia al entorno Production

### 2. SSL/HTTPS

Asegúrate de que tu sitio web use HTTPS en producción, ya que es requerido por todas las pasarelas de pago.

### 3. Webhooks

Configura webhooks para recibir notificaciones de pagos:

```python
# webhooks.py
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)
    
    # Manejar el evento
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        # Procesar el pago exitoso
        
    return HttpResponse(status=200)
```

## Soporte

Para soporte técnico con las pasarelas de pago:

- **Stripe**: [support.stripe.com](https://support.stripe.com)
- **PayPal**: [developer.paypal.com](https://developer.paypal.com)
- **Square**: [developer.squareup.com](https://developer.squareup.com)
- **Afterpay**: [developers.afterpay.com](https://developers.afterpay.com)

## Notas Importantes

1. **Nunca expongas las claves secretas** en el código del frontend
2. **Siempre valida los pagos** en el backend
3. **Usa HTTPS** en producción
4. **Mantén actualizadas** las dependencias de las pasarelas de pago
5. **Prueba exhaustivamente** antes de ir a producción
6. **Cumple con las regulaciones** locales de Nueva Zelanda para pagos en línea 
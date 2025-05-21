from django.db import models
from django.contrib.auth.models import User

class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.CharField(max_length=50)
    image = models.ImageField(upload_to='menu_items/', null=True, blank=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('confirmed', 'Confirmado'),
        ('preparing', 'Preparando'),
        ('ready', 'Listo para recoger'),
        ('completed', 'Completado'),
        ('cancelled', 'Cancelado'),
    ]

    customer = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Pedido #{self.id} - {self.name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"

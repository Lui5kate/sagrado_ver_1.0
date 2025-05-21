from django.contrib import admin
from .models import MenuItem, Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('menu_item', 'quantity', 'price')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone', 'order_date', 'status', 'total_amount')
    list_filter = ('status', 'order_date')
    search_fields = ('name', 'email', 'phone')
    readonly_fields = ('order_date', 'total_amount')
    inlines = [OrderItemInline]
    fieldsets = (
        ('Información del Cliente', {
            'fields': ('name', 'email', 'phone', 'address')
        }),
        ('Detalles del Pedido', {
            'fields': ('order_date', 'status', 'total_amount', 'notes')
        }),
    )

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_available')
    list_filter = ('category', 'is_available')
    search_fields = ('name', 'description')

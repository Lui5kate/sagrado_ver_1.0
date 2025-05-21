# Sagrado Cantina - Sitio Web

Sitio web para el restaurante Sagrado Cantina, una experiencia gastronómica mexicana única.

## Características

- Diseño responsivo y moderno
- Sistema de reservaciones en línea
- Menú interactivo
- Formulario de contacto
- Sección "Acerca de" con la historia del restaurante
- Integración con redes sociales

## Requisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Entorno virtual (recomendado)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/sagrado-cantina.git
cd sagrado-cantina
```

2. Crear y activar un entorno virtual:
```bash
python -m venv venv
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate
```

3. Instalar las dependencias:
```bash
pip install -r requirements.txt
```

4. Realizar las migraciones:
```bash
python manage.py migrate
```

5. Crear un superusuario (opcional):
```bash
python manage.py createsuperuser
```

6. Iniciar el servidor de desarrollo:
```bash
python manage.py runserver
```

El sitio estará disponible en `http://localhost:8000`

## Estructura del Proyecto

```
sagrado_cantina/
├── main/                 # Aplicación principal
├── static/              # Archivos estáticos
│   ├── css/            # Estilos CSS
│   ├── js/             # Scripts JavaScript
│   └── images/         # Imágenes
├── templates/          # Plantillas HTML
├── media/             # Archivos multimedia subidos
└── manage.py          # Script de administración de Django
```

## Tecnologías Utilizadas

- Django
- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Font Awesome

## Contribución

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Sagrado Cantina - info@sagradocantina.com 
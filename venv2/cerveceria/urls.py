from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from .views import *

router = routers.DefaultRouter()

router.register(r'productos', ProductoView, 'producto')
router.register(r'usuarios', UsuarioView, 'usuario')
router.register(r'pedidos', PedidoView, 'pedido')


urlpatterns = [
    path("", include(router.urls)),
    path("docs/", include_docs_urls(title="Cerveceria API")),
    path("update-stock/", update_stock, name="update_stock"), 
    path("login/", CustomAuthToken.as_view(), name="login"),
    path('usuarios/create_superuser/', UsuarioView.as_view({'post': 'create_superuser'}), name='create_superuser'),
]
#MOISES SEPULVEDA, OJO
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import Group
from rest_framework import viewsets,status
from rest_framework.response import Response
from rest_framework.decorators import api_view,action
""" from rest_framework.permissions import IsAdminUser,IsAuthenticated """
from .serializer import ProductoSerializer,UsuarioSerializer,\
    Detalle_PedidoSerializer,PedidoSerializer,CustomAuthTokenSerializer

from .models import Producto,Usuario,Detalle_Pedido,Pedido

# Create your views here.
class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()
    lookup_field = 'id'

    # Protege la vista con permisos adecuados

    # Acción personalizada para actualizar la dirección
    @action(detail=False, methods=['put'], url_path='actualizar-direccion/(?P<correo>[^/.]+)')
    def actualizar_direccion(self, request, correo=None):
        print(f"Actualizando dirección para: {correo}")
        try:
            usuario = Usuario.objects.get(correo=correo)
            print("Usuario encontrado:", usuario)
            serializer = self.get_serializer(usuario, data=request.data, partial=True)
            if serializer.is_valid():
                print("Datos validados, guardando nueva dirección...")
                serializer.save()
                return Response(serializer.data)
            
            print("Errores de validación:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Usuario.DoesNotExist:
            print("Usuario no encontrado.")
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['post'])
    def register(self, request):
        """
        Handle user registration.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Perform create and save the user instance
        user = serializer.save()
        
        # Optional: Assign user to a default group (e.g., "customers")
        default_group_name = "Cliente"
        try:
            group = Group.objects.get(name=default_group_name)
            user.groups.add(group)
        except Group.DoesNotExist:
            # Optionally handle the case where the group does not exist
            pass

        # Prepare response headers
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['post'], url_path='create_admin')
    def create_admin(self, request):
        correo = request.data.get('correo')
        password = request.data.get('password')
        nombres = request.data.get('nombres')
        apellidos = request.data.get('apellidos')
        telefono = request.data.get('telefono')
    
        try:
            user = Usuario.objects.create_admin(
                correo=correo,
                password=password,
                nombres=nombres,
                apellidos=apellidos,
                telefono=telefono
            )
            return Response({'detail': 'Administrador creado con éxito'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def create(self, request, *args, **kwargs):
        """
        Override the create method to handle user registration.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        default_group_name = "Cliente"
        try:
            group = Group.objects.get(name=default_group_name)
            user.groups.add(group)
        except Group.DoesNotExist:
            # Optionally handle the case where the group does not exist
            pass

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        """
        Handle the user login and token creation.
        """
        serializer = CustomAuthTokenSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        # Retrieve the user and create/get the token
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Serialize user data for response
        user_data = UsuarioSerializer(user).data

        return Response({'token': token.key, 'user': user_data}, status=status.HTTP_200_OK)
    
class ProductoView(viewsets.ModelViewSet):
    serializer_class = ProductoSerializer
    queryset = Producto.objects.all()

class Detalle_PedidoView(viewsets.ModelViewSet):
    serializer_class = Detalle_PedidoSerializer
    queryset = Detalle_Pedido.objects.all()

class PedidoView(viewsets.ModelViewSet):
    serializer_class = PedidoSerializer
    queryset = Pedido.objects.all()

@api_view(['POST'])
def update_stock(request):
    try:
        for item in request.data.get('products', []):
            product = Producto.objects.get(id=item['cod_producto'])
            product.stock -= item['quantity']
            product.save()
        return Response({"message": "Stock updated successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
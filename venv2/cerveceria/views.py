from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import Group
from django.db import connection
from rest_framework import viewsets,status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view,action

from .serializer import ProductoSerializer,UsuarioSerializer,\
    Detalle_PedidoSerializer,PedidoSerializer,CustomAuthTokenSerializer

from .models import Producto,Usuario,Detalle_Pedido,Pedido,GananciasProducto,PedidoPendiente

# Create your views here.
class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()
    lookup_field = 'id'

    # Protege la vista con permisos adecuados
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
        print("tu eres el encargado de enviarme la informacion del usuario o no?")

        return Response({'token': token.key, 'user': user_data}, status=status.HTTP_200_OK)

class VentasProductoView(APIView):
    def get(self, request):
        try:
            ventas = GananciasProducto.objects.all()
            ventas_data = [
                {
                    "cod_producto": venta.cod_producto,
                    "nombre_producto": venta.nombre_producto,
                    "total": venta.total
                }
                for venta in ventas
            ]
            return Response(ventas_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PedidoPendienteView(APIView):
    def get(self, request):
        try:
            # Obtiene todos los pedidos pendientes de la vista
            pedidos_pendientes = PedidoPendiente.objects.all()
            
            # Preparar los datos para enviarlos al frontend
            pedidos_data = [
                {
                    "nombre_cliente": pedido.nombre_cliente,
                    "correo": pedido.correo,
                    "telefono": pedido.telefono,
                    "cod_pedido_id": pedido.cod_pedido_id,
                    "id_detalle_pedido": pedido.id_detalle_pedido,
                    "cod_producto": pedido.cod_producto,
                    "nombre_producto": pedido.nombre_producto,
                    "cantidad": pedido.cantidad,
                    "precio_unitario": pedido.precio_unitario,
                    "total": pedido.total,
                    "fecha_pedido": pedido.fecha_pedido,
                }
                for pedido in pedidos_pendientes
            ]
            # Retorna la respuesta con los datos en formato JSON
            return Response(pedidos_data, status=status.HTTP_200_OK)
        except Exception as e:
            # Manejo de excepciones en caso de error
            print("estas aqui?")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HistorialPedidosView(APIView):
    def get(self, request):
        user_id = request.query_params.get('id')  # Usar query_params para obtener el 'id'

        if not user_id:
            print("entonces pasas por aca?")
            return Response({"error": "Falta el parámetro ID en la solicitud."}, status=status.HTTP_400_BAD_REQUEST)

        print("Usuario ID:", user_id)

        try:
            # Formatear o limpiar el user_id aquí si es necesario
            user_id = user_id.strip().replace('-', '')  # Ejemplo: remover guiones

            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT a.cod_pedido_id,a.id_detalle_pedido,c.cod_producto Codigo_Producto, c.nombre_producto, b.fecha_pedido, cantidad, precio_unitario, cantidad*precio_unitario total
                    , TO_CHAR(b.fecha_entrega, 'YYYY-MM-DD') AS fecha_entrega
                    FROM cerveceria_detalle_pedido a    
                    JOIN cerveceria_pedido b ON (a.cod_pedido_id = b.cod_pedido)
                    JOIN cerveceria_producto c ON (a.cod_producto_id = c.cod_producto)
                    WHERE b.id_usuario_id = %s
                    ORDER BY a.cod_pedido_id
                """, [user_id])
                pedidos = cursor.fetchall()

            if not pedidos:
                return Response({"error": "No se encontraron pedidos para el usuario especificado."}, status=status.HTTP_404_NOT_FOUND)

            pedidos_data = []
            for pedido in pedidos:
                pedido_dict = {
                    "cod_pedido_id": pedido[0],
                    "id_detalle_pedido": pedido[1],
                    "cod_producto": pedido[2],
                    "nombre_producto": pedido[3],
                    "fecha_pedido": pedido[4],
                    "cantidad": pedido[5],
                    "precio_unitario": pedido[6],
                    "total": pedido[7],
                    "fecha_entrega": pedido[8]
                }
                pedidos_data.append(pedido_dict)

            return Response(pedidos_data, status=status.HTTP_200_OK)

        except Exception as e:
            print("pasas por aqui entonces?")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 
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
    
""" @api_view(['PUT'])
def actualizar_producto(request, pk):
    try:
        producto = Producto.objects.get(pk=pk)
    except Producto.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()
    if 'imagen' not in data:
        data['imagen'] = producto.imagen  # Mantén la imagen existente si no se proporciona una nueva

    serializer = ProductoSerializer(producto, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) """
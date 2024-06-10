from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Usuario,Producto,Detalle_Pedido,Pedido

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Usuario
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }
    def create(self, validated_data):
        # Extraemos la contraseña de los datos validados
        password = validated_data.pop('password')

        # Creamos una instancia del modelo Usuario con los datos restantes
        usuario = Usuario(**validated_data)

        # Encriptamos la contraseña
        usuario.password = make_password(password)

        # Guardamos el usuario en la base de datos
        usuario.save()
        # Devolvemos la instancia del usuario
        return usuario
    
    def validate(self,data):
        correo = data.get('correo')
        password = data.get('password')

        # Validar credenciales
        user = authenticate(correo=correo, password=password)
        if not user:
            raise serializers.ValidationError('Credenciales inválidas')

        # Agregar el usuario autenticado al contexto para su uso en las vistas
        self.context['user'] = user
        return data

class CustomAuthTokenSerializer(serializers.Serializer):
    correo = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        correo = attrs.get('correo')
        password = attrs.get('password')

        print("Correo recibido:", correo)
        print("Contraseña recibida:", password)

        if correo and password:
            user = authenticate(correo=correo, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("La cuenta está desactivada.")
            else:
                raise serializers.ValidationError("Credenciales inválidas.")
        else:
            raise serializers.ValidationError("Debe proporcionar tanto el correo como la contraseña.")

        attrs['user'] = user
        return attrs

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class Detalle_PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detalle_Pedido
        fields = '__all__'

    def validate(self, data):
        producto = data['cod_producto']
        cantidad_solicitada = data['cantidad']

        # Verificar si hay suficiente stock
        if producto.stock_producto < cantidad_solicitada:
            raise serializers.ValidationError(f"No hay suficiente stock para el producto {producto.nombre_producto}. Disponible: {producto.stock_producto}, solicitado: {cantidad_solicitada}.")

        return data

    def create(self, validated_data):
        producto = validated_data['cod_producto']
        cantidad_solicitada = validated_data['cantidad']

        # Reducir el stock del producto
        producto.stock_producto -= cantidad_solicitada
        producto.save()

        return super().create(validated_data)

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'

    # Ejemplo de validación adicional
    def validate_fecha_entrega(self, value):
        if value and value < Pedido['fecha_pedido']:
            raise serializers.ValidationError("La fecha de entrega no puede ser anterior a la fecha del pedido.")
        return value
    

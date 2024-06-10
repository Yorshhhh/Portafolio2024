from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Usuario,Producto,Rol,Detalle_Pedido,Pedido

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Usuario
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}  # Esto asegura que la contraseña no se devuelva en las respuestas.
        }
    def create(self, validated_data):
        # Extraemos la contraseña de los datos validados
        password = validated_data.pop('password')
        # Asignamos por defecto el rol con código 1
        rol_default, _ = Rol.objects.get_or_create(pk=1)
        validated_data['cod_rol'] = rol_default

        # Creamos una instancia del modelo Usuario con los datos restantes
        usuario = Usuario(**validated_data)
        # Encriptamos la contraseña
        usuario.password = make_password(password)
        # Guardamos el usuario en la base de datos
        usuario.save()
        # Devolvemos la instancia del usuario
        return usuario
    
"""     def validate(self,data):
        correo = data.get('correo')
        password = data.get('password')

        # Validar credenciales
        user = authenticate(correo=correo, password=password)
        if not user:
            raise serializers.ValidationError('Credenciales inválidas')

        # Agregar el usuario autenticado al contexto para su uso en las vistas
        self.context['user'] = user
        return data
     """

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

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class Detalle_PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detalle_Pedido
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'
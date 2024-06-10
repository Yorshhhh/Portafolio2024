from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, User
# Create your models here.

# Definir un UserManager personalizado
class CustomUserManager(BaseUserManager):
    def create_user(self, correo, password=None, **extra_fields):
        if not correo:
            raise ValueError('El correo electrónico debe ser proporcionado')
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(correo, password, **extra_fields)

#MODELO USUARIO
class Usuario(AbstractBaseUser, PermissionsMixin):
    correo = models.CharField(max_length=255, unique=True, primary_key=True)
    nombres = models.CharField(max_length=155)
    apellidos = models.CharField(max_length=255)
    telefono = models.IntegerField(unique=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='user_set_custom',
        related_query_name='user_custom',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='user_set_custom',
        related_query_name='user_custom',
        blank=True
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombres', 'apellidos','telefono']

    def __str__(self):
        return self.correo
    
#MODELO PRODUCTO CERVEZAS
class Producto(models.Model):
    cod_producto = models.AutoField(primary_key=True, unique=True)
    nombre_producto = models.CharField(max_length=50)
    descripcion_producto = models.CharField(max_length=255)
    precio_producto = models.IntegerField()
    stock_producto = models.IntegerField()
    grado_alcoholico = models.FloatField()
    litros = models.FloatField()
    def __str__(self):
        return self.nombre_producto
    
#MODELO PEDIDOS
class Pedido(models.Model):
    cod_pedido = models.AutoField(primary_key=True)
    correo = models.ForeignKey(Usuario, on_delete= models.CASCADE)
    fecha_pedido = models.DateField()
    fecha_entrega = models.DateField(null=True,blank=True)
    
# MODELO DETALLE PEDIDO
class Detalle_Pedido(models.Model):
    id_detalle_pedido = models.AutoField(primary_key=True)  # Clave primaria autoincremental para cada detalle
    cod_pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='detalles')  # Clave foránea a Pedido
    cod_producto = models.ForeignKey(Producto, on_delete=models.CASCADE)  # Clave foránea a Producto
    precio_unitario = models.IntegerField()
    cantidad = models.IntegerField()
    descuento = models.FloatField()

    def __str__(self):
        return f"Detalle del pedido {self.cod_pedido} para el producto {self.cod_producto}"

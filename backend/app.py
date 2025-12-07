from flask import Flask, request, jsonify, render_template, send_from_directory, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv, dotenv_values
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.middleware.proxy_fix import ProxyFix
import jwt
from functools import wraps

env_path = os.path.join(os.path.dirname(__file__), '.env')
debug_env = os.getenv('DEBUG')
if debug_env is None:
    file_debug = False
    if os.path.exists(env_path):
        file_debug = str(dotenv_values(env_path).get('DEBUG', '')).lower() == 'true'
    if file_debug:
        load_dotenv(env_path)
else:
    if debug_env.lower() == 'true' and os.path.exists(env_path):
        load_dotenv(env_path)

app = Flask(__name__, 
            template_folder='../templates',
            static_folder='../assets')
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)

# Configuración de la base de datos PostgreSQL
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL no está configurada")

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True,
    'pool_recycle': 1800,
    'pool_size': 10,
    'max_overflow': 20
}

# Configuración JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key-change-in-production')
app.config['JWT_EXPIRATION_HOURS'] = 24

# Inicializar extensiones
db = SQLAlchemy(app)
if os.getenv('DEBUG', 'false').lower() == 'true':
    CORS(app)
else:
    CORS(app, origins=[os.getenv('CORS_ORIGIN', 'https://trivial.dh2o.com.co')])

# ==================== MODELOS ====================
class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    codigo_premio = db.Column(db.String(50), unique=True, nullable=False, index=True)
    cedula = db.Column(db.String(20), nullable=False)
    nombres = db.Column(db.String(100), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    direccion = db.Column(db.Text, nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    premio = db.Column(db.String(100), nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    canjeado = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'codigo_premio': self.codigo_premio,
            'cedula': self.cedula,
            'nombres': self.nombres,
            'apellidos': self.apellidos,
            'direccion': self.direccion,
            'telefono': self.telefono,
            'premio': self.premio,
            'fecha_registro': self.fecha_registro.isoformat(),
            'canjeado': self.canjeado
        }

class Premio(db.Model):
    __tablename__ = 'premios'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    descripcion = db.Column(db.Text, nullable=True)
    cantidad_disponible = db.Column(db.Integer, default=0)
    activo = db.Column(db.Boolean, default=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'cantidad_disponible': self.cantidad_disponible,
            'activo': self.activo,
            'fecha_creacion': self.fecha_creacion.isoformat()
        }

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_admin = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat()
        }

def ensure_default_admin():
    username = os.getenv('ADMIN_USERNAME')
    password = os.getenv('ADMIN_PASSWORD')
    email = os.getenv('ADMIN_EMAIL')
    auto = os.getenv('ADMIN_AUTO_CREATE', 'false').lower() == 'true'
    if not auto:
        return
    with app.app_context():
        if not username or not password or not email:
            print('⚠️ ADMIN_AUTO_CREATE activo pero faltan variables ADMIN_USERNAME/ADMIN_PASSWORD/ADMIN_EMAIL')
            return
        existing = User.query.filter((User.username == username) | (User.email == email)).first()
        if existing:
            print('ℹ️ Usuario admin ya existe')
            return
        user = User(username=username, email=email, is_admin=True)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        print(f"✅ Usuario admin '{username}' creado")

# ==================== JWT UTILITIES ====================
def generate_token(user_id):
    """Genera un token JWT para el usuario"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=app.config['JWT_EXPIRATION_HOURS']),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, app.config['JWT_SECRET_KEY'], algorithm='HS256')

def verify_token(token):
    """Verifica y decodifica un token JWT"""
    try:
        payload = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorador para proteger rutas que requieren autenticación"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('auth_token')
        
        if not token:
            return redirect('/login')
        
        user_id = verify_token(token)
        if not token:
            response = redirect('/login')
            is_secure = (request.headers.get('X-Forwarded-Proto', '').lower() == 'https') or request.is_secure
            response.set_cookie('auth_token', '', expires=0, secure=is_secure, samesite='Lax', path='/')
            return response
            return response
            return response
        
        return f(*args, **kwargs)
    return decorated

# ==================== RUTAS - PÁGINAS ====================
@app.route('/')
def index():
    """Página principal del juego"""
    return send_from_directory('..', 'index.html')

@app.route('/script.js')
def serve_script():
    """Sirve el archivo JavaScript del juego"""
    return send_from_directory('..', 'script.js')

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Sirve archivos estáticos (CSS, imágenes, etc.)"""
    return send_from_directory('../assets', filename)

@app.route('/registro')
def registro():
    """Página de registro de cliente"""
    return render_template('registro.html')

@app.route('/login')
def login_page():
    """Página de login"""
    return render_template('login.html')

@app.route('/admin')
@token_required
def admin():
    """Panel administrativo"""
    return render_template('admin.html')

@app.route('/premios')
@token_required
def premios():
    """Panel de gestión de premios"""
    return render_template('premios.html')



# ==================== API ENDPOINTS - AUTHENTICATION ====================
@app.route('/api/login', methods=['POST'])
def login():
    """Endpoint de login"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({
                'success': False,
                'message': 'Usuario y contraseña requeridos'
            }), 400
        
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return jsonify({
                'success': False,
                'message': 'Credenciales inválidas'
            }), 401
        
        token = generate_token(user.id)
        
        response = jsonify({
            'success': True,
            'message': 'Login exitoso',
            'user': user.to_dict()
        })
        is_secure = (request.headers.get('X-Forwarded-Proto', '').lower() == 'https') or request.is_secure
        response.set_cookie('auth_token', token, httponly=True, max_age=86400, secure=is_secure, samesite='Lax', path='/')
        
        return response
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error en login: {str(e)}'
        }), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    """Endpoint de logout"""
    response = jsonify({'success': True, 'message': 'Logout exitoso'})
    is_secure = (request.headers.get('X-Forwarded-Proto', '').lower() == 'https') or request.is_secure
    response.set_cookie('auth_token', '', expires=0, secure=is_secure, samesite='Lax', path='/')
    return response

@app.route('/api/verify', methods=['GET'])
def verify():
    """Verifica si el usuario está autenticado"""
    token = request.cookies.get('auth_token')
    
    if not token:
        return jsonify({'authenticated': False}), 401
    
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'authenticated': False}), 401
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'authenticated': False}), 401
    
    return jsonify({
        'authenticated': True,
        'user': user.to_dict()
    })

# ==================== API ENDPOINTS ====================
@app.route('/api/registro', methods=['POST'])
def registrar_cliente():
    """Registra un nuevo cliente con código de premio"""
    try:
        data = request.get_json()
        
        # Validar campos requeridos
        campos_requeridos = ['codigo_premio', 'cedula', 'nombres', 'apellidos', 'direccion', 'telefono', 'premio']
        for campo in campos_requeridos:
            if not data.get(campo):
                return jsonify({
                    'success': False,
                    'message': f'El campo {campo} es requerido'
                }), 400
        
        # Verificar si el código ya fue usado
        cliente_existente = Cliente.query.filter_by(codigo_premio=data['codigo_premio']).first()
        if cliente_existente:
            return jsonify({
                'success': False,
                'message': 'Este código de premio ya ha sido registrado'
            }), 400
        
        # Crear nuevo cliente
        nuevo_cliente = Cliente(
            codigo_premio=data['codigo_premio'],
            cedula=data['cedula'],
            nombres=data['nombres'],
            apellidos=data['apellidos'],
            direccion=data['direccion'],
            telefono=data['telefono'],
            premio=data['premio']
        )
        
        db.session.add(nuevo_cliente)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Registro exitoso',
            'id': nuevo_cliente.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error al registrar: {str(e)}'
        }), 500

@app.route('/api/validar-codigo/<codigo>', methods=['GET'])
def validar_codigo(codigo):
    """Valida si un código existe y no ha sido usado"""
    cliente = Cliente.query.filter_by(codigo_premio=codigo).first()
    
    if cliente:
        return jsonify({
            'valid': False,
            'usado': True,
            'message': 'Este código ya ha sido registrado'
        })
    
    return jsonify({
        'valid': True,
        'usado': False,
        'message': 'Código válido'
    })

@app.route('/api/clientes', methods=['GET'])
def listar_clientes():
    """Lista todos los clientes registrados"""
    clientes = Cliente.query.order_by(Cliente.fecha_registro.desc()).all()
    return jsonify({
        'success': True,
        'clientes': [cliente.to_dict() for cliente in clientes],
        'total': len(clientes)
    })

@app.route('/api/cliente/<int:id>', methods=['GET'])
def obtener_cliente(id):
    """Obtiene un cliente por ID"""
    cliente = Cliente.query.get_or_404(id)
    return jsonify({
        'success': True,
        'cliente': cliente.to_dict()
    })

@app.route('/api/canjear/<int:id>', methods=['PUT'])
def canjear_premio(id):
    """Marca un premio como canjeado"""
    cliente = Cliente.query.get_or_404(id)
    cliente.canjeado = True
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Premio marcado como canjeado'
    })

@app.route('/api/estadisticas', methods=['GET'])
def estadisticas():
    """Obtiene estadísticas de premios"""
    total_registros = Cliente.query.count()
    canjeados = Cliente.query.filter_by(canjeado=True).count()
    pendientes = total_registros - canjeados
    
    # Premios por tipo
    premios_por_tipo = db.session.query(
        Cliente.premio, 
        db.func.count(Cliente.id)
    ).group_by(Cliente.premio).all()
    
    return jsonify({
        'success': True,
        'total_registros': total_registros,
        'canjeados': canjeados,
        'pendientes': pendientes,
        'premios_por_tipo': [
            {'premio': p[0], 'cantidad': p[1]} 
            for p in premios_por_tipo
        ]
    })

# ==================== API ENDPOINTS - PREMIOS ====================
@app.route('/api/premios', methods=['GET'])
def listar_premios():
    """Lista todos los premios"""
    try:
        # Filtrar solo activos si se especifica
        solo_activos = request.args.get('activos', 'false').lower() == 'true'
        
        if solo_activos:
            premios = Premio.query.filter_by(activo=True).order_by(Premio.nombre).all()
        else:
            premios = Premio.query.order_by(Premio.nombre).all()
        
        return jsonify({
            'success': True,
            'premios': [premio.to_dict() for premio in premios],
            'total': len(premios)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error al listar premios: {str(e)}'
        }), 500

@app.route('/api/premio/<int:id>', methods=['GET'])
def obtener_premio(id):
    """Obtiene un premio por ID"""
    try:
        premio = Premio.query.get_or_404(id)
        return jsonify({
            'success': True,
            'premio': premio.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Premio no encontrado'
        }), 404

@app.route('/api/premio', methods=['POST'])
def crear_premio():
    """Crea un nuevo premio"""
    try:
        data = request.get_json()
        
        # Validar campos requeridos
        if not data.get('nombre'):
            return jsonify({
                'success': False,
                'message': 'El nombre del premio es requerido'
            }), 400
        
        # Verificar que no exista un premio con el mismo nombre
        premio_existente = Premio.query.filter_by(nombre=data['nombre']).first()
        if premio_existente:
            return jsonify({
                'success': False,
                'message': 'Ya existe un premio con ese nombre'
            }), 400
        
        # Validar cantidad disponible
        cantidad = data.get('cantidad_disponible', 0)
        if cantidad < 0:
            return jsonify({
                'success': False,
                'message': 'La cantidad disponible no puede ser negativa'
            }), 400
        
        # Crear nuevo premio
        nuevo_premio = Premio(
            nombre=data['nombre'],
            descripcion=data.get('descripcion', ''),
            cantidad_disponible=cantidad,
            activo=data.get('activo', True)
        )
        
        db.session.add(nuevo_premio)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Premio creado exitosamente',
            'premio': nuevo_premio.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error al crear premio: {str(e)}'
        }), 500

@app.route('/api/premio/<int:id>', methods=['PUT'])
def actualizar_premio(id):
    """Actualiza un premio existente"""
    try:
        premio = Premio.query.get_or_404(id)
        data = request.get_json()
        
        # Actualizar nombre si se proporciona
        if 'nombre' in data and data['nombre']:
            # Verificar que no exista otro premio con el mismo nombre
            premio_existente = Premio.query.filter(
                Premio.nombre == data['nombre'],
                Premio.id != id
            ).first()
            if premio_existente:
                return jsonify({
                    'success': False,
                    'message': 'Ya existe otro premio con ese nombre'
                }), 400
            premio.nombre = data['nombre']
        
        # Actualizar otros campos
        if 'descripcion' in data:
            premio.descripcion = data['descripcion']
        
        if 'cantidad_disponible' in data:
            cantidad = data['cantidad_disponible']
            if cantidad < 0:
                return jsonify({
                    'success': False,
                    'message': 'La cantidad disponible no puede ser negativa'
                }), 400
            premio.cantidad_disponible = cantidad
        
        if 'activo' in data:
            premio.activo = data['activo']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Premio actualizado exitosamente',
            'premio': premio.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error al actualizar premio: {str(e)}'
        }), 500

@app.route('/api/premio/<int:id>', methods=['DELETE'])
def eliminar_premio(id):
    """Elimina un premio"""
    try:
        premio = Premio.query.get_or_404(id)
        
        # Verificar si hay clientes con este premio
        clientes_con_premio = Cliente.query.filter_by(premio=premio.nombre).count()
        if clientes_con_premio > 0:
            return jsonify({
                'success': False,
                'message': f'No se puede eliminar. Hay {clientes_con_premio} cliente(s) con este premio'
            }), 400
        
        db.session.delete(premio)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Premio eliminado exitosamente'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error al eliminar premio: {str(e)}'
        }), 500


# ==================== INICIALIZACIÓN ====================
def init_db():
    """Inicializa la base de datos"""
    with app.app_context():
        db.create_all()
        print("✅ Base de datos inicializada correctamente")

init_db()
ensure_default_admin()

if __name__ == '__main__':
    init_db()
    debug_mode = os.getenv('DEBUG', 'False').lower() == 'true'
    print("🚀 Servidor Flask iniciado en http://localhost:5000")
    print("🐘 Base de datos: PostgreSQL 17")
    print(f"📊 Conectado a: {os.getenv('DB_NAME')} en {os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}")
    print("📝 Formulario de registro: http://localhost:5000/registro")
    print("👨‍💼 Panel admin: http://localhost:5000/admin")
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)

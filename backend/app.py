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
            static_folder='../assets',
            static_url_path='/assets')
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
    updated_at = db.Column(db.DateTime, nullable=True)
    updated_by = db.Column(db.String(120), nullable=True)
    
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
            'canjeado': self.canjeado,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'updated_by': self.updated_by
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

class Categoria(db.Model):
    __tablename__ = 'categorias'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), unique=True, nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    activa = db.Column(db.Boolean, default=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'activa': self.activa,
            'fecha_creacion': self.fecha_creacion.isoformat()
        }

class Pregunta(db.Model):
    __tablename__ = 'preguntas'
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.Text, nullable=False)
    categoria = db.Column(db.String(100), nullable=True)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=True)
    categoria_obj = db.relationship('Categoria', lazy=True)
    dificultad = db.Column(db.String(50), nullable=True)
    activa = db.Column(db.Boolean, default=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    opciones = db.relationship('Opcion', backref='pregunta', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'texto': self.texto,
            'categoria': self.categoria_obj.nombre if self.categoria_obj else self.categoria,
            'categoria_id': self.categoria_id,
            'dificultad': self.dificultad,
            'activa': self.activa,
            'fecha_creacion': self.fecha_creacion.isoformat(),
            'opciones': [o.to_dict() for o in self.opciones]
        }

class Opcion(db.Model):
    __tablename__ = 'opciones'
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.Text, nullable=False)
    correcta = db.Column(db.Boolean, default=False)
    pregunta_id = db.Column(db.Integer, db.ForeignKey('preguntas.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'texto': self.texto,
            'correcta': self.correcta,
            'pregunta_id': self.pregunta_id
        }

class ConfiguracionRuleta(db.Model):
    __tablename__ = 'configuracion_ruleta'
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.String(50), nullable=False)
    tipo = db.Column(db.String(20), nullable=False) # 'premio', 'retry', 'question'
    color = db.Column(db.String(20), nullable=False)
    probabilidad = db.Column(db.Integer, default=1) # Peso para probabilidad (opcional para futuro)
    activo = db.Column(db.Boolean, default=True)
    orden = db.Column(db.Integer, default=0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'texto': self.texto,
            'tipo': self.tipo,
            'color': self.color,
            'probabilidad': self.probabilidad,
            'activo': self.activo,
            'orden': self.orden
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

def ensure_constraints():
    try:
        with app.app_context():
            db.session.execute(db.text("CREATE UNIQUE INDEX IF NOT EXISTS idx_clientes_cedula_unique ON clientes (cedula)"))
            exists_updated_at = db.session.execute(db.text("SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='updated_at'"))
            if not exists_updated_at.scalar():
                db.session.execute(db.text("ALTER TABLE clientes ADD COLUMN updated_at TIMESTAMP"))
            exists_updated_by = db.session.execute(db.text("SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='updated_by'"))
            if not exists_updated_by.scalar():
                db.session.execute(db.text("ALTER TABLE clientes ADD COLUMN updated_by VARCHAR(120)"))
            # Preguntas: agregar columna categoria_id si no existe
            exists_catid = db.session.execute(db.text("SELECT 1 FROM information_schema.columns WHERE table_name='preguntas' AND column_name='categoria_id'"))
            if not exists_catid.scalar():
                db.session.execute(db.text("ALTER TABLE preguntas ADD COLUMN categoria_id INTEGER"))
            # Crear índice único en nombre de categorías
            db.session.execute(db.text("CREATE UNIQUE INDEX IF NOT EXISTS idx_categorias_nombre_unique ON categorias (nombre)"))
            # Ruleta config table
            db.session.execute(db.text("""
                CREATE TABLE IF NOT EXISTS configuracion_ruleta (
                    id SERIAL PRIMARY KEY,
                    texto VARCHAR(50) NOT NULL,
                    tipo VARCHAR(20) NOT NULL,
                    color VARCHAR(20) NOT NULL,
                    probabilidad INTEGER DEFAULT 1,
                    activo BOOLEAN DEFAULT TRUE,
                    orden INTEGER DEFAULT 0
                )
            """))
            # Agregar columna orden si no existe (migración)
            try:
                db.session.execute(db.text("ALTER TABLE configuracion_ruleta ADD COLUMN orden INTEGER DEFAULT 0"))
            except Exception:
                pass # Ya existe
                
            db.session.commit()
            
            # Default ruleta segments if empty
            if ConfiguracionRuleta.query.count() == 0:
                defaults = [
                    {'texto': '🎁 PREMIO', 'tipo': 'premio', 'color': '#FFD700'},
                    {'texto': 'Gira Otra Vez', 'tipo': 'retry', 'color': '#4CAF50'},
                    {'texto': '🏆 SORPRESA', 'tipo': 'premio', 'color': '#FF9800'},
                    {'texto': 'Intenta Nuevo', 'tipo': 'retry', 'color': '#2196F3'}
                ]
                for d in defaults:
                    db.session.add(ConfiguracionRuleta(**d))
                db.session.commit()
    except Exception as e:
        try:
            db.session.rollback()
        except Exception:
            pass
        print(f"⚠️ No se pudo aplicar constraints: {e}")

def current_user():
    try:
        token = request.cookies.get('auth_token')
        uid = verify_token(token) if token else None
        return db.session.get(User, uid) if uid else None
    except Exception:
        return None

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
        if not user_id:
            response = redirect('/login')
            is_secure = (request.headers.get('X-Forwarded-Proto', '').lower() == 'https') or request.is_secure
            response.set_cookie('auth_token', '', expires=0, secure=is_secure, samesite='Lax', path='/')
            return response
        
        return f(*args, **kwargs)
    return decorated

# ==================== RUTAS - PÁGINAS ====================
@app.route('/')
def index():
    """Redirige siempre a login"""
    return redirect('/login')

@app.route('/home')
@token_required
def home():
    """Página principal del juego (protegida)"""
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

@app.route('/preguntas')
@token_required
def preguntas_page():
    return render_template('preguntas.html')

@app.route('/categorias')
@token_required
def categorias_page():
    return render_template('categorias.html')

@app.route('/config-ruleta')
@token_required
def config_ruleta_page():
    return render_template('config_ruleta.html')



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
    
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'authenticated': False}), 401
    
    return jsonify({
        'authenticated': True,
        'user': user.to_dict()
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

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

        cedula_norm = str(data['cedula']).strip()
        cliente_por_cedula = Cliente.query.filter_by(cedula=cedula_norm).first()
        if cliente_por_cedula:
            return jsonify({
                'success': False,
                'message': 'Esta cédula ya tiene un premio registrado'
            }), 400

        premio_nombre = str(data['premio']).strip()
        premio_obj = Premio.query.filter_by(nombre=premio_nombre, activo=True).first()
        if not premio_obj:
            return jsonify({
                'success': False,
                'message': 'Premio no válido'
            }), 400
        if premio_obj.cantidad_disponible <= 0:
            return jsonify({
                'success': False,
                'message': 'No hay unidades disponibles de este premio'
            }), 400
        
        # Crear nuevo cliente
        nuevo_cliente = Cliente(
            codigo_premio=data['codigo_premio'],
            cedula=cedula_norm,
            nombres=str(data['nombres']).upper(),
            apellidos=str(data['apellidos']).upper(),
            direccion=data['direccion'],
            telefono=data['telefono'],
            premio=premio_nombre,
            updated_at=datetime.utcnow(),
            updated_by=(current_user().username if current_user() else None)
        )
        premio_obj.cantidad_disponible = max(0, premio_obj.cantidad_disponible - 1)
        
        db.session.add(nuevo_cliente)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Registro exitoso',
            'id': nuevo_cliente.id,
            'premio': premio_obj.to_dict()
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

@app.route('/api/preguntas', methods=['GET'])
def listar_preguntas():
    activa_param = request.args.get('activa')
    categoria_id_param = request.args.get('categoria_id')
    
    # Paginacin
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    try:
        q = Pregunta.query
        if activa_param is not None:
            active = str(activa_param).lower() == 'true'
            q = q.filter_by(activa=active)
        
        if categoria_id_param:
            try:
                cat_id = int(categoria_id_param)
                q = q.filter_by(categoria_id=cat_id)
            except ValueError:
                pass # Ignorar si no es nmero

        pagination = q.order_by(Pregunta.fecha_creacion.desc()).paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'success': True, 
            'preguntas': [p.to_dict() for p in pagination.items], 
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        })
    except Exception as e:
        print(f"ERROR en listar_preguntas: {e}")
        return jsonify({
            'success': False, 
            'message': f'Error al obtener preguntas: {str(e)}'
        }), 500

@app.route('/api/pregunta', methods=['POST'])
def crear_pregunta():
    try:
        data = request.get_json() or {}
        texto = str(data.get('texto', '')).strip()
        if not texto:
            return jsonify({'success': False, 'message': 'El texto de la pregunta es requerido'}), 400
        p = Pregunta(
            texto=texto,
            categoria=data.get('categoria'),
            dificultad=data.get('dificultad'),
            activa=bool(data.get('activa', True))
        )
        if data.get('categoria_id') is not None:
            cat = db.session.get(Categoria, data.get('categoria_id'))
            if not cat or not cat.activa:
                return jsonify({'success': False, 'message': 'Categoría no válida'}), 400
            p.categoria_id = cat.id
            p.categoria = cat.nombre
        opciones = data.get('opciones') or []
        if not opciones:
            return jsonify({'success': False, 'message': 'Debe incluir opciones'}), 400
        tiene_correcta = any(bool(o.get('correcta')) for o in opciones)
        if not tiene_correcta:
            return jsonify({'success': False, 'message': 'Debe existir al menos una opción correcta'}), 400
        for o in opciones:
            p.opciones.append(Opcion(texto=str(o.get('texto', '')).strip(), correcta=bool(o.get('correcta'))))
        db.session.add(p)
        db.session.commit()
        return jsonify({'success': True, 'pregunta': p.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error al crear pregunta: {str(e)}'}), 500

@app.route('/api/pregunta/<int:id>', methods=['GET'])
def obtener_pregunta(id):
    p = Pregunta.query.get_or_404(id)
    return jsonify({'success': True, 'pregunta': p.to_dict()})

@app.route('/api/pregunta/<int:id>', methods=['PUT'])
def actualizar_pregunta(id):
    try:
        p = Pregunta.query.get_or_404(id)
        data = request.get_json() or {}
        if 'texto' in data:
            t = str(data.get('texto') or '').strip()
            if not t:
                return jsonify({'success': False, 'message': 'El texto de la pregunta es requerido'}), 400
            p.texto = t
        if 'categoria_id' in data and data.get('categoria_id') is not None:
            cat = db.session.get(Categoria, data.get('categoria_id'))
            if not cat or not cat.activa:
                return jsonify({'success': False, 'message': 'Categoría no válida'}), 400
            p.categoria_id = cat.id
            p.categoria = cat.nombre
        elif 'categoria' in data:
            p.categoria = data.get('categoria')
        if 'dificultad' in data:
            p.dificultad = data.get('dificultad')
        if 'activa' in data:
            p.activa = bool(data.get('activa'))
        if 'opciones' in data:
            opciones = data.get('opciones') or []
            if not opciones:
                return jsonify({'success': False, 'message': 'Debe incluir opciones'}), 400
            tiene_correcta = any(bool(o.get('correcta')) for o in opciones)
            if not tiene_correcta:
                return jsonify({'success': False, 'message': 'Debe existir al menos una opción correcta'}), 400
            Opcion.query.filter_by(pregunta_id=p.id).delete()
            for o in opciones:
                db.session.add(Opcion(texto=str(o.get('texto', '')).strip(), correcta=bool(o.get('correcta')), pregunta_id=p.id))
        db.session.commit()
        return jsonify({'success': True, 'pregunta': p.to_dict()})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error al actualizar pregunta: {str(e)}'}), 500

@app.route('/api/pregunta/<int:id>', methods=['DELETE'])
def eliminar_pregunta(id):
    try:
        p = Pregunta.query.get_or_404(id)
        db.session.delete(p)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Pregunta eliminada'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error al eliminar pregunta: {str(e)}'}), 500

@app.route('/api/categorias', methods=['GET'])
def listar_categorias():
    activa_param = request.args.get('activa')
    q = Categoria.query
    if activa_param is not None:
        active = str(activa_param).lower() == 'true'
        q = q.filter_by(activa=active)
    cats = q.order_by(Categoria.nombre.asc()).all()
    return jsonify({'success': True, 'categorias': [c.to_dict() for c in cats], 'total': len(cats)})

@app.route('/api/categoria', methods=['POST'])
def crear_categoria():
    try:
        data = request.get_json() or {}
        nombre = str(data.get('nombre', '')).strip()
        if not nombre:
            return jsonify({'success': False, 'message': 'El nombre de la categoría es requerido'}), 400
        existe = Categoria.query.filter_by(nombre=nombre).first()
        if existe:
            return jsonify({'success': False, 'message': 'Ya existe una categoría con ese nombre'}), 400
        c = Categoria(nombre=nombre, descripcion=data.get('descripcion'), activa=bool(data.get('activa', True)))
        db.session.add(c)
        db.session.commit()
        return jsonify({'success': True, 'categoria': c.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error al crear categoría: {str(e)}'}), 500

@app.route('/api/categoria/<int:id>', methods=['PUT'])
def actualizar_categoria(id):
    try:
        c = Categoria.query.get_or_404(id)
        data = request.get_json() or {}
        if 'nombre' in data:
            nombre = str(data.get('nombre') or '').strip()
            if not nombre:
                return jsonify({'success': False, 'message': 'El nombre es requerido'}), 400
            dup = Categoria.query.filter(Categoria.nombre == nombre, Categoria.id != id).first()
            if dup:
                return jsonify({'success': False, 'message': 'Ya existe otra categoría con ese nombre'}), 400
            c.nombre = nombre
        if 'descripcion' in data:
            c.descripcion = data.get('descripcion')
        if 'activa' in data:
            c.activa = bool(data.get('activa'))
        db.session.commit()
        return jsonify({'success': True, 'categoria': c.to_dict()})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error al actualizar categoría: {str(e)}'}), 500

@app.route('/api/categoria/<int:id>', methods=['DELETE'])
def eliminar_categoria(id):
    try:
        c = Categoria.query.get_or_404(id)
        count_p = Pregunta.query.filter_by(categoria_id=c.id).count()
        if count_p > 0:
            return jsonify({'success': False, 'message': 'No se puede eliminar: hay preguntas asociadas'}), 400
        db.session.delete(c)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Categoría eliminada'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error al eliminar categoría: {str(e)}'}), 500

@app.route('/api/cliente/<int:id>', methods=['GET'])
def obtener_cliente(id):
    """Obtiene un cliente por ID"""
    cliente = Cliente.query.get_or_404(id)
    return jsonify({
        'success': True,
        'cliente': cliente.to_dict()
    })

@app.route('/api/cliente/<int:id>', methods=['PUT'])
def actualizar_cliente(id):
    """Actualiza datos de un cliente y mantiene reglas de stock y unicidad"""
    try:
        cliente = Cliente.query.get_or_404(id)
        data = request.get_json() or {}

        if 'cedula' in data:
            ced = str(data['cedula']).strip()
            if not ced:
                return jsonify({'success': False, 'message': 'La cédula es requerida'}), 400
            existe = Cliente.query.filter(Cliente.cedula == ced, Cliente.id != id).first()
            if existe:
                return jsonify({'success': False, 'message': 'Esta cédula ya tiene un premio registrado'}), 400
            cliente.cedula = ced

        if 'nombres' in data:
            cliente.nombres = str(data['nombres']).upper()
        if 'apellidos' in data:
            cliente.apellidos = str(data['apellidos']).upper()
        if 'direccion' in data:
            cliente.direccion = data['direccion']
        if 'telefono' in data:
            cliente.telefono = data['telefono']
        if 'canjeado' in data:
            cliente.canjeado = bool(data['canjeado'])

        if 'premio' in data and data['premio']:
            nuevo_nombre = str(data['premio']).strip()
            if nuevo_nombre != cliente.premio:
                nuevo_premio = Premio.query.filter_by(nombre=nuevo_nombre, activo=True).first()
                if not nuevo_premio:
                    return jsonify({'success': False, 'message': 'Premio no válido'}), 400
                if nuevo_premio.cantidad_disponible <= 0:
                    return jsonify({'success': False, 'message': 'No hay unidades disponibles de este premio'}), 400
                viejo_premio = Premio.query.filter_by(nombre=cliente.premio).first()
                if viejo_premio:
                    viejo_premio.cantidad_disponible = viejo_premio.cantidad_disponible + 1
                nuevo_premio.cantidad_disponible = max(0, nuevo_premio.cantidad_disponible - 1)
                cliente.premio = nuevo_nombre

        cu = current_user()
        cliente.updated_at = datetime.utcnow()
        cliente.updated_by = cu.username if cu else cliente.updated_by
        db.session.commit()
        return jsonify({'success': True, 'message': 'Cliente actualizado', 'cliente': cliente.to_dict()})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error al actualizar cliente: {str(e)}'}), 500

@app.route('/api/cliente/<int:id>', methods=['DELETE'])
def eliminar_cliente_api(id):
    """Elimina un cliente y devuelve stock al premio asociado si aplica"""
    try:
        cliente = Cliente.query.get_or_404(id)
        premio = Premio.query.filter_by(nombre=cliente.premio).first()
        if premio:
            premio.cantidad_disponible = premio.cantidad_disponible + 1
        db.session.delete(cliente)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Registro eliminado'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error al eliminar registro: {str(e)}'}), 500

@app.route('/api/canjear/<int:id>', methods=['PUT'])
def canjear_premio(id):
    """Marca un premio como canjeado"""
    cliente = Cliente.query.get_or_404(id)
    cliente.canjeado = True
    cu = current_user()
    cliente.updated_at = datetime.utcnow()
    cliente.updated_by = cu.username if cu else cliente.updated_by
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
        
        # Regla: no se puede activar un premio sin stock
        activo = bool(data.get('activo', True))
        if activo and cantidad == 0:
            return jsonify({
                'success': False,
                'message': 'No se puede activar un premio sin stock'
            }), 400

        # Crear nuevo premio
        nuevo_premio = Premio(
            nombre=data['nombre'],
            descripcion=data.get('descripcion', ''),
            cantidad_disponible=cantidad,
            activo=activo
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
        
        # Aplicar cambios y validar reglas
        nuevo_stock = premio.cantidad_disponible
        nuevo_activo = premio.activo
        if 'cantidad_disponible' in data:
            cantidad = data['cantidad_disponible']
            if cantidad < 0:
                return jsonify({
                    'success': False,
                    'message': 'La cantidad disponible no puede ser negativa'
                }), 400
            nuevo_stock = cantidad
        if 'activo' in data:
            nuevo_activo = data['activo']

        if nuevo_activo and (nuevo_stock <= 0):
            return jsonify({
                'success': False,
                'message': 'No se puede activar un premio sin stock'
            }), 400

        # Persistir cambios
        premio.cantidad_disponible = nuevo_stock
        premio.activo = nuevo_activo
        
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
ensure_constraints()
ensure_default_admin()

_constraints_applied = False

@app.before_request
def _ensure_constraints_once():
    global _constraints_applied
    if not _constraints_applied:
        try:
            ensure_constraints()
            _constraints_applied = True
        except Exception:
            pass

@app.route('/api/maintenance/ensure-constraints', methods=['POST'])
@token_required
def maintenance_ensure_constraints():
    """Aplica constraints y columnas de auditoría bajo demanda (sólo admin)"""
    user = current_user()
    if not user or not user.is_admin:
        return jsonify({'success': False, 'message': 'No autorizado'}), 403
    try:
        ensure_constraints()
        return jsonify({'success': True, 'message': 'Constraints aplicados'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error al aplicar constraints: {str(e)}'}), 500

# ==================== API ENDPOINTS - RULETA ====================
@app.route('/api/public/ruleta-config', methods=['GET'])
def get_ruleta_config_public():
    """Obtiene la configuración activa de la ruleta para el juego"""
    configs = ConfiguracionRuleta.query.filter_by(activo=True).order_by(ConfiguracionRuleta.orden.asc(), ConfiguracionRuleta.id.asc()).all()
    # Si no hay configuración, devolver lista vacía para que el frontend use defaults o lo que decida
    return jsonify({
        'success': True,
        'config': [c.to_dict() for c in configs]
    })

@app.route('/api/ruleta-config', methods=['GET'])
@token_required
def get_ruleta_config_admin():
    """Obtiene toda la configuración de la ruleta (admin)"""
    configs = ConfiguracionRuleta.query.order_by(ConfiguracionRuleta.orden.asc(), ConfiguracionRuleta.id.asc()).all()
    return jsonify({
        'success': True,
        'config': [c.to_dict() for c in configs]
    })

@app.route('/api/ruleta-config', methods=['POST'])
@token_required
def create_ruleta_config():
    try:
        data = request.get_json()
        if not data.get('texto') or not data.get('tipo') or not data.get('color'):
            return jsonify({'success': False, 'message': 'Faltan campos requeridos'}), 400
        
        c = ConfiguracionRuleta(
            texto=data['texto'],
            tipo=data['tipo'],
            color=data['color'],
            probabilidad=data.get('probabilidad', 1),
            activo=bool(data.get('activo', True)),
            orden=data.get('orden', 0)
        )
        db.session.add(c)
        db.session.commit()
        return jsonify({'success': True, 'config': c.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/ruleta-config/<int:id>', methods=['PUT'])
@token_required
def update_ruleta_config(id):
    try:
        c = ConfiguracionRuleta.query.get_or_404(id)
        data = request.get_json()
        if 'texto' in data: c.texto = data['texto']
        if 'tipo' in data: c.tipo = data['tipo']
        if 'color' in data: c.color = data['color']
        if 'probabilidad' in data: c.probabilidad = data['probabilidad']
        if 'activo' in data: c.activo = bool(data['activo'])
        if 'orden' in data: c.orden = data['orden']
        db.session.commit()
        return jsonify({'success': True, 'config': c.to_dict()})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/ruleta-config/<int:id>', methods=['DELETE'])
@token_required
def delete_ruleta_config(id):
    try:
        c = ConfiguracionRuleta.query.get_or_404(id)
        db.session.delete(c)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Configuración eliminada'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    init_db()
    debug_mode = os.getenv('DEBUG', 'False').lower() == 'true'
    print("🚀 Servidor Flask iniciado en http://localhost:5000")
    print("🐘 Base de datos: PostgreSQL 17")
    print(f"📊 Conectado a: {os.getenv('DB_NAME')} en {os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}")
    print("📝 Formulario de registro: http://localhost:5000/registro")
    print("👨‍💼 Panel admin: http://localhost:5000/admin")
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)

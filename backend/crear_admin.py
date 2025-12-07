"""
Script para crear un usuario administrador
Uso: python crear_admin.py <username> <password> <email>
"""

from app import app, db, User
import sys

def crear_admin(username, password, email):
    """Crea un usuario administrador"""
    with app.app_context():
        # Verificar si ya existe
        if User.query.filter_by(username=username).first():
            print(f"❌ El usuario '{username}' ya existe")
            return False
        
        if User.query.filter_by(email=email).first():
            print(f"❌ El email '{email}' ya está registrado")
            return False
        
        # Crear usuario
        user = User(username=username, email=email, is_admin=True)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        print(f"✅ Usuario admin '{username}' creado exitosamente")
        print(f"   Email: {email}")
        print(f"   Puedes iniciar sesión en: http://localhost:5000/login")
        return True

if __name__ == '__main__':
    if len(sys.argv) != 4:
        print("❌ Uso incorrecto")
        print("   Uso: python crear_admin.py <username> <password> <email>")
        print("   Ejemplo: python crear_admin.py admin password123 admin@dh2ocol.com")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    email = sys.argv[3]
    
    # Validaciones básicas
    if len(username) < 3:
        print("❌ El nombre de usuario debe tener al menos 3 caracteres")
        sys.exit(1)
    
    if len(password) < 6:
        print("❌ La contraseña debe tener al menos 6 caracteres")
        sys.exit(1)
    
    if '@' not in email:
        print("❌ El email no es válido")
        sys.exit(1)
    
    crear_admin(username, password, email)

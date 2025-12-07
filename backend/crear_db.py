"""
Script para crear la base de datos PostgreSQL para la aplicación de trivia
Ejecutar este script después de instalar PostgreSQL 17
"""

import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os

load_dotenv()

def crear_base_datos():
    """Crea la base de datos trivia_dh2o si no existe"""
    
    # Conectar a la base de datos por defecto 'postgres'
    try:
        conn = psycopg2.connect(
            dbname='postgres',
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT')
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Verificar si la base de datos existe
        cursor.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s",
            (os.getenv('DB_NAME'),)
        )
        
        if cursor.fetchone():
            print(f"✅ La base de datos '{os.getenv('DB_NAME')}' ya existe")
        else:
            # Crear la base de datos
            cursor.execute(
                sql.SQL("CREATE DATABASE {}").format(
                    sql.Identifier(os.getenv('DB_NAME'))
                )
            )
            print(f"✅ Base de datos '{os.getenv('DB_NAME')}' creada exitosamente")
        
        cursor.close()
        conn.close()
        
        # Verificar conexión a la nueva base de datos
        test_conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        print(f"✅ Conexión exitosa a {os.getenv('DB_NAME')}")
        test_conn.close()
        
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Error al crear la base de datos: {e}")
        print("\n💡 Asegúrate de que:")
        print("   1. PostgreSQL 17 esté instalado y corriendo")
        print("   2. Las credenciales en .env sean correctas")
        print(f"   3. El usuario '{os.getenv('DB_USER')}' tenga permisos para crear bases de datos")
        return False

if __name__ == '__main__':
    print("🐘 Creando base de datos PostgreSQL para Trivia DH2OCOL")
    print("=" * 60)
    print(f"Host: {os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}")
    print(f"Usuario: {os.getenv('DB_USER')}")
    print(f"Base de datos: {os.getenv('DB_NAME')}")
    print("=" * 60)
    
    if crear_base_datos():
        print("\n🎉 ¡Listo! Ahora puedes ejecutar 'python app.py' para iniciar la aplicación")
    else:
        print("\n⚠️  Por favor, revisa los errores y vuelve a intentar")

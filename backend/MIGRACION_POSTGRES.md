# 🐘 Guía de Migración a PostgreSQL 17

## ✅ Cambios Realizados

### 1. Dependencias Actualizadas
- ✅ Agregado `psycopg2-binary==2.9.9` para conectar con PostgreSQL

### 2. Configuración de la Aplicación
- ✅ Carga de variables de entorno desde `.env`
- ✅ Conexión a PostgreSQL usando `DATABASE_URL`
- ✅ Eliminada dependencia de SQLite

### 3. Variables de Entorno Configuradas
El archivo `.env` ya contiene la configuración necesaria:
```env
DB_NAME=trivia_dh2o
DB_USER=postgres
DB_PASSWORD=1481
DB_HOST=localhost
DB_PORT=5432
DATABASE_URL=postgresql://postgres:1481@localhost:5432/trivia_dh2o
```

---

## 📋 Pasos para Completar la Migración

### Paso 1: Instalar PostgreSQL 17
Si aún no tienes PostgreSQL 17 instalado:

**Windows:**
1. Descarga PostgreSQL 17 desde: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador
3. Durante la instalación, configura la contraseña del usuario `postgres` como `1481`
4. Asegúrate de que el puerto sea `5432`

### Paso 2: Crear la Base de Datos
Abre **pgAdmin** o la terminal de PostgreSQL y ejecuta:

```sql
CREATE DATABASE trivia_dh2o
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Colombia.1252'
    LC_CTYPE = 'Spanish_Colombia.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
```

O desde la terminal de Windows (PowerShell):
```powershell
psql -U postgres -c "CREATE DATABASE trivia_dh2o;"
```

### Paso 3: Instalar Dependencias Python
Detén el servidor actual (`Ctrl+C` en la terminal donde corre `python app.py`) y ejecuta:

```powershell
cd e:\DH2OCOL\python\trivia_dh2o\backend
pip install -r requirements.txt
```

### Paso 4: Inicializar las Tablas
El script `app.py` creará automáticamente las tablas al iniciar. Ejecuta:

```powershell
python app.py
```

Deberías ver:
```
✅ Base de datos inicializada correctamente
🚀 Servidor Flask iniciado en http://localhost:5000
🐘 Base de datos: PostgreSQL 17
📊 Conectado a: trivia_dh2o en localhost:5432
```

---

## 🔄 Migrar Datos Existentes (Opcional)

Si tienes datos en la base SQLite anterior (`database.db`), puedes migrarlos:

### Script de Migración
Crea un archivo `migrar_datos.py` en el directorio `backend`:

```python
import sqlite3
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

# Conectar a SQLite
sqlite_conn = sqlite3.connect('database.db')
sqlite_cursor = sqlite_conn.cursor()

# Conectar a PostgreSQL
pg_conn = psycopg2.connect(os.getenv('DATABASE_URL'))
pg_cursor = pg_conn.cursor()

# Migrar clientes
sqlite_cursor.execute("SELECT * FROM clientes")
clientes = sqlite_cursor.fetchall()

for cliente in clientes:
    pg_cursor.execute("""
        INSERT INTO clientes 
        (id, codigo_premio, cedula, nombres, apellidos, direccion, telefono, premio, fecha_registro, canjeado)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO NOTHING
    """, cliente)

pg_conn.commit()
print(f"✅ Migrados {len(clientes)} registros")

# Cerrar conexiones
sqlite_conn.close()
pg_conn.close()
```

---

## 🧪 Verificación

### 1. Verificar Conexión
```powershell
psql -U postgres -d trivia_dh2o -c "\dt"
```

Deberías ver la tabla `clientes`.

### 2. Verificar Datos
```powershell
psql -U postgres -d trivia_dh2o -c "SELECT COUNT(*) FROM clientes;"
```

---

## 🔧 Solución de Problemas

### Error: "could not connect to server"
- Verifica que PostgreSQL esté corriendo:
  ```powershell
  Get-Service -Name postgresql*
  ```
- Si no está corriendo, inícialo:
  ```powershell
  Start-Service postgresql-x64-17
  ```

### Error: "database does not exist"
- Asegúrate de haber creado la base de datos `trivia_dh2o` (ver Paso 2)

### Error: "password authentication failed"
- Verifica que la contraseña en `.env` sea correcta (`DB_PASSWORD=1481`)

---

## 📊 Ventajas de PostgreSQL

✅ **Mejor rendimiento** para múltiples usuarios concurrentes  
✅ **Integridad de datos** con transacciones ACID  
✅ **Escalabilidad** para producción  
✅ **Tipos de datos avanzados** (JSON, Arrays, etc.)  
✅ **Soporte empresarial** y comunidad activa  

---

## 🎯 Próximos Pasos

1. ✅ Instalar PostgreSQL 17
2. ✅ Crear base de datos `trivia_dh2o`
3. ✅ Instalar dependencias Python
4. ✅ Ejecutar aplicación
5. ⚠️ (Opcional) Migrar datos de SQLite
6. ✅ Verificar funcionamiento

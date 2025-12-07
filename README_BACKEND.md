# Guía de Ejecución y Despliegue (Monolito)

Aplicación monolítica que incluye frontend estático y backend Flask sirviendo todo en el puerto `5000`. Despliegue preparado para producción con `gunicorn` dentro de contenedor Docker.

## Requisitos

- Docker 24+
- PostgreSQL accesible (local o gestionado)
- Opcional para desarrollo: Python 3.11 y `pip`

## Variables de Entorno

Defínelas en tu entorno o en `backend/.env` (no se versiona):

```env
DATABASE_URL=postgresql+psycopg2://USER:PASS@HOST:5432/DBNAME
SECRET_KEY=changeme
JWT_SECRET_KEY=changeme
DEBUG=false
```

Consulta `backend/MIGRACION_POSTGRES.md` para detalles de PostgreSQL.

## Ejecutar con Docker (Producción)

```bash
docker build -t dh2ocol/trivia-monolith:latest .
docker run --rm -p 8080:5000 \
  -e DATABASE_URL="postgresql+psycopg2://USER:PASS@HOST:5432/DBNAME" \
  -e SECRET_KEY="changeme" \
  -e JWT_SECRET_KEY="changeme" \
  -e DEBUG=false \
  dh2ocol/trivia-monolith:latest
```

Accede a `http://localhost:8080/`.

Healthcheck interno consulta `http://localhost:5000/api/estadisticas`.

## Ejecutar sin Docker (Desarrollo)

```bash
cd backend
pip install -r requirements.txt
set DEBUG=true  # Windows PowerShell, opcional
python app.py
```

El servidor quedará en `http://localhost:5000`.

## Crear usuario Admin

`/admin` y `/premios` requieren login. Crea un usuario admin:

```bash
cd backend
python crear_admin.py <username> <password> <email>
```

Luego inicia sesión en `http://localhost:5000/login`.

## Rutas principales

- `/` juego y assets estáticos (`index.html`, `script.js`, `assets/`)
- `/registro` formulario de registro de premio
- `/login` inicio de sesión
- `/admin` panel administrativo (protegido)
- `/premios` gestión de premios (protegido)

## API

- `POST /api/login` inicio de sesión (set-cookie `auth_token`)
- `POST /api/logout` cierre de sesión
- `GET /api/verify` verificación de autenticación
- `POST /api/registro` registrar premio de cliente
- `GET /api/clientes` listar clientes
- `PUT /api/canjear/{id}` marcar premio como canjeado
- `GET /api/estadisticas` estadísticas del sistema
- `GET /api/premios` listar premios
- `POST /api/premio` crear premio
- `PUT /api/premio/{id}` actualizar premio
- `DELETE /api/premio/{id}` eliminar premio

## Despliegue con Dockploy

- Crea una app y apunta al `Dockerfile` del monolito
- Puerto del contenedor: `5000`
- Dominio: `trivial.dh2o.com.co` con TLS
- Variables: `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY`, `DEBUG=false`

## Solución de Problemas

- `DATABASE_URL` inválida: revisa credenciales, host, puerto
- 401 en `/admin`: inicia sesión en `/login`
- 5xx en API: verifica conectividad a PostgreSQL

## Estructura

```
trivia_dh2o/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── crear_admin.py
│   └── MIGRACION_POSTGRES.md
├── templates/
│   ├── admin.html
│   ├── premios.html
│   ├── login.html
│   └── registro.html
├── assets/
│   ├── css/*  ├── js/*  └── img/*
├── index.html
├── script.js
└── Dockerfile
```

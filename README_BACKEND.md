# Instrucciones de Instalación y Ejecución

## Sistema de Registro de Premios DH2OCOL

### Requisitos Previos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Paso 1: Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
cd backend
pip install -r requirements.txt
```

### Paso 2: Inicializar Base de Datos

La base de datos se creará automáticamente al ejecutar el servidor por primera vez.

### Paso 3: Ejecutar el Servidor

```bash
python app.py
```

Deberías ver un mensaje como:
```
✅ Base de datos inicializada correctamente
🚀 Servidor Flask iniciado en http://localhost:5000
📝 Formulario de registro: http://localhost:5000/registro
👨‍💼 Panel admin: http://localhost:5000/admin
```

### Paso 4: Acceder a la Aplicación

Abre tu navegador y visita:

- **Juego de Trivia**: http://localhost:5000/
- **Formulario de Registro**: http://localhost:5000/registro
- **Panel Administrativo**: http://localhost:5000/admin

### Flujo de Uso

1. **Jugar**: Abre http://localhost:5000/ y juega trivia o memory card
2. **Ganar Premio**: Responde 3 preguntas correctas o encuentra 3 pares
3. **Ver Modal**: Se muestra el premio y código único
4. **Registrar**: Click en "Registrar Premio" → Completa el formulario
5. **Administrar**: Accede a http://localhost:5000/admin para ver todos los registros

### Estructura de Archivos Creados

```
trivia_dh2o/
├── backend/
│   ├── app.py              ✅ Aplicación Flask
│   ├── requirements.txt    ✅ Dependencias
│   └── database.db         (se crea automáticamente)
├── templates/
│   ├── registro.html       ✅ Formulario de registro
│   └── admin.html          ✅ Panel administrativo
├── index.html              ✅ Juego (modificado)
└── script.js               ✅ Lógica (modificada)
```

### Solución de Problemas

**Error: "No module named 'flask'"**
```bash
pip install Flask Flask-SQLAlchemy Flask-CORS
```

**Error: "Port 5000 already in use"**
- Cambia el puerto en `app.py` línea final: `app.run(port=5001)`

**Base de datos no se crea**
- Verifica que tengas permisos de escritura en la carpeta `backend/`

### Características Implementadas

✅ Backend Flask con SQLite
✅ API REST completa
✅ Formulario de registro con validación
✅ Panel administrativo con estadísticas
✅ Búsqueda y filtrado de registros
✅ Exportación a CSV
✅ Validación de códigos únicos
✅ Prevención de duplicados
✅ Diseño institucional DH2OCOL
✅ Integración completa con el juego

### Próximos Pasos (Opcional)

- Agregar autenticación para panel admin
- Implementar envío de emails
- Generar códigos QR
- Integrar con sistema CRM

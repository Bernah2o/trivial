"""
Script para agregar la función de logout a admin.html y premios.html
"""

# Función JavaScript de logout
logout_function = """
        async function cerrarSesion() {
            if (!confirm('¿Estás seguro de cerrar sesión?')) return;
            
            try {
                const response = await fetch('/api/logout', {
                    method: 'POST'
                });
                
                if (response.ok) {
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                window.location.href = '/';
            }
        }
"""

# Botón de logout (para agregar manualmente)
logout_button_html = """
<button class="btn btn-danger" onclick="cerrarSesion()">🚪 Cerrar Sesión</button>
"""

print("=" * 60)
print("FUNCIÓN DE LOGOUT PARA AGREGAR")
print("=" * 60)
print("\n1. AGREGAR ESTA FUNCIÓN JAVASCRIPT antes del </script>:")
print(logout_function)
print("\n2. AGREGAR ESTE BOTÓN en los controles:")
print(logout_button_html)
print("\n" + "=" * 60)
print("NOTA: Agrega el botón después de los otros botones en:")
print("  - admin.html (después del botón 'Exportar CSV')")
print("  - premios.html (después del botón 'Actualizar')")
print("=" * 60)

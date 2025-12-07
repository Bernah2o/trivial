# Requerimientos del Sistema -- Juego Trivia Interactivo DH2OCOL

## 1. Descripción General

DH2OCOL requiere un juego tipo trivia para proyectar en ferias
comerciales. El sistema debe funcionar sin backend, localmente, y
generar premios o descuentos al acertar.

## 2. Objetivos

- Atraer clientes.
- Educar sobre higiene del agua.
- Generar premios.
- Funcionamiento independiente sin internet.

## 3. Alcance

Incluye: - Pantalla de inicio. - Sistema de preguntas. - Tres
oportunidades por jugador. - Sistema de premios. - Pantalla final. -
Código de premio generado. No incluye: - Base de datos. - Backend. -
Registro de usuarios.

## 4. Requerimientos Funcionales

### 4.1 Pantalla de Inicio

- RF-01: Mostrar logo.
- RF-02: Botón "Iniciar Juego".
- RF-03: Diseño atractivo.

### 4.2 Mecánica del Juego

- RF-04: Tres oportunidades.
- RF-05: Mínimo 10 preguntas.
- RF-06: Cuatro opciones por pregunta.
- RF-07: Feedback inmediato.
- RF-08: Finalizar al perder oportunidades.

### 4.3 Sistema de Premios

- RF-09: Mostrar premio al acertar.
- RF-10: Generar código aleatorio `DH2O-FERIA-XXXX`.
- RF-11: Lista de premios predefinida.
- RF-12: Selección aleatoria de premio.

### 4.4 Pantalla Final

- RF-13: Mensaje de ganador o perdedor.
- RF-14: Botón "Volver a jugar".
- RF-15: Mostrar código de premio.

## 5. Requerimientos No Funcionales

### 5.1 Rendimiento

- RNF-01: Carga \< 3s.
- RNF-02: Funciona offline.

### 5.2 Compatibilidad

- RNF-03: Chrome, Edge, Firefox.
- RNF-04: Adaptado a pantallas grandes.

### 5.3 Portabilidad

- RNF-05: Funcionamiento desde archivos locales.

### 5.4 Usabilidad

- RNF-06: Interfaz simple.
- RNF-07: Colores DH2OCOL.
- RNF-08: Textos grandes.

## 6. Requerimientos de Contenido

### 6.1 Preguntas

- Mínimo 10 preguntas sobre higiene del agua y servicios DH2OCOL.

### 6.2 Premios

- Lista editable en archivo JS.

### 6.3 Branding

- Logo y colores corporativos.

## 7. Restricciones

- Sin backend.
- Sin almacenamiento de datos.
- Solo HTML/CSS/JS.

## 8. Flujo del Usuario

1.  Pantalla inicial.
2.  Pregunta 1.
3.  Pregunta 2.
4.  Resultado final.

## 9. Entregables

- index.html
- style.css
- script.js
- assets/
- Documento de requerimientos (.md)

## 10. Mejoras y Aclaraciones Propuestas

### 10.1 Criterios de Aceptación (ejemplos)

- RF-04 (Tres oportunidades): Al iniciar una partida, el contador de vidas muestra 3. Cada respuesta incorrecta reduce en 1. Al llegar a 0, se muestra la pantalla final de perdedor inmediatamente.
- RF-05 (Mínimo 10 preguntas): El banco de preguntas contiene al menos 10 items. El juego presenta preguntas sin repetir dentro de una partida.
- RF-06 (Cuatro opciones): Cada pregunta renderiza exactamente 4 opciones clicables o seleccionables con teclado.
- RF-07 (Feedback inmediato): Tras seleccionar una opción, se muestra visualmente correcto/incorrecto en < 300 ms y se habilita el siguiente paso.
- RF-10 (Código premio): El código cumple el patrón `DH2O-FERIA-XXXX` usando caracteres A–Z y 0–9. No se repite dentro de la sesión actual.

### 10.2 Especificación Técnica

- Arquitectura: Solo HTML/CSS/JS sin bundlers. Un único `index.html` carga `style.css` y `script.js`.
- Módulos lógicos en `script.js`: gestión de estado del juego, render de UI, motor de preguntas, motor de premios, utilidades (aleatoriedad, formato de código).
- Estado del juego: `{ vidas: 3, indicePregunta: 0, preguntasUsadas: Set, premioActual: null, codigoPremio: null }`.
- Persistencia: No se almacena nada fuera de memoria. Al cerrar/reiniciar la página, se borra el estado.

### 10.3 Mecánica del Juego Detallada

- Flujo por pregunta: mostrar enunciado + 4 opciones → usuario selecciona → feedback visual y auditivo → si correcto, evaluar premio; si incorrecto, restar vida → avanzar o finalizar.
- Finalización: se termina al perder las 3 vidas o al agotar el banco de preguntas seleccionado para la partida.
- Reintentos: Botón "Volver a jugar" reinicia el estado y retorna a la pantalla inicial.

### 10.4 Sistema de Premios Detallado

- Lista de premios en `script.js` como arreglo de objetos: `{ nombre, descripcion, tipo, probabilidad, stockOpcional }`.
- Selección aleatoria ponderada por `probabilidad`. Si `stockOpcional` existe y llega a 0, el premio deja de elegirse.
- Generación de código: patrón `DH2O-FERIA-XXXX` donde `XXXX` son 4 caracteres alfanuméricos en mayúsculas. Unicidad dentro de la sesión asegurada con un `Set`.
- Presentación: al acertar y obtener premio, mostrar modal con premio y código; el código también aparece en la pantalla final si el jugador fue ganador.

### 10.5 Modo Kiosco y Operación

- Pantalla completa (full-screen) al iniciar la partida, con un botón para salir a pantalla inicial.
- Auto-reinicio tras inactividad: si no hay interacción por 60 s en pantalla final, volver a la pantalla inicial.
- Ocultar controles del navegador en la UI y evitar prompts. No se bloquean atajos del sistema.

### 10.6 Accesibilidad y UX

- Navegación por teclado: `Tab` para foco, `Enter` para seleccionar, indicador de foco visible.
- Contraste AA y tipografías de tamaño mínimo 18 px para pantallas grandes.
- Feedback auditivo opcional (sonidos de acierto/error) con control de volumen o mute.

### 10.7 Rendimiento y Compatibilidad

- Tiempo de carga: < 3 s en equipos de feria (Chrome/Edge/Firefox actuales) con assets locales.
- Presupuesto de assets: imágenes y fuentes < 2 MB totales; audio < 1 MB.
- Resolución objetivo: 1920×1080; diseño responsivo escala correctamente en 1366×768.

### 10.8 Contenido y Branding

- Banco de preguntas: mínimo 10, ideal 15–20 para variabilidad. Revisadas por tema higiene del agua y servicios DH2OCOL.
- Branding: uso del logo oficial y paleta corporativa consistente.
- Textos: lenguaje claro, títulos grandes, instrucciones breves en pantalla inicial.

### 10.9 Pruebas y Validación

- Casos: vidas decrementan correctamente; no se repiten preguntas; feedback en < 300 ms; generación única de códigos; selección de premios respeta probabilidades.
- Prueba offline: abrir `index.html` directamente desde archivos locales sin servidor y validar funcionamiento completo.

### 10.10 Entregables Adicionales

- `README.md` con instrucciones de ejecución (modo offline, atajos de teclado).
- `assets/` con `logo.*`, imágenes de fondo, sonidos `success.*` y `error.*`.

### 10.11 Soporte de Múltiples Juegos/Trivias (Packs)

- Selección de pack en la pantalla inicial: una lista de trivias (mínimo 2) con nombre y breve descripción.
- Cada pack define su propio banco de preguntas y, opcionalmente, su lista de premios y branding.
- Estructura sugerida en `script.js`:
  - `packs = [{ id, nombre, descripcion, preguntas: [...], premios: [...], brandingOpcional: { colores, logo } }]`.
- Al iniciar partida se fija el pack activo; no se guarda fuera de memoria.
- Rotación opcional de packs: si se activa, mostrar un pack distinto en cada partida de forma aleatoria.
- Criterios de aceptación:
  - La UI muestra al menos 2 packs seleccionables.
  - Al elegir un pack, solo se usan preguntas y premios de ese pack durante la partida.
  - El código de premio mantiene unicidad dentro de la sesión global, independientemente del pack.
  - No se requieren archivos externos ni backend; todo se define en JS local.

### 10.12 Ajuste de Flujo para Multi-Trivias

- Flujo: Pantalla inicial → Selección de pack → Preguntas del pack → Pantalla final.
- El botón "Volver a jugar" retorna a la pantalla inicial con selección de pack visible.

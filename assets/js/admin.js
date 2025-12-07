'use strict';
let clientes = [];

document.addEventListener('DOMContentLoaded', () => {
  cargarClientes();
  cargarEstadisticas();
  const searchEl = document.getElementById('search');
  if (searchEl) searchEl.addEventListener('input', filtrarClientes);
});

async function cargarClientes() {
  const loading = document.getElementById('loading');
  try {
    const response = await fetch('/api/clientes');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (data && data.success && Array.isArray(data.clientes)) {
      clientes = data.clientes;
    } else {
      clientes = [];
    }
  } catch (error) {
    console.error('Error al cargar clientes:', error);
    clientes = [];
  }
  renderizarClientes(clientes);
}

async function cargarEstadisticas() {
  try {
    const response = await fetch('/api/estadisticas');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (data && data.success) {
      setText('stat-total', data.total_registros);
      setText('stat-canjeados', data.canjeados);
      setText('stat-pendientes', data.pendientes);
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
    setText('stat-total', 0);
    setText('stat-canjeados', 0);
    setText('stat-pendientes', 0);
  }
}

function renderizarClientes(clientesData) {
  const loading = document.getElementById('loading');
  const table = document.getElementById('clientes-table');
  const emptyState = document.getElementById('empty-state');
  const tbody = document.getElementById('clientes-tbody');
  if (loading) loading.style.display = 'none';
  if (!Array.isArray(clientesData)) clientesData = [];

  if (clientesData.length === 0) {
    if (table) table.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  if (table) table.style.display = 'table';
  if (emptyState) emptyState.style.display = 'none';

  // Render sin usar template strings para evitar problemas de sintaxis en entornos restrictivos
  if (tbody) {
    tbody.innerHTML = '';
    clientesData.forEach((cliente) => {
      const tr = document.createElement('tr');
      tr.appendChild(tdWithClass(safe(cliente.codigo_premio), 'codigo'));
      tr.appendChild(td(safe(cliente.cedula)));
      tr.appendChild(td(safe(cliente.nombres) + ' ' + safe(cliente.apellidos)));
      tr.appendChild(td(safe(cliente.telefono)));
      tr.appendChild(td(safe(cliente.premio)));
      tr.appendChild(td(formatDate(cliente.fecha_registro)));
      const tdEstado = document.createElement('td');
      const span = document.createElement('span');
      if (cliente.canjeado) {
        span.className = 'badge badge-success';
        span.textContent = '✓ Canjeado';
      } else {
        span.className = 'badge badge-pending';
        span.textContent = '⏳ Pendiente';
      }
      tdEstado.appendChild(span);
      tr.appendChild(tdEstado);

      const tdAcciones = document.createElement('td');
      if (!cliente.canjeado) {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.textContent = 'Marcar Canjeado';
        btn.addEventListener('click', () => canjearPremio(cliente.id));
        tdAcciones.appendChild(btn);
      } else {
        const dash = document.createElement('span');
        dash.style.opacity = '0.5';
        dash.textContent = '-';
        tdAcciones.appendChild(dash);
      }
      tr.appendChild(tdAcciones);
      tbody.appendChild(tr);
    });
  }
}

function filtrarClientes() {
  const searchTerm = (document.getElementById('search')?.value || '').toLowerCase();
  const clientesFiltrados = clientes.filter((cliente) => {
    return (
      String(cliente.codigo_premio || '').toLowerCase().includes(searchTerm) ||
      String(cliente.cedula || '').toLowerCase().includes(searchTerm) ||
      String(cliente.nombres || '').toLowerCase().includes(searchTerm) ||
      String(cliente.apellidos || '').toLowerCase().includes(searchTerm)
    );
  });
  renderizarClientes(clientesFiltrados);
}

async function canjearPremio(id) {
  if (!confirm('¿Marcar este premio como canjeado?')) return;
  try {
    const response = await fetch(`/api/canjear/${id}`, { method: 'PUT' });
    const data = await response.json();
    if (data && data.success) {
      alert('Premio marcado como canjeado');
      await cargarClientes();
      await cargarEstadisticas();
    } else {
      alert('No se pudo canjear el premio');
    }
  } catch (error) {
    alert('Error al canjear premio');
  }
}

function exportarCSV() {
  if (!Array.isArray(clientes) || clientes.length === 0) {
    alert('No hay datos para exportar');
    return;
  }
  const headers = ['Código', 'Cédula', 'Nombres', 'Apellidos', 'Dirección', 'Teléfono', 'Premio', 'Fecha', 'Canjeado'];
  const rows = clientes.map((c) => [
    safe(c.codigo_premio),
    safe(c.cedula),
    safe(c.nombres),
    safe(c.apellidos),
    safe(c.direccion),
    safe(c.telefono),
    safe(c.premio),
    formatDate(c.fecha_registro),
    c.canjeado ? 'Sí' : 'No',
  ]);
  let csv = headers.join(',') + '\n';
  rows.forEach((row) => {
    csv += row.map((field) => '"' + String(field).replace(/"/g, '""') + '"').join(',') + '\n';
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'premios_DH2OCOL_' + new Date().toISOString().split('T')[0] + '.csv';
  link.click();
}

async function cerrarSesion() {
  if (!confirm('¿Estás seguro de cerrar sesión?')) return;
  try {
    const response = await fetch('/api/logout', { method: 'POST' });
    if (response.ok) {
      window.location.href = '/';
    } else {
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    window.location.href = '/';
  }
}

// Utilidades
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = String(value ?? ''); }
function td(text) { const c = document.createElement('td'); c.textContent = String(text ?? ''); return c; }
function tdWithClass(text, cls) { const c = td(text); c.className = cls; return c; }
function safe(v) { return v == null ? '' : v; }
function formatDate(d) { try { return d ? new Date(d).toLocaleString('es-CO') : ''; } catch { return ''; } }

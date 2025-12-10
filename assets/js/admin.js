"use strict";
let clientes = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarClientes();
  cargarEstadisticas();
  const searchEl = document.getElementById("search");
  if (searchEl) searchEl.addEventListener("input", filtrarClientes);
});

async function cargarClientes() {
  const loading = document.getElementById("loading");
  try {
    const response = await fetch("/api/clientes");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    if (data && data.success && Array.isArray(data.clientes)) {
      clientes = data.clientes;
    } else {
      clientes = [];
    }
  } catch (error) {
    console.error("Error al cargar clientes:", error);
    clientes = [];
  }
  renderizarClientes(clientes);
}

async function cargarEstadisticas() {
  try {
    const response = await fetch("/api/estadisticas");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    if (data && data.success) {
      setText("stat-total", data.total_registros);
      setText("stat-canjeados", data.canjeados);
      setText("stat-pendientes", data.pendientes);
    }
  } catch (error) {
    console.error("Error al cargar estadísticas:", error);
    setText("stat-total", 0);
    setText("stat-canjeados", 0);
    setText("stat-pendientes", 0);
  }
}

function renderizarClientes(clientesData) {
  const loading = document.getElementById("loading");
  const table = document.getElementById("clientes-table");
  const emptyState = document.getElementById("empty-state");
  const tbody = document.getElementById("clientes-tbody");
  if (loading) loading.style.display = "none";
  if (!Array.isArray(clientesData)) clientesData = [];

  if (clientesData.length === 0) {
    if (table) table.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }
  if (table) table.style.display = "table";
  if (emptyState) emptyState.style.display = "none";

  // Render sin usar template strings para evitar problemas de sintaxis en entornos restrictivos
  if (tbody) {
    tbody.innerHTML = "";
    clientesData.forEach((cliente) => {
      const tr = document.createElement("tr");
      tr.appendChild(tdWithClass(safe(cliente.codigo_premio), "codigo"));
      tr.appendChild(td(safe(cliente.cedula)));
      tr.appendChild(td(safe(cliente.nombres) + " " + safe(cliente.apellidos)));
      tr.appendChild(td(safe(cliente.telefono)));
      tr.appendChild(td(safe(cliente.premio)));
      tr.appendChild(td(formatDate(cliente.fecha_registro)));
      const tdEstado = document.createElement("td");
      const span = document.createElement("span");
      if (cliente.canjeado) {
        span.className = "badge badge-success";
        span.textContent = "✓ Canjeado";
      } else {
        span.className = "badge badge-pending";
        span.textContent = "⏳ Pendiente";
      }
      tdEstado.appendChild(span);
      tr.appendChild(tdEstado);

      const tdAcciones = document.createElement("td");
      tdAcciones.style.display = "flex";
      tdAcciones.style.gap = "8px";
      
      // Botón Editar
      const btnEdit = document.createElement("button");
      btnEdit.className = "btn";
      btnEdit.style.fontSize = "12px";
      btnEdit.style.padding = "4px 8px";
      btnEdit.textContent = "✏️";
      btnEdit.title = "Editar Cliente";
      btnEdit.addEventListener("click", () => editarCliente(cliente));
      tdAcciones.appendChild(btnEdit);

      // Botón Eliminar
      const btnDel = document.createElement("button");
      btnDel.className = "btn btn-danger";
      btnDel.style.fontSize = "12px";
      btnDel.style.padding = "4px 8px";
      btnDel.textContent = "🗑️";
      btnDel.title = "Eliminar Cliente";
      btnDel.addEventListener("click", () => eliminarCliente(cliente.id));
      tdAcciones.appendChild(btnDel);

      if (!cliente.canjeado) {
        const btnCanje = document.createElement("button");
        btnCanje.className = "action-btn";
        btnCanje.textContent = "Canjear";
        btnCanje.title = "Marcar como Canjeado";
        btnCanje.addEventListener("click", () => canjearPremio(cliente.id));
        tdAcciones.appendChild(btnCanje);
      }
      
      tr.appendChild(tdAcciones);
      tbody.appendChild(tr);
    });
  }
}

let editingClientId = null;

function editarCliente(cliente) {
  editingClientId = cliente.id;
  document.getElementById("client-modal-title").textContent = "Editar Cliente";
  document.getElementById("cm-nombres").value = cliente.nombres;
  document.getElementById("cm-apellidos").value = cliente.apellidos;
  document.getElementById("cm-cedula").value = cliente.cedula;
  document.getElementById("cm-telefono").value = cliente.telefono;
  document.getElementById("cm-direccion").value = cliente.direccion;
  
  document.getElementById("client-modal").classList.remove("hidden");
}

document.getElementById("client-cancel").addEventListener("click", () => {
  document.getElementById("client-modal").classList.add("hidden");
  editingClientId = null;
});

document.getElementById("client-save").addEventListener("click", async () => {
    if(!editingClientId) return;
    
    const payload = {
        nombres: document.getElementById("cm-nombres").value,
        apellidos: document.getElementById("cm-apellidos").value,
        cedula: document.getElementById("cm-cedula").value,
        telefono: document.getElementById("cm-telefono").value,
        direccion: document.getElementById("cm-direccion").value
    };
    
    try {
        const res = await fetch(`/api/cliente/${editingClientId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if(data.success) {
            showToast("Cliente actualizado", "success");
            document.getElementById("client-modal").classList.add("hidden");
            cargarClientes();
        } else {
            showToast(data.message || "Error al actualizar", "error");
        }
    } catch(e) {
        showToast("Error de conexión", "error");
    }
});

async function eliminarCliente(id) {
  const ok = await confirmModal("¿Eliminar este registro? Esta acción es irreversible y devolverá el premio al inventario si aplica.", {
    okText: "Eliminar",
    cancelText: "Cancelar",
    title: "Eliminar Cliente"
  });
  if (!ok) return;
  
  try {
      const res = await fetch(`/api/cliente/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if(data.success) {
          showToast("Registro eliminado", "success");
          cargarClientes();
          cargarEstadisticas();
      } else {
          showToast(data.message || "Error al eliminar", "error");
      }
  } catch(e) {
      showToast("Error al eliminar", "error");
  }
}

function filtrarClientes() {
  const searchTerm = (
    document.getElementById("search")?.value || ""
  ).toLowerCase();
  const clientesFiltrados = clientes.filter((cliente) => {
    return (
      String(cliente.codigo_premio || "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(cliente.cedula || "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(cliente.nombres || "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(cliente.apellidos || "")
        .toLowerCase()
        .includes(searchTerm)
    );
  });
  renderizarClientes(clientesFiltrados);
}

async function canjearPremio(id) {
  const ok = await confirmModal("¿Marcar este premio como canjeado?", {
    okText: "Confirmar",
    cancelText: "Cancelar",
  });
  if (!ok) return;
  try {
    const response = await fetch(`/api/canjear/${id}`, { method: "PUT" });
    const data = await response.json();
    if (data && data.success) {
      showToast("Premio marcado como canjeado", "success");
      await cargarClientes();
      await cargarEstadisticas();
    } else {
      showToast("No se pudo canjear el premio", "error");
    }
  } catch (error) {
    showToast("Error al canjear premio", "error");
  }
}

function exportarCSV() {
  if (!Array.isArray(clientes) || clientes.length === 0) {
    confirmModal("No hay datos para exportar", {
      okText: "Aceptar",
      showCancel: false,
      title: "Exportar CSV",
    });
    return;
  }
  const headers = [
    "Código",
    "Cédula",
    "Nombres",
    "Apellidos",
    "Dirección",
    "Teléfono",
    "Premio",
    "Fecha",
    "Canjeado",
  ];
  const rows = clientes.map((c) => [
    safe(c.codigo_premio),
    safe(c.cedula),
    safe(c.nombres),
    safe(c.apellidos),
    safe(c.direccion),
    safe(c.telefono),
    safe(c.premio),
    formatDate(c.fecha_registro),
    c.canjeado ? "Sí" : "No",
  ]);
  let csv = headers.join(",") + "\n";
  rows.forEach((row) => {
    csv +=
      row
        .map((field) => '"' + String(field).replace(/"/g, '""') + '"')
        .join(",") + "\n";
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download =
    "premios_DH2OCOL_" + new Date().toISOString().split("T")[0] + ".csv";
  link.click();
  showToast("CSV exportado", "success");
}

async function resetLeaderboard() {
  const ok = await confirmModal("¿Estás seguro de que deseas reiniciar los mejores puntajes? Esta acción borrará la tabla de posiciones local y no se puede deshacer.", {
    okText: "Sí, reiniciar",
    cancelText: "Cancelar",
    title: "Resetear Puntajes"
  });
  
  if (!ok) return;

  try {
    localStorage.removeItem("dh2o-leaderboard-trivia");
    localStorage.removeItem("dh2o-leaderboard-memory");
    showToast("Los puntajes han sido reiniciados", "success");
  } catch (error) {
    console.error("Error al resetear puntajes:", error);
    showToast("Error al reiniciar puntajes", "error");
  }
}

async function cerrarSesion() {
  const ok = await confirmModal("¿Estás seguro de cerrar sesión?", {
    okText: "Cerrar sesión",
    cancelText: "Cancelar",
  });
  if (!ok) return;
  try {
    const response = await fetch("/api/logout", { method: "POST" });
    if (response.ok) {
      window.location.href = "/";
    } else {
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    window.location.href = "/";
  }
}

// Utilidades
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value ?? "");
}
function td(text) {
  const c = document.createElement("td");
  c.textContent = String(text ?? "");
  return c;
}
function tdWithClass(text, cls) {
  const c = td(text);
  c.className = cls;
  return c;
}
function safe(v) {
  return v == null ? "" : v;
}
function formatDate(d) {
  try {
    return d ? new Date(d).toLocaleString("es-CO") : "";
  } catch {
    return "";
  }
}

function confirmModal(message, opts) {
  return new Promise((resolve) => {
    const o = opts || {};
    const okText = o.okText || "Confirmar";
    const cancelText = o.cancelText || "Cancelar";
    const showCancel = o.showCancel !== false;
    const title = o.title || "Confirmación";
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    const modal = document.createElement("div");
    modal.className = "modal";
    const content = document.createElement("div");
    content.className = "modal-content";
    const header = document.createElement("div");
    header.className = "modal-header";
    const h2 = document.createElement("h2");
    h2.textContent = title;
    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.textContent = "×";
    const p = document.createElement("p");
    p.textContent = String(message || "");
    const actions = document.createElement("div");
    actions.className = "modal-actions";
    const btnOk = document.createElement("button");
    btnOk.className = "btn btn-success";
    btnOk.textContent = okText;
    const btnCancel = showCancel ? document.createElement("button") : null;
    if (showCancel && btnCancel) {
      btnCancel.className = "btn btn-danger";
      btnCancel.textContent = cancelText;
    }
    function cleanup(v) {
      document.removeEventListener("keydown", onKey);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      resolve(v);
    }
    function onKey(e) {
      if (e.key === "Escape") cleanup(false);
      if (e.key === "Enter") cleanup(true);
    }
    btnOk.addEventListener("click", () => cleanup(true));
    if (showCancel && btnCancel)
      btnCancel.addEventListener("click", () => cleanup(false));
    closeBtn.addEventListener("click", () => cleanup(false));
    document.addEventListener("keydown", onKey);
    if (showCancel && btnCancel) actions.appendChild(btnCancel);
    actions.appendChild(btnOk);
    header.appendChild(h2);
    header.appendChild(closeBtn);
    content.appendChild(header);
    content.appendChild(p);
    content.appendChild(actions);
    modal.appendChild(content);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    btnOk.focus();
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function exportarExcel() {
  if (!Array.isArray(clientes) || clientes.length === 0) {
    confirmModal("No hay datos para exportar", {
      okText: "Aceptar",
      showCancel: false,
      title: "Exportar Excel",
    });
    return;
  }

  // Preparar datos para SheetJS
  const data = clientes.map((c) => ({
    "Código": safe(c.codigo_premio),
    "Cédula": safe(c.cedula),
    "Nombres": safe(c.nombres),
    "Apellidos": safe(c.apellidos),
    "Dirección": safe(c.direccion),
    "Teléfono": safe(c.telefono),
    "Premio": safe(c.premio),
    "Fecha": formatDate(c.fecha_registro),
    "Estado": c.canjeado ? "Canjeado" : "Pendiente"
  }));

  // Crear libro y hoja
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Clientes");

  // Ajustar ancho de columnas (opcional pero recomendado)
  const colWidths = [
    { wch: 20 }, // Código
    { wch: 15 }, // Cédula
    { wch: 25 }, // Nombres
    { wch: 25 }, // Apellidos
    { wch: 30 }, // Dirección
    { wch: 15 }, // Teléfono
    { wch: 20 }, // Premio
    { wch: 20 }, // Fecha
    { wch: 15 }  // Estado
  ];
  ws['!cols'] = colWidths;

  // Generar nombre de archivo
  const fecha = new Date().toISOString().split("T")[0];
  const filename = `premios_DH2OCOL_${fecha}.xlsx`;

  // Descargar
  XLSX.writeFile(wb, filename);
  showToast("Excel exportado correctamente", "success");
}

function showToast(message, type) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const t = document.createElement("div");
  t.className = "toast " + (type ? "toast-" + type : "toast-info");
  t.textContent = String(message || "");
  container.appendChild(t);
  requestAnimationFrame(() => {
    t.classList.add("visible");
  });
  setTimeout(() => {
    t.classList.remove("visible");
    setTimeout(() => {
      if (t.parentNode) t.parentNode.removeChild(t);
    }, 250);
  }, 3500);
}

/**
 * Google Apps Script (Code.gs) template for Marin & Salgado Construcciones S.A.S.
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.google.com) with the company Google account.
 * 2. Create a new Spreadsheet titled: "CRM_Marin_y_Salgado_Leads_PQRS"
 * 3. Go to Extensions > Apps Script (Extensiones > Apps Script).
 * 4. Erase any code in Code.gs and paste the code below.
 * 5. Click "Deploy" > "New deployment" (Implementar > Nueva implementación).
 * 6. Select type: "Web app" (Aplicación web).
 * 7. Execute as: "Me" (Yo: tu cuenta).
 * 8. Who has access: "Anyone" (Cualquier usuario / Anyone).
 * 9. Copy the Web App URL generated and paste it in the CRM configuration below.
 */

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Google Apps Script (Code.gs) - Marín & Salgado Construcciones S.A.S.
 * 
 * Versión 2.0: Compatibilidad total con nombres en español y escritura directa forzada.
 * Soporta todos los canales de captación:
 * 1. Formulario Web de Contacto / Asesoría
 * 2. Calculadora Financiera VIS (Simulación de cuota y subsidios)
 * 3. Asistente Virtual Inteligente (Chatbot Mariana)
 * 4. Canal Oficial de Atención al Ciudadano (PQRS con Radicado Oficial)
 * 5. Gestión Comercial y CRM Directo (actualización de estados y notas)
 */

function doPost(e) {
  // 1. Bloqueo de concurrencia para evitar colisiones entre canales
  var lock = LockService.getScriptLock();
  var hasLock = false;
  try {
    hasLock = lock.tryLock(20000);
  } catch (errLock) {
    // Si no se pudo adquirir bloqueo inmediato, continúa
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = {};

    // 2. Extracción flexible de datos (JSON o Form URL-Encoded)
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 3. Detección de acción / pestaña (PQRS o Lead)
    var action = (data.action || data.accion || (data.radicado || data.radicadoCode || data.numeroRadicado || data.tipoPqrs ? 'pqrs' : 'lead')).toString().toLowerCase().trim();
    var now = new Date();
    var fechaHoraColombia = Utilities.formatDate(now, 'America/Bogota', 'yyyy-MM-dd HH:mm:ss');

    if (action === 'pqrs') {
      // ============================================================
      // CANAL: ATENCIÓN AL CIUDADANO (PQRS)
      // ============================================================
      var sheetPqrs = ss.getSheetByName('PQRS_Ciudadano');
      if (!sheetPqrs) {
        sheetPqrs = ss.insertSheet('PQRS_Ciudadano');
        sheetPqrs.appendRow([
          'Fecha / Hora',
          'N° Radicado',
          'Tipo de PQRS',
          'Nombre del Ciudadano',
          'Teléfono / Celular',
          'Correo Electrónico',
          'Proyecto Relacionado',
          'Descripción del Requerimiento',
          'Canal de Radicación',
          'Estado',
          'Días Término Legal',
          'Respuesta Oficial',
          'Respondido Por',
          'Fecha Respuesta'
        ]);
        sheetPqrs.getRange(1, 1, 1, 14)
          .setBackground('#303024')
          .setFontColor('#FFFFFF')
          .setFontWeight('bold')
          .setHorizontalAlignment('center');
        sheetPqrs.setFrozenRows(1);
        SpreadsheetApp.flush();
      }

      // Mapeo exhaustivo en Español con respaldo en Inglés
      var radicado = (data.radicado || data.radicadoCode || data.numeroRadicado || data.codigoRadicado || ('PQRS-' + now.getFullYear() + '-' + Math.floor(100 + Math.random() * 900))).toString().trim();
      var tipo = (data.tipo || data.tipoPqrs || data.type || data.categoria || 'Petición').toString().trim();
      var nombre = (data.nombre || data.nombreCompleto || data.name || data.fullName || data.ciudadano || '').toString().trim();
      var telefono = (data.telefono || data.celular || data.phone || data.whatsapp || data.movil || '').toString().trim();
      var email = (data.email || data.correo || data.correoElectronico || '').toString().trim();
      var proyecto = (data.proyecto || data.proyectoRelacionado || data.project || 'Administración General').toString().trim();
      var descripcion = (data.mensaje || data.descripcion || data.descripcionRequerimiento || data.message || data.solicitud || '').toString().trim();
      var canal = (data.origen || data.canal || data.canalRadicacion || data.source || data.medio || 'Portal Web PQRS').toString().trim();
      var estado = (data.estado || data.status || 'Pendiente').toString().trim();
      var diasTermino = parseInt(data.diasTerminoLegal || data.terminoLegal || data.dias || data.legalDeadlineDays || 15, 10);
      var respuestaOficial = (data.respuestaOficial || data.respuesta || data.officialResponse || '').toString().trim();
      var respondidoPor = (data.respondidoPor || data.funcionario || data.respondedBy || data.asesor || '').toString().trim();
      var fechaRespuesta = (data.fechaRespuesta || data.respondedAt || (respuestaOficial ? fechaHoraColombia : '')).toString().trim();

      var rowsPqrs = sheetPqrs.getDataRange().getValues();
      var foundRowIndex = -1;

      // Buscar si el radicado ya existe para actualizarlo en sitio
      for (var p = 1; p < rowsPqrs.length; p++) {
        if (rowsPqrs[p][1] && rowsPqrs[p][1].toString().trim() === radicado) {
          foundRowIndex = p + 1; // Fila 1-indexed
          break;
        }
      }

      if (foundRowIndex > 0) {
        // Actualización directa en sitio
        if (estado) sheetPqrs.getRange(foundRowIndex, 10).setValue(estado);
        if (respuestaOficial) sheetPqrs.getRange(foundRowIndex, 12).setValue(respuestaOficial);
        if (respondidoPor) sheetPqrs.getRange(foundRowIndex, 13).setValue(respondidoPor);
        if (fechaRespuesta) sheetPqrs.getRange(foundRowIndex, 14).setValue(fechaRespuesta);
      } else {
        // Escritura directa de nueva fila
        sheetPqrs.appendRow([
          fechaHoraColombia,
          radicado,
          tipo,
          nombre,
          telefono,
          email,
          proyecto,
          descripcion,
          canal,
          estado,
          diasTermino,
          respuestaOficial,
          respondidoPor,
          fechaRespuesta
        ]);
      }

      // FORZAR ESCRITURA DIRECTA INMEDIATA A GOOGLE SHEETS
      SpreadsheetApp.flush();

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        accion: 'pqrs',
        radicado: radicado,
        modo: foundRowIndex > 0 ? 'actualizado' : 'creado',
        escrituraDirecta: true,
        fecha: fechaHoraColombia
      })).setMimeType(ContentService.MimeType.JSON);

    } else {
      // ============================================================
      // CANAL: GESTIÓN DE PROSPECTOS (LEADS & COMERCIAL)
      // ============================================================
      var sheetLeads = ss.getSheetByName('Prospectos_Leads');
      if (!sheetLeads) {
        sheetLeads = ss.insertSheet('Prospectos_Leads');
        sheetLeads.appendRow([
          'Fecha / Hora',
          'ID Prospecto',
          'Nombre Completo',
          'Teléfono / WhatsApp',
          'Correo Electrónico',
          'Proyecto de Interés',
          'Estado Sisbén / Subsidio',
          'Canal de Origen',
          'Estado CRM',
          'Mensaje o Consulta',
          'Precio Vivienda COP',
          'Subsidio Total COP',
          'Cuota Mensual Est.',
          'Plazo (Años)',
          'Monto Crédito COP',
          'Notas de Seguimiento'
        ]);
        sheetLeads.getRange(1, 1, 1, 16)
          .setBackground('#054316')
          .setFontColor('#FFFFFF')
          .setFontWeight('bold')
          .setHorizontalAlignment('center');
        sheetLeads.setFrozenRows(1);
        SpreadsheetApp.flush();
      }

      // Mapeo exhaustivo en Español con respaldo en Inglés
      var leadId = (data.id || data.idProspecto || data.codigo || ('lead-' + now.getTime())).toString().trim();
      var leadNombre = (data.nombre || data.nombreCompleto || data.name || data.fullName || data.cliente || '').toString().trim();
      var leadTelefono = (data.telefono || data.celular || data.phone || data.whatsapp || data.movil || '').toString().trim();
      var leadEmail = (data.email || data.correo || data.correoElectronico || '').toString().trim();
      var leadProyecto = (data.proyecto || data.proyectoInteres || data.project || data.inmueble || 'Consulta General').toString().trim();
      var leadSubsidio = (data.subsidio || data.estadoSisben || data.sisben || data.subsidyStatus || data.cajaCompensacion || 'No especificado').toString().trim();
      var leadOrigen = (data.origen || data.canal || data.canalOrigen || data.source || data.medio || 'Formulario Web').toString().trim();
      var leadEstado = (data.estado || data.estadoCrm || data.status || 'Nuevo').toString().trim();
      var leadMensaje = (data.mensaje || data.descripcion || data.message || data.consulta || data.observaciones || '').toString().trim();
      var leadPrecio = (data.precioVivienda || data.totalHousePrice || data.precio || '').toString().trim();
      var leadSubsidioTotal = (data.subsidioTotal || data.totalSubsidies || data.subsidios || '').toString().trim();
      var leadCuota = (data.cuotaMensual || data.cuotaMensualEst || data.monthlyPayment || data.cuota || '').toString().trim();
      var leadPlazo = (data.plazoAnos || data.plazo || data.termYears || '').toString().trim();
      var leadCredito = (data.creditoMonto || data.montoCredito || data.loanAmount || data.credito || '').toString().trim();
      var leadNotas = (data.notas || data.notes || data.seguimiento || '').toString().trim();

      var rowsLeads = sheetLeads.getDataRange().getValues();
      var foundLeadRow = -1;

      // Buscar si el ID ya existe para actualizar su estado y notas
      for (var l = 1; l < rowsLeads.length; l++) {
        if (rowsLeads[l][1] && rowsLeads[l][1].toString().trim() === leadId) {
          foundLeadRow = l + 1; // Fila 1-indexed
          break;
        }
      }

      if (foundLeadRow > 0) {
        // Actualizar en sitio (por ejemplo, cambio de estado en CRM o nueva nota)
        if (leadEstado) sheetLeads.getRange(foundLeadRow, 9).setValue(leadEstado);
        if (leadNotas) sheetLeads.getRange(foundLeadRow, 16).setValue(leadNotas);
        if (leadMensaje) sheetLeads.getRange(foundLeadRow, 10).setValue(leadMensaje);
      } else {
        // Escritura directa de nueva fila de prospecto
        sheetLeads.appendRow([
          fechaHoraColombia,
          leadId,
          leadNombre,
          leadTelefono,
          leadEmail,
          leadProyecto,
          leadSubsidio,
          leadOrigen,
          leadEstado,
          leadMensaje,
          leadPrecio,
          leadSubsidioTotal,
          leadCuota,
          leadPlazo,
          leadCredito,
          leadNotas
        ]);
      }

      // FORZAR ESCRITURA DIRECTA INMEDIATA A GOOGLE SHEETS
      SpreadsheetApp.flush();

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        accion: 'lead',
        id: leadId,
        nombre: leadNombre,
        modo: foundLeadRow > 0 ? 'actualizado' : 'creado',
        escrituraDirecta: true,
        fecha: fechaHoraColombia
      })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      mensaje: error.toString(),
      escrituraDirecta: false
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    if (hasLock) {
      try {
        lock.releaseLock();
      } catch (eRelease) {}
    }
  }
}

// ============================================================
// NUEVO v2.1: CLAVE DE SEGURIDAD PARA EXPORTAR DATOS AL PANEL CRM
// (Evita que extraños puedan leer los prospectos de la hoja)
// ============================================================
var CLAVE_EXPORTACION = 'MYS-CRM-EXPORT-2025';

// ============================================================
// NUEVO v2.1: EXPORTAR TODOS LOS DATOS (Lectura para el Panel CRM)
// El panel llama a esta función con "Importar desde Google Sheet"
// ============================================================
function exportarDatos(params) {
  try {
    if (String(params.key || params.clave || '') !== CLAVE_EXPORTACION) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        mensaje: 'Clave de exportación inválida. Copia el código Apps Script actualizado desde el CRM.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var resultado = { status: 'success', leads: [], pqrs: [] };

    // Exportar pestaña Prospectos_Leads
    var hojaLeads = ss.getSheetByName('Prospectos_Leads');
    if (hojaLeads && hojaLeads.getLastRow() > 1) {
      var valoresLeads = hojaLeads.getDataRange().getValues();
      var encabezadosLeads = valoresLeads[0];
      for (var i = 1; i < valoresLeads.length; i++) {
        if (!valoresLeads[i][1]) continue; // Filas sin ID Prospecto
        var filaLead = {};
        for (var c = 0; c < encabezadosLeads.length; c++) {
          filaLead[String(encabezadosLeads[c])] = valoresLeads[i][c];
        }
        resultado.leads.push(filaLead);
      }
    }

    // Exportar pestaña PQRS_Ciudadano
    var hojaPqrs = ss.getSheetByName('PQRS_Ciudadano');
    if (hojaPqrs && hojaPqrs.getLastRow() > 1) {
      var valoresPqrs = hojaPqrs.getDataRange().getValues();
      var encabezadosPqrs = valoresPqrs[0];
      for (var j = 1; j < valoresPqrs.length; j++) {
        if (!valoresPqrs[j][1]) continue; // Filas sin N° Radicado
        var filaPqrs = {};
        for (var k = 0; k < encabezadosPqrs.length; k++) {
          filaPqrs[String(encabezadosPqrs[k])] = valoresPqrs[j][k];
        }
        resultado.pqrs.push(filaPqrs);
      }
    }

    return ContentService.createTextOutput(JSON.stringify(resultado)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      mensaje: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var params = (e && e.parameter) || {};

  // NUEVO v2.1: Exportar datos para el Panel CRM (se verifica ANTES de todo)
  if (params.action === 'export' || params.accion === 'exportar') {
    return exportarDatos(params);
  }

  // Si se envían parámetros por GET (ej. pruebas rápidas o webhooks simples)
  if (e && e.parameter && (e.parameter.nombre || e.parameter.name || e.parameter.radicado)) {
    return doPost(e);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    servicio: 'CRM Marín & Salgado Construcciones S.A.S.',
    version: '2.1.0-direct-write-import',
    escrituraDirecta: 'activa (SpreadsheetApp.flush habilitado)',
    exportacionPanel: 'activa (action=export con clave de seguridad)',
    canalesSoportados: [
      'Formulario Web de Contacto',
      'Calculadora Financiera VIS',
      'Chatbot Asistente Virtual Mariana',
      'Atención al Ciudadano (PQRS)',
      'Gestión Comercial CRM'
    ]
  })).setMimeType(ContentService.MimeType.JSON);
}
`;

export const GOOGLE_SHEETS_SETUP_STEPS = [
  {
    step: 1,
    title: 'Crear la Hoja de Cálculo en Google Drive',
    desc: 'Inicia sesión con la cuenta de Google de la constructora (por ejemplo marinysalgadoconstrucciones@gmail.com) y crea una hoja de cálculo nueva llamada "CRM Marin & Salgado - Base de Datos".',
  },
  {
    step: 2,
    title: 'Abrir el Editor de Apps Script',
    desc: 'Dentro de tu hoja de Google Sheets, ve al menú superior: Extensiones > Apps Script.',
  },
  {
    step: 3,
    title: 'Copiar y Pegar el Código',
    desc: 'Borra cualquier código existente en el archivo Code.gs y pega el script oficial proporcionado en el botón "Copiar Script". Haz clic en el icono de Guardar.',
  },
  {
    step: 4,
    title: 'Desplegar como Aplicación Web',
    desc: 'Haz clic en el botón azul "Implementar" (Deploy) > "Nueva implementación" > Selecciona tipo "Aplicación web". En "Quién tiene acceso" selecciona "Cualquier usuario" (Anyone) para que la página web pueda registrar prospectos sin requerir login público.',
  },
  {
    step: 5,
    title: 'Conectar la URL con el CRM',
    desc: 'Copia la URL que termina en /exec y pégala en el campo de configuración de este CRM. A partir de ese momento, cada formulario web y PQRS se guardará en tu Excel en la nube en tiempo real.',
  },
  {
    step: 6,
    title: 'Seguridad y Privacidad',
    desc: 'Solo el personal de Marín & Salgado con permiso en esa cuenta de Google o a quienes compartas la hoja tendrán acceso a visualizar o editar los datos.',
  },
];

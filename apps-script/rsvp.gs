// ============================================================
// RSVP - Google Apps Script
// Publicar como Web App: Execute as "Me", Access "Anyone"
// ============================================================

var SHEET_NAME = "Convidados";
var CONFIG_SHEET_NAME = "Config";
var HEADERS = [
  "ID", "Nome", "Convidados", "ConvidadosConfirmados",
  "Lado", "Telefone", "Confirmado", "ConfirmadoEm", "Comparecera", "UltimaAtualizacao"
];
// Comparecera: "" = pendente | "sim" = vai | "nao" = não vai

var DEFAULT_TEMPLATE =
  "Oi, {nome}! 💛\n\nCriamos um link exclusivo para você confirmar sua presença no nosso casamento:\n\n{link}\n\nEsperamos muito por vocês! ✨\n\nMayara & Rychell";

// Índices das colunas (0-based)
var COL = {
  ID: 0, NOME: 1, CONVIDADOS: 2, CONVIDADOS_CONFIRMADOS: 3,
  LADO: 4, TELEFONE: 5, CONFIRMADO: 6, CONFIRMADO_EM: 7,
  COMPARECERA: 8, ULTIMA_ATUALIZACAO: 9
};

// ------------------------------------------------------------
// Ponto de entrada GET
// ------------------------------------------------------------
function doGet(e) {
  var action = e.parameter.action;
  try {
    if (action === "getGuest")    return jsonResponse(getGuest(e.parameter.id));
    if (action === "listAll")     return jsonResponse(listAll());
    if (action === "getTemplate") return jsonResponse({ template: getTemplate() });
    return jsonResponse({ error: "action inválida" }, 400);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
}

// ------------------------------------------------------------
// Ponto de entrada POST
// ------------------------------------------------------------
function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var action = body.action;
  try {
    if (action === "confirmar")    return jsonResponse(confirmar(body.id, body.comparecera));
    if (action === "editar")       return jsonResponse(editar(body.id, body.convidadosConfirmados));
    if (action === "addConvidado") return jsonResponse(addConvidado(body));
    if (action === "importCSV")    return jsonResponse(importCSV(body.rows));
    if (action === "saveTemplate") return jsonResponse(saveTemplate(body.template));
    return jsonResponse({ error: "action inválida" }, 400);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
}

// ------------------------------------------------------------
// GET: buscar convidado por ID
// ------------------------------------------------------------
function getGuest(id) {
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][COL.ID]) === String(id)) {
      return rowToGuest(data[i]);
    }
  }
  return null;
}

// ------------------------------------------------------------
// GET: listar todos os convidados
// ------------------------------------------------------------
function listAll() {
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  var guests = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][COL.ID]) guests.push(rowToGuest(data[i]));
  }
  return guests;
}

// ------------------------------------------------------------
// POST: registrar resposta do convidado
//   comparecera=true  → vai ao casamento
//   comparecera=false → não vai ao casamento
// Pode ser chamado múltiplas vezes (para mudar de ideia)
// ------------------------------------------------------------
function confirmar(id, comparecera) {
  if (typeof comparecera !== "boolean") {
    throw new Error("comparecera deve ser boolean");
  }
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][COL.ID]) === String(id)) {
      var row = i + 1;
      var now = new Date().toISOString();
      var jaRespondeu = data[i][COL.CONFIRMADO] === true || data[i][COL.CONFIRMADO] === "TRUE";

      // Se vai comparecer e ainda não tinha respondido: inicializa ConvidadosConfirmados
      if (comparecera && !jaRespondeu) {
        sheet.getRange(row, COL.CONVIDADOS_CONFIRMADOS + 1).setValue(data[i][COL.CONVIDADOS]);
      }
      // Se mudou para não vai: zera ConvidadosConfirmados
      if (!comparecera) {
        sheet.getRange(row, COL.CONVIDADOS_CONFIRMADOS + 1).setValue("");
      }

      sheet.getRange(row, COL.CONFIRMADO + 1).setValue(true);
      sheet.getRange(row, COL.CONFIRMADO_EM + 1).setValue(now);
      sheet.getRange(row, COL.COMPARECERA + 1).setValue(comparecera ? "sim" : "nao");
      sheet.getRange(row, COL.ULTIMA_ATUALIZACAO + 1).setValue(now);

      return rowToGuest(sheet.getRange(row, 1, 1, HEADERS.length).getValues()[0]);
    }
  }
  throw new Error("Convidado não encontrado: " + id);
}

// ------------------------------------------------------------
// POST: editar número de convidados confirmados (pelo convidado)
// Só permitido quando comparecera=true
// Nunca altera a coluna Convidados (original dos noivos)
// ------------------------------------------------------------
function editar(id, convidadosConfirmados) {
  var n = parseInt(convidadosConfirmados, 10);
  if (isNaN(n) || n < 1) throw new Error("convidadosConfirmados inválido");

  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][COL.ID]) === String(id)) {
      var row = i + 1;
      var now = new Date().toISOString();
      sheet.getRange(row, COL.CONVIDADOS_CONFIRMADOS + 1).setValue(n);
      sheet.getRange(row, COL.ULTIMA_ATUALIZACAO + 1).setValue(now);
      return rowToGuest(sheet.getRange(row, 1, 1, HEADERS.length).getValues()[0]);
    }
  }
  throw new Error("Convidado não encontrado: " + id);
}

// ------------------------------------------------------------
// POST: adicionar convidado individual
// ID deve ser gerado pelo Next.js (nanoid) e enviado no body
// ------------------------------------------------------------
function addConvidado(guest) {
  if (!guest.id || !guest.nome || !guest.convidados || !guest.lado) {
    throw new Error("Campos obrigatórios: id, nome, convidados, lado");
  }
  var sheet = getSheet();
  sheet.appendRow([
    guest.id,
    guest.nome,
    parseInt(guest.convidados, 10),
    "",      // ConvidadosConfirmados
    guest.lado,
    guest.telefone || "",
    false,   // Confirmado
    "",      // ConfirmadoEm
    "",      // Comparecera
    new Date().toISOString()
  ]);
  return guest;
}

// ------------------------------------------------------------
// POST: importar múltiplos convidados via CSV
// ------------------------------------------------------------
function importCSV(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("rows deve ser um array não vazio");
  }
  var sheet = getSheet();
  var added = 0;
  var errors = [];
  var now = new Date().toISOString();

  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    try {
      if (!r.id || !r.nome || !r.convidados || !r.lado) {
        throw new Error("campos obrigatórios ausentes");
      }
      sheet.appendRow([
        r.id,
        r.nome,
        parseInt(r.convidados, 10),
        "",
        r.lado,
        r.telefone || "",
        false,
        "",
        "",
        now
      ]);
      added++;
    } catch (err) {
      errors.push({ row: i + 1, nome: r.nome || "", error: String(err) });
    }
  }
  return { added: added, errors: errors };
}

// ------------------------------------------------------------
// GET/POST: template WhatsApp
// ------------------------------------------------------------
function getTemplate() {
  var config = getConfigSheet();
  var data = config.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === "template") return data[i][1];
  }
  return DEFAULT_TEMPLATE;
}

function saveTemplate(template) {
  if (!template || typeof template !== "string") {
    throw new Error("template inválido");
  }
  var config = getConfigSheet();
  var data = config.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === "template") {
      config.getRange(i + 1, 2).setValue(template);
      return { ok: true };
    }
  }
  config.appendRow(["template", template]);
  return { ok: true };
}

// ------------------------------------------------------------
// Utilitários
// ------------------------------------------------------------
function rowToGuest(row) {
  var comp = row[COL.COMPARECERA];
  return {
    id:                    String(row[COL.ID]),
    nome:                  String(row[COL.NOME]),
    convidados:            Number(row[COL.CONVIDADOS]),
    convidadosConfirmados: row[COL.CONVIDADOS_CONFIRMADOS] !== "" ? Number(row[COL.CONVIDADOS_CONFIRMADOS]) : null,
    lado:                  String(row[COL.LADO]),
    telefone:              String(row[COL.TELEFONE]),
    confirmado:            row[COL.CONFIRMADO] === true || row[COL.CONFIRMADO] === "TRUE",
    confirmadoEm:          row[COL.CONFIRMADO_EM] ? String(row[COL.CONFIRMADO_EM]) : null,
    comparecera:           comp === "sim" ? true : comp === "nao" ? false : null,
    ultimaAtualizacao:     row[COL.ULTIMA_ATUALIZACAO] ? String(row[COL.ULTIMA_ATUALIZACAO]) : null
  };
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("Aba '" + SHEET_NAME + "' não encontrada. Execute setupSheet() primeiro.");
  return sheet;
}

function getConfigSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_SHEET_NAME);
  if (!sheet) throw new Error("Aba '" + CONFIG_SHEET_NAME + "' não encontrada. Execute setupSheet() primeiro.");
  return sheet;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ------------------------------------------------------------
// Configuração inicial — executar UMA vez no Apps Script editor
// ------------------------------------------------------------
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Aba Convidados
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.appendRow([
    "exemplo123", "Família Silva", 3, "", "noiva",
    "558599999999", false, "", "", new Date().toISOString()
  ]);

  // Aba Config
  var config = ss.getSheetByName(CONFIG_SHEET_NAME);
  if (!config) config = ss.insertSheet(CONFIG_SHEET_NAME);
  config.clearContents();
  config.getRange(1, 1, 1, 2).setValues([["Chave", "Valor"]]);
  config.getRange(1, 1, 1, 2).setFontWeight("bold");
  config.appendRow(["template", DEFAULT_TEMPLATE]);

  Logger.log("Setup concluído! Aba Convidados (10 colunas) e Config criadas.");
}

import * as XLSX from "xlsx";

const VALID_EXTENSIONS = [
  "txt",
  "csv",
  "tsv",
  "xlsx",
  "xls",
  "xlsm",
];

const NAME_HEADERS = new Set([
  "nombre",
  "nombres",
  "participante",
  "participantes",
  "nombre completo",
  "nombres y apellidos",
  "nombre y apellido",
  "full name",
]);

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function cleanParticipants(names) {
  const seen = new Set();
  const participants = [];
  let duplicatesRemoved = 0;

  names.forEach((value) => {
    const name = String(value ?? "")
      .replace(/^["']|["']$/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!name) return;

    const key = normalizeText(name);

    if (seen.has(key)) {
      duplicatesRemoved += 1;
      return;
    }

    seen.add(key);
    participants.push(name);
  });

  return {
    participants,
    duplicatesRemoved,
  };
}

function extractNamesFromRows(rows) {
  const firstRowIndex = rows.findIndex((row) =>
    row.some((cell) => String(cell ?? "").trim()),
  );

  if (firstRowIndex === -1) {
    return [];
  }

  const firstRow = rows[firstRowIndex];

  const headerColumn = firstRow.findIndex((cell) =>
    NAME_HEADERS.has(normalizeText(cell)),
  );

  const hasNameHeader = headerColumn !== -1;

  const nameColumn = hasNameHeader
    ? headerColumn
    : firstRow.findIndex((cell) => String(cell ?? "").trim());

  if (nameColumn === -1) {
    return [];
  }

  const startIndex = hasNameHeader
    ? firstRowIndex + 1
    : firstRowIndex;

  return rows
    .slice(startIndex)
    .map((row) => row[nameColumn])
    .filter((value) => String(value ?? "").trim());
}

export async function parseParticipantFile(file) {
  if (!file) {
    return {
      participants: [],
      duplicatesRemoved: 0,
      error: "No se seleccionó ningún archivo.",
    };
  }

  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  if (!extension || !VALID_EXTENSIONS.includes(extension)) {
    return {
      participants: [],
      duplicatesRemoved: 0,
      error:
        "Formato no compatible. Utiliza TXT, CSV, TSV, XLS o XLSX.",
    };
  }

  let names = [];

  if (extension === "txt") {
    const text = await file.text();

    names = text
      .split(/\r?\n/)
      .map((line) => line.trim());
  } else {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    if (!workbook.SheetNames.length) {
      return {
        participants: [],
        duplicatesRemoved: 0,
        error: "El archivo no contiene hojas válidas.",
      };
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      raw: false,
    });

    names = extractNamesFromRows(rows);
  }

  const result = cleanParticipants(names);

  if (!result.participants.length) {
    return {
      participants: [],
      duplicatesRemoved: 0,
      error: "No se encontraron participantes válidos.",
    };
  }

  return {
    ...result,
    error: null,
  };
}

export function mergeParticipants(existing, incoming) {
  const seen = new Set(
    existing.map((name) => normalizeText(name)),
  );

  const merged = [...existing];
  let added = 0;

  incoming.forEach((name) => {
    const key = normalizeText(name);

    if (!seen.has(key)) {
      seen.add(key);
      merged.push(name);
      added += 1;
    }
  });

  return {
    merged,
    added,
  };
}
export function parseParticipantFile(text, fileType = "txt") {
  if (!text || typeof text !== "string") {
    return { participants: [], duplicatesRemoved: 0, error: "El archivo está vacío o no es válido." };
  }

  const lines = fileType === "csv"
    ? text.split(/\r?\n/).map((line) => line.split(",")[0]?.trim() ?? "")
    : text.split(/\r?\n/).map((line) => line.trim());

  const cleaned = lines
    .map((name) => name.replace(/^["']|["']$/g, "").trim())
    .filter(Boolean);

  if (!cleaned.length) {
    return { participants: [], duplicatesRemoved: 0, error: "No se encontraron participantes válidos." };
  }

  const seen = new Set();
  const participants = cleaned.filter((name) => {
    const key = name.toLocaleLowerCase("es");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    participants,
    duplicatesRemoved: cleaned.length - participants.length,
    error: null,
  };
}

export function mergeParticipants(existing, incoming) {
  const seen = new Set(existing.map((name) => name.toLocaleLowerCase("es")));
  const merged = [...existing];
  let added = 0;

  incoming.forEach((name) => {
    const key = name.toLocaleLowerCase("es");
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(name);
      added += 1;
    }
  });

  return { merged, added };
}

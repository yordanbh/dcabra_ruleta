const KEYS = {
  PARTICIPANTS: "dcabra_participants",
  WINNERS: "dcabra_winners",
  WELCOME_SEEN: "dcabra_welcome_seen",
};

function readJson(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`No se pudo guardar ${key}:`, error);
  }
}

export const getParticipants = () => readJson(KEYS.PARTICIPANTS, []);
export const getWinners = () => readJson(KEYS.WINNERS, []);
export const saveParticipants = (value) => writeJson(KEYS.PARTICIPANTS, value);
export const saveWinners = (value) => writeJson(KEYS.WINNERS, value);
export const hasSeenWelcome = () => localStorage.getItem(KEYS.WELCOME_SEEN) === "1";
export const markWelcomeSeen = () => localStorage.setItem(KEYS.WELCOME_SEEN, "1");

export function resetRaffle() {
  localStorage.removeItem(KEYS.PARTICIPANTS);
  localStorage.removeItem(KEYS.WINNERS);
}

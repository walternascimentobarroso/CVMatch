const STORAGE_KEY = "cvmatch.cv";

export type StoredCv = {
  text: string;
  fileName: string;
  uploadedAt: string;
};

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function subscribeToStoredCv(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function readSerializedCv() {
  return localStorage.getItem(STORAGE_KEY);
}

export function saveCv(cv: StoredCv) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
  notifyListeners();
}

export function removeCv() {
  localStorage.removeItem(STORAGE_KEY);
  notifyListeners();
}

export interface CompareState {
  idA: string | null;
  idB: string | null;
}

const STORAGE_KEY = 'conic_city_compare_selection';

export function getCompareState(): CompareState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { idA: null, idB: null };
    const parsed = JSON.parse(raw);
    return {
      idA: parsed.idA || null,
      idB: parsed.idB || null,
    };
  } catch (e) {
    return { idA: null, idB: null };
  }
}

export function saveCompareState(state: CompareState): void {
  try {
    const json = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, json);
    sessionStorage.setItem(STORAGE_KEY, json);
    window.dispatchEvent(new CustomEvent('conic_compare_change', { detail: state }));
  } catch (e) {
    // ignore
  }
}

export function addToCompare(id: string): { isComplete: boolean; state: CompareState } {
  const current = getCompareState();

  // If already structure A, do nothing or keep as A
  if (current.idA === id) {
    return { isComplete: false, state: current };
  }

  // If Structure A is empty, store as Structure A
  if (!current.idA) {
    const next = { idA: id, idB: null };
    saveCompareState(next);
    return { isComplete: false, state: next };
  }

  // If Structure A exists and Structure B is empty (or different), store as Structure B and mark as complete!
  const next = { idA: current.idA, idB: id };
  saveCompareState(next);
  return { isComplete: true, state: next };
}

export function removeFromCompare(id: string): CompareState {
  const current = getCompareState();
  let next: CompareState;

  if (current.idA === id) {
    next = { idA: current.idB, idB: null };
  } else if (current.idB === id) {
    next = { idA: current.idA, idB: null };
  } else {
    next = current;
  }

  saveCompareState(next);
  return next;
}

export function clearCompare(): CompareState {
  const next = { idA: null, idB: null };
  saveCompareState(next);
  return next;
}

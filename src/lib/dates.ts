export const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const todayISO = () => isoDate(new Date());

export function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return isoDate(d);
}

/** Numéro du jour depuis 1970 : sert à faire tourner les missions d'un jour à l'autre. */
export const dayNumber = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
};

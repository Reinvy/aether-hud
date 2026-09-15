/**
 * swapOrder — the two row updates that move a list entry one slot.
 *
 * Reordering deliberately avoids a drag-and-drop dependency: two adjacent rows
 * exchange their `order` values and the caller PUTs both. Positions are derived
 * from the sorted index (not from the stored values) so the move still lands
 * correctly when several rows share an `order`, and an entry already at either
 * end yields no updates at all.
 */
export function swapOrder<T extends { id: string; order: number }>(
  items: T[],
  id: string,
  direction: -1 | 1
): { id: string; order: number }[] {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((item) => item.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= sorted.length) return [];

  const base = sorted[0]?.order ?? 0;
  const moving = sorted[index];
  const displaced = sorted[target];

  return [
    { id: moving.id, order: base + target },
    { id: displaced.id, order: base + index },
  ];
}

/**
 * planReorder — the row updates that move a list entry one slot.
 *
 * Reordering deliberately avoids a drag-and-drop dependency: the caller PUTs
 * the returned rows and the server persists them. `order` values in the
 * database are not guaranteed to be dense (deleting row 3 of 10 leaves a gap,
 * and legacy rows all share 0), so the list is first normalised to `0..n-1` in
 * its current display order and only the rows whose stored value actually
 * changes are returned. That keeps a move to two writes, and makes a no-op
 * (already first, already last, unknown id) return `null` instead of a write.
 */
export function planReorder<T extends { id: string; order: number }>(
  items: T[],
  id: string,
  direction: "up" | "down"
): { id: string; order: number }[] | null {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= sorted.length) return null;

  const updates: { id: string; order: number }[] = [];
  for (let position = 0; position < sorted.length; position++) {
    const item = sorted[position];
    const nextOrder = position === index ? target : position === target ? index : position;
    if (item.order !== nextOrder) updates.push({ id: item.id, order: nextOrder });
  }
  return updates;
}

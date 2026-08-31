let counter = 0;
export function uid(prefix = 'id'): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter}`;
}

export function formatTime(date: Date, format: '12h' | '24h'): string {
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  if (format === '12h') {
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m}:${s} ${ampm}`;
  }
  return `${h.toString().padStart(2, '0')}:${m}:${s}`;
}

export function computeCalendarString(offset: number, format: string): string {
  const base = new Date();
  const target = new Date(base.getTime() + offset * 86400000);
  const day = target.getDate().toString().padStart(2, '0');
  const month = (target.getMonth() + 1).toString().padStart(2, '0');
  const year = target.getFullYear();
  const weekday = target.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = target.toLocaleDateString('en-US', { month: 'long' });

  return format
    .replace(/YYYY/g, String(year))
    .replace(/YY/g, String(year).slice(-2))
    .replace(/MMDD/g, `${month}${day}`)
    .replace(/MMMM/g, monthName)
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/WD/g, weekday)
    .replace(/OFFSET/g, offset >= 0 ? `+${offset}` : String(offset));
}

/**
 * Recursively walk text nodes inside a document and replace occurrences
 * of `find` with `replace`, without touching HTML tags or attributes.
 */
export function mutateTextNodes(
  doc: Document,
  root: Element,
  find: string,
  replace: string,
): number {
  if (!find) return 0;
  let count = 0;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style') return NodeFilter.FILTER_REJECT;
      return node.nodeValue && node.nodeValue.includes(find)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  const targets: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    targets.push(current as Text);
    current = walker.nextNode();
  }

  for (const textNode of targets) {
    if (textNode.nodeValue && textNode.nodeValue.includes(find)) {
      textNode.nodeValue = textNode.nodeValue.split(find).join(replace);
      count += 1;
    }
  }
  return count;
}

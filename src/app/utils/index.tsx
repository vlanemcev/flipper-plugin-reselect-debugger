export const truncateText = (str: string, maxChars = 50) =>
  str.length > maxChars ? str.slice(0, maxChars) : str;

export const getGraphLabelText = (id: string, recomputations: number | null) =>
  truncateText(id) + (recomputations === null ? ' (NM)' : ` (${recomputations})`);

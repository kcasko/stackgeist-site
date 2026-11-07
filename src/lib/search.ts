// Editorial aliases are deliberately small: match reader vocabulary, not substrings
// such as "ad" inside "adapter".
const ALIASES: Record<string, string> = { ad: 'active directory' };

export function matchesSearch(text: string, query: string): boolean {
  const haystack = text.toLowerCase();
  return query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    .every((term) => haystack.includes(ALIASES[term] ?? term));
}

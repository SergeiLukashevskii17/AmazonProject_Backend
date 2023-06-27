export function generateSlug(input: string): string {
    const transliterationMap: { [key: string]: string } = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y',
      к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
      х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
      ' ': '-', '_': '-', '.': '', ',': '', '!': '', '?': '', ':': '', ';': '', '"': '', "'": '',
      '@': '', '#': '', '$': '', '%': '', '^': '', '&': '', '*': '', '(': '', ')': '', '[': '',
      ']': '', '{': '', '}': '', '<': '', '>': '', '/': '', '\\': '', '|': ''
    };
  
    const slug = input
      .toLowerCase()
      .split('')
      .map(char => transliterationMap[char] || char)
      .join('');
  
    return slug.replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
  }
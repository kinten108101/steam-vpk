export function generateAddonName(name: string): string {
  // TODO(kinten): Please use regex
  let a = name.replace('\n', '').replace('\r', '');
  return a;
}

export function generateName(name: string): string {
  let a = name
    /* */
    .toLowerCase()
    /* prefer dash over underscore and spaces */
    //.replace(/[\x20\x5F]/g, '-')
    /* force English alphabet and numbers */
    .replace(/[^\x30-\x39\x41-\x5A\x61-\x7A]/g, '-')
  a = removeDups(a, '-');
  a = removeLeading(a, '-');
  a = removeTrailing(a, '-');
  return a;
}

export function generateAuthor(name: string): string {
  let a = name
    .replace(' ', '_')
    .replace('/', '_')
    .replace('\0', '_')
  a = removeDups(a, '-');
  a = removeLeading(a, '-');
  a = removeTrailing(a, '-');
  return a;
}

function removeLeading(a: string, char: string) {
  let newstr: string = '';
  let i: number;
  for (i = 0; i < a.length; i++) {
    if (a.charCodeAt(i) !== char.charCodeAt(0)) {
      break;
    }
  }
  if (i === 0) return a;
  for (i; i < a.length; i++) {
    newstr += a.charAt(i);
  }
  return newstr;
}

function removeTrailing(a: string, char: string) {
  let newstr: string = '';
  let i: number;
  for (i = a.length - 1; i >= 0; i--) {
    if (a.charCodeAt(i) !== char.charCodeAt(0)) {
      break;
    }
  }
  if (i === a.length - 1) return a;
  for (i; i >= 0; i--) {
    newstr = a.charAt(i) + newstr;
  }
  return newstr;
}

function removeDups(a: string, char: string) {
  let newstr: string = '';
  for (let i = 0; i < a.length; i++) {
    if (a.charCodeAt(i) === a.charCodeAt(i+1) && a.charCodeAt(i) === char.charCodeAt(0)) {
      continue;
    }
    newstr += a.charAt(i);
  }
  return newstr;
}

export function isSteamworkhopUrlValid(url: string): boolean {
  // assume url is valid https (parsed by )
  if (!url.includes('https://steamcommunity.com/sharedfiles/filedetails/?id=')) {
    return false;
  }
  return true;
}

export function isAddonIdValid(id: string): boolean {
  const parts = id.split('@');
  if (parts.length !== 2) return false;
  const addonNamePart = parts[0] || '';
  if (addonNamePart.length === 0) return false;
  const creatorPart = parts[1] || '';
  if (creatorPart.length === 0) return false;

  if (addonNamePart.includes(' ')) return false;

  if (creatorPart.includes(' ')) return false;
  return true;
}

export function isValidAddonName(name: string | null): boolean {
  if (name === null) return false;
  if (name === '') return false;
  return true;
}

export function isValidAddonId(id: string | null): boolean {
  if (id === null) return false;
  if (id === '') return false;
  return true;
}

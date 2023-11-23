/**
 * @param {string} text
 * @returns {string}
 */
export function MakeCompatPango(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&#60;').replaceAll('>', '&#62;');
}

/**
 * @param {string} text
 * @returns {string}
 */
export function MakeTitleCompat(text) {
  return MakeCompatPango(text).replaceAll('\\n', '');
}

/**
 * @param {string} text
 * @returns {string}
 */
export function SteamMd2Pango(text) {
  let a = text;

  a = a.replaceAll('&', '&amp;');

  [
    'b', 'u', 'i',
  ].forEach(x => {
    a = convertTag(a, x);
  });

  /**
   * @type {[string, string][]}
   */
  ([
    ['strike', 's'],
    ['code', 'tt'],
  ]).forEach(([x, y]) => {
    a = replaceTag(a, x, y);
  });

  a = replaceTagWithSpan(a, 'h1', { size: 'x-large', weight: 'heavy' });
  a = replaceTagWithSpan(a, 'h2', { size: 'large', weight: 'heavy' });
  a = replaceTagWithSpan(a, 'h3', { size: 'medium', weight: 'heavy' });
  a = replaceTagWithSpan(a, 'h4', { size: 'medium', weight: 'bold' });
  a = replaceTagWithSpan(a, 'h5', { size: 'medium', weight: 'bold' });
  a = replaceTagWithSpan(a, 'h6', { size: 'medium', weight: 'bold' });

  a = a.replaceAll('[/url]', '</a>');
  a = a.replaceAll(/\[url=(.*?)\]/gm, '<a href=\"$1\">');

  a = a.replaceAll('[/img]', '</a>');
  a = a.replaceAll(/\[img=(.*?)\]/gm, '<a href=\"$1\">');

  a = replaceTagWithSpan(a, 'list', {});

  a = a.replaceAll('[*]', ' - ');
  a = a.replaceAll(/(\\n\\n)[\\n]*\\n/gm, '$1');
  a = a.replaceAll(/(\\r\\n)[\\r\\n]*\\n/gm, '$1');
  return a;
}

/**
 * @param {string} text
 * @param {string} name
 * @returns {string}
 */
function convertTag(text, name) {
  const a = text.replaceAll(`[${name}]`, `<${name}>`)
    .replaceAll(`[/${name}]`, `</${name}>`);
  return a;
}

/**
 * @param {string} text
 * @param {string} name
 * @param {string} replace
 * @returns {string}
 */
function replaceTag(text, name, replace) {
  const a = text.replaceAll(`[${name}]`, `<${replace}>`)
    .replaceAll(`[/${name}]`, `</${replace}>`);
  return a;
}

/**
 * @param {string} text
 * @param {string} name
 * @param {{ [attrib: string]: string }} attrlist
 * @returns {string}
 */
function replaceTagWithSpan(text, name, attrlist) {
  const a = text.replaceAll(`[${name}]`, `<span ${(() => {
    let attrs = '';
    for (const attr in attrlist) {
      attrs += ` ${attr}='${attrlist[attr]}'`;
    }
    return attrs;
  })()}>`)
    .replaceAll(`[/${name}]`, `</span>`);
  return a;
}

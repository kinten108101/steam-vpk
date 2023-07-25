export function MakeCompatPango(text: string) {
  return text.replaceAll('&', '&amp;');
}

export function SteamMd2Pango(text: string) {
  let a = text;

  a = a.replaceAll('&', '&amp;');

  [
    'b', 'u', 'i',
  ].forEach(x => {
    a = convertTag(a, x);
  });

  [
    ['strike', 's'] as [string, string],
    ['code', 'tt'] as [string, string],
  ].forEach(([x, y]) => {
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

function convertTag(text: string, name: string) {
  const a = text.replaceAll(`[${name}]` , `<${name}>` )
                .replaceAll(`[/${name}]`, `</${name}>`)
  return a;
}

function replaceTag(text: string, name: string, replace: string) {
  const a = text.replaceAll(`[${name}]` , `<${replace}>` )
                .replaceAll(`[/${name}]`, `</${replace}>`)
  return a;
}

function replaceTagWithSpan(text: string, name: string, attrlist: { [attrib: string]: string }) {
  const a = text.replaceAll(`[${name}]` , `<span ${(() => {
                                                  let attrs = '';
                                                  for (const attr in attrlist) {
                                                    attrs +=` ${attr}='${attrlist[attr]}'`;
                                                  }
                                                  return attrs;
                                                })()}>` )
                .replaceAll(`[/${name}]`, `</span>`)
  return a;
}

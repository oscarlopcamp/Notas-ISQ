// Utilidades mínimas para construir DOM sin framework.

/**
 * Crea un elemento. `props` admite: class, html, text, dataset, style,
 * atributos arbitrarios y manejadores con prefijo `on` (onclick, oninput…).
 * Los hijos pueden ser nodos, cadenas, números, arrays o valores falsy (se omiten).
 */
export function h(tag, props = {}, ...children) {
  const el = tag.includes(':')
    ? document.createElementNS('http://www.w3.org/2000/svg', tag.split(':')[1])
    : document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue;
    if (key === 'class') el.setAttribute('class', value);
    else if (key === 'html') el.innerHTML = value;
    else if (key === 'text') el.textContent = value;
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (key === 'style' && typeof value === 'object') Object.assign(el.style, value);
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2), value);
    else el.setAttribute(key, value === true ? '' : value);
  }
  append(el, children);
  return el;
}

export function append(parent, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return parent;
}

export function svg(tag, attrs = {}, ...children) {
  return h(`svg:${tag}`, attrs, ...children);
}

export function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

let uid = 0;
export function uniqueId(prefix = 'id') {
  uid += 1;
  return `${prefix}-${uid}`;
}

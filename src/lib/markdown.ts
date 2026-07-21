/**
 * Conversor Markdown → HTML leve (sem dependência externa).
 *
 * Suficiente para o corpo de artigos do M05 — o mesmo motor alimenta o preview
 * do editor no backoffice (`admin/conteudos/markdown-editor.tsx`) e o leitor de
 * conteúdo da Usuária (`usuaria/conteudos/conteudo-reader-view.tsx`). O conteúdo
 * é autorado por admin/profissional confiável, então o HTML resultante é usado
 * via `dangerouslySetInnerHTML` sem sanitização adicional.
 *
 * Suporta: #/##/### títulos, **negrito**, *itálico*, `código`, ~~tachado~~,
 * > citação, - / 1. listas, --- divisória, [link](url) e ![img](url).
 */

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inline(s: string): string {
  let t = esc(s)
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" style="max-width:100%;border-radius:10px;margin:6px 0"/>')
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#7A4A5C">$1</a>')
  t = t.replace(/`([^`]+)`/g, '<code style="background:rgba(45,24,64,0.07);padding:1px 5px;border-radius:5px;font-size:0.9em">$1</code>')
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
  t = t.replace(/~~([^~]+)~~/g, '<span style="text-decoration:line-through">$1</span>')
  return t
}

/** Converte Markdown em HTML. Retorna um placeholder quando o texto é vazio. */
export function mdToHtml(md: string): string {
  const lines = (md || '').split('\n')
  let html = ''
  let i = 0
  const flushList = (tag: string, items: string[]) =>
    `<${tag} style="margin:8px 0;padding-left:22px;display:flex;flex-direction:column;gap:4px">${items
      .map((x) => `<li>${inline(x)}</li>`)
      .join('')}</${tag}>`
  while (i < lines.length) {
    const l = lines[i]
    if (/^###\s+/.test(l)) { html += `<h3 style="font-family:var(--font-display);font-size:19px;color:#2D1840;margin:14px 0 4px">${inline(l.replace(/^###\s+/, ''))}</h3>`; i++; continue }
    if (/^##\s+/.test(l)) { html += `<h2 style="font-family:var(--font-display);font-size:23px;color:#2D1840;margin:16px 0 6px">${inline(l.replace(/^##\s+/, ''))}</h2>`; i++; continue }
    if (/^#\s+/.test(l)) { html += `<h1 style="font-family:var(--font-display);font-size:28px;color:#2D1840;margin:18px 0 8px">${inline(l.replace(/^#\s+/, ''))}</h1>`; i++; continue }
    if (/^>\s?/.test(l)) { html += `<blockquote style="border-left:3px solid #7A4A5C;padding:2px 0 2px 14px;margin:10px 0;color:rgba(45,24,64,0.7);font-style:italic">${inline(l.replace(/^>\s?/, ''))}</blockquote>`; i++; continue }
    if (/^(-{3,}|\*{3,})$/.test(l.trim())) { html += `<hr style="border:none;border-top:1px solid rgba(45,24,64,0.12);margin:16px 0"/>`; i++; continue }
    if (/^\s*[-*]\s+/.test(l)) { const items: string[] = []; while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, '')); i++ } html += flushList('ul', items); continue }
    if (/^\s*\d+\.\s+/.test(l)) { const items: string[] = []; while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++ } html += flushList('ol', items); continue }
    if (l.trim() === '') { i++; continue }
    let para = l
    while (i + 1 < lines.length && lines[i + 1].trim() !== '' && !/^(#{1,3}\s|>|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i + 1])) { para += ' ' + lines[i + 1]; i++ }
    html += `<p style="margin:8px 0;line-height:1.7;color:rgba(45,24,64,0.85)">${inline(para)}</p>`; i++
  }
  return html || '<p style="color:rgba(45,24,64,0.35)">Nada para pré-visualizar ainda.</p>'
}

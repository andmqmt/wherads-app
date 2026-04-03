export function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let inList: 'ul' | 'ol' | null = null;
  let paragraph: string[] = [];

  function flushParagraph() {
    if (paragraph.length > 0) {
      html.push(`<p>${paragraph.join('<br/>')}</p>`);
      paragraph = [];
    }
  }

  function flushList() {
    if (inList) {
      html.push(`</${inList}>`);
      inList = null;
    }
  }

  function inlineFormat(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }

  for (const line of lines) {
    const trimmed = line.trimEnd();

    // Horizontal rule
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      flushParagraph();
      flushList();
      html.push('<hr/>');
      continue;
    }

    // Headers (h1-h4)
    const headerMatch = trimmed.match(/^(#{1,4})\s+(.*)/);
    if (headerMatch) {
      flushParagraph();
      flushList();
      const level = headerMatch[1].length;
      html.push(`<h${level}>${inlineFormat(headerMatch[2])}</h${level}>`);
      continue;
    }

    // Unordered list item (- or *)
    const ulMatch = trimmed.match(/^[-*]\s+(.*)/);
    if (ulMatch) {
      flushParagraph();
      if (inList !== 'ul') {
        flushList();
        html.push('<ul>');
        inList = 'ul';
      }
      html.push(`<li>${inlineFormat(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered list item
    const olMatch = trimmed.match(/^\d+\.\s+(.*)/);
    if (olMatch) {
      flushParagraph();
      if (inList !== 'ol') {
        flushList();
        html.push('<ol>');
        inList = 'ol';
      }
      html.push(`<li>${inlineFormat(olMatch[1])}</li>`);
      continue;
    }

    // Empty line = paragraph break
    if (trimmed === '') {
      flushParagraph();
      flushList();
      continue;
    }

    // Regular text line
    paragraph.push(inlineFormat(trimmed));
  }

  flushParagraph();
  flushList();

  return html.join('');
}

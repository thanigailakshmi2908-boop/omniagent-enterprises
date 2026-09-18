// Lightweight markdown-to-HTML renderer with code block support
// Handles: headers, bold, italic, code blocks, inline code, lists, tables, blockquotes, hr, links

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderInline(text: string): string {
  let result = escapeHtml(text);
  // Inline code
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic
  result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  // Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-primary-400 underline">$1</a>');
  return result;
}

export function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let inCodeBlock = false;
  let codeLang = '';
  let codeContent: string[] = [];
  let inTable = false;
  let tableRows: string[] = [];

  const flushTable = () => {
    if (tableRows.length < 2) { inTable = false; tableRows = []; return; }
    const [headerLine, , ...dataLines] = tableRows;
    const headers = headerLine.split('|').map((c) => c.trim()).filter(Boolean);
    html.push('<table><thead><tr>');
    headers.forEach((h) => html.push(`<th>${renderInline(h)}</th>`));
    html.push('</tr></thead><tbody>');
    dataLines.forEach((row) => {
      const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
      html.push('<tr>');
      cells.forEach((c) => html.push(`<td>${renderInline(c)}</td>`));
      html.push('</tr>');
    });
    html.push('</tbody></table>');
    inTable = false;
    tableRows = [];
  };

  for (const line of lines) {
    // Code block fence
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
        codeContent = [];
      } else {
        const code = codeContent.join('\n');
        html.push(`<pre data-lang="${codeLang}"><code class="language-${codeLang}">${highlightCode(code, codeLang)}</code></pre>`);
        inCodeBlock = false;
        codeLang = '';
        codeContent = [];
      }
      continue;
    }
    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Table detection
    if (line.includes('|') && line.trim().startsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableRows = [line.trim()];
      } else {
        tableRows.push(line.trim());
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headers
    const hMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      html.push(`<h${level}>${renderInline(hMatch[2])}</h${level}>`);
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      html.push('<hr />');
      continue;
    }

    // Blockquote
    if (line.trim().startsWith('> ')) {
      html.push(`<blockquote>${renderInline(line.trim().slice(2))}</blockquote>`);
      continue;
    }

    // Unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const item = line.replace(/^\s*[-*+]\s+/, '');
      html.push(`<li>${renderInline(item)}</li>`);
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const item = line.replace(/^\s*\d+\.\s+/, '');
      html.push(`<li>${renderInline(item)}</li>`);
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      html.push('');
      continue;
    }

    // Paragraph
    html.push(`<p>${renderInline(line)}</p>`);
  }

  if (inTable) flushTable();
  if (inCodeBlock) {
    html.push(`<pre><code>${escapeHtml(codeContent.join('\n'))}</code></pre>`);
  }

  return html.join('\n');
}

// Simple syntax highlighting for common languages
function highlightCode(code: string, lang: string): string {
  let html = escapeHtml(code);
  const kw: Record<string, string[]> = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'extends', 'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch', 'throw', 'new', 'typeof', 'instanceof', 'this', 'super', 'null', 'undefined', 'true', 'false'],
    typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'extends', 'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch', 'throw', 'new', 'typeof', 'instanceof', 'this', 'super', 'null', 'undefined', 'true', 'false', 'interface', 'type', 'enum', 'implements', 'public', 'private', 'protected', 'readonly', 'as', 'is'],
    python: ['def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'lambda', 'yield', 'async', 'await', 'True', 'False', 'None', 'self', 'pass', 'break', 'continue'],
    sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'AS', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'IN', 'EXISTS', 'UNION', 'ALL', 'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'WITH', 'INTO', 'VALUES', 'SET'],
  };
  const l = lang.toLowerCase();
  const keywords = kw[l] ?? kw.javascript;

  // Comments
  if (l === 'python' || l === 'sql') {
    html = html.replace(/(#[^\n]*)/g, '<span class="tok-comment">$1</span>');
  } else {
    html = html.replace(/(\/\/[^\n]*)/g, '<span class="tok-comment">$1</span>');
    html = html.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>');
  }
  // Strings
  html = html.replace(/("[^"]*")/g, '<span class="tok-string">$1</span>');
  html = html.replace(/('[^']*')/g, '<span class="tok-string">$1</span>');
  html = html.replace(/(`[^`]*`)/g, '<span class="tok-string">$1</span>');
  // Numbers
  html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-number">$1</span>');
  // Keywords
  const kwPattern = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const kwRegex = new RegExp(`\\b(${kwPattern})\\b`, 'g');
  html = html.replace(kwRegex, '<span class="tok-keyword">$1</span>');

  return html;
}

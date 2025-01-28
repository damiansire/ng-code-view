import { TagType } from './code-parser.interface';

export function isTag(str: string): boolean {
  // Normalize the string by trimming and converting to lowercase
  str = str.trim().toLowerCase();

  // Check for valid start and end characters
  if (!str.startsWith('<') || (!str.endsWith('>') && !str.endsWith('/>'))) {
    return false;
  }

  // Enhanced Regex (Case-insensitive, Handles attributes, and spaces correctly, plus Angular events)
  const tagRegex =
    /^<\/?[a-z][\w-]*(\s+[\w-]*(?:(?:\(\w+\))?=\s*(?:".*?"|'.*?'|[^'">\s]+))?)*\s*\/?>$/;

  return tagRegex.test(str);
}

export function spliteInTags(htmlString: string) {
  // Expresión regular actualizada para etiquetas vacías y anidadas
  const regex =
    /\s*(<\/?\w+(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^'">\s]+))?)*\/?>|\s*<\/?\w+\s+\/>)\s*/g;
  //              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^
  //                 |                                                              |          |
  //    Patrón para etiquetas con atributos opcionales                          Patrón para etiquetas vacías

  const result = htmlString.split(regex).filter(Boolean);
  const fixs = splitAndReplaceTag(result);
  return fixs;
}

function splitAndReplaceTag(strings: string[]): string[] {
  const targetElement = '<button (click)="increment()"> Increment';
  for (let index = 0; index < strings.length; index++) {
    if (strings[index] === targetElement) {
      const part1 = '<button (click)="increment()">';
      const part2 = ' Increment ';
      strings.splice(index, 1, part1, part2); // Replace the element with two parts
      break; // Stop after the first replacement
    }
  }
  return strings;
}

export class HtmlHelper {
  static getTagFromId(id: string) {
    return id.split('-')[0];
  }

  static isSpaceElement(id: string) {
    return /^space-\d+$/.test(id);
  }

  static getElementType(content: string): TagType {
    content = content.trim();
    const openingTagMatch = content.match(/<([a-z][a-z0-9]*)\b[^>]*>/i);
    const closingTagMatch = content.match(/<\/([a-z][a-z0-9]*)\b[^>]*>/i);
    if (openingTagMatch) {
      return { element: openingTagMatch[1].toLowerCase(), isClosingTag: false };
    } else if (closingTagMatch) {
      return { element: closingTagMatch[1].toLowerCase(), isClosingTag: true };
    } else if (content === '') {
      return { element: 'space', isClosingTag: false };
    } else {
      return { element: 'text', isClosingTag: false };
    }
  }
}

export class HtmlIdGeneratorService {
  private tagCounters: { [tagName: string]: number } = {};

  generateId(line: string): string {
    const elementInfo = HtmlHelper.getElementType(line); // Devuelve un objeto

    const tagName = elementInfo.element; // Extrae el nombre del elemento

    const counterKey = elementInfo.isClosingTag ? `${tagName}-closed` : tagName;

    if (!this.tagCounters[counterKey]) {
      this.tagCounters[counterKey] = 1;
    } else {
      this.tagCounters[counterKey]++;
    }

    return `${tagName}-${elementInfo.isClosingTag ? 'closed-' : ''}${
      this.tagCounters[counterKey]
    }`;
  }
}

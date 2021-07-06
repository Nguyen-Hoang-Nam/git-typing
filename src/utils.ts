import global from './global';

const getCurrentTime = (): number => {
  const date: Date = new Date();
  return date.getHours() * 60 + date.getMinutes() * 60 + date.getSeconds();
};

const setCharAt = (str: string, index: number, chr: string): string => {
  if (index > str.length - 1) {
    return str;
  }

  return str.substring(0, index) + chr + str.substring(index + 1);
};

const replaceNewline = (code: string): string => {
  const codeLen = code.length;
  let newCode = '';

  for (let i = 0; i < codeLen - 1; i++) {
    if (code[i] === '\n') {
      newCode += '↵\n';
    } else {
      newCode += code[i];
    }
  }
  return newCode;
};

const removeComment = (code: string, lang: string): string => {
  if (lang in global.Comment) {
    const comment: string = global.Comment[lang];
    const commentRe: RegExp = new RegExp(comment, 'g');

    const allLine: string[] = code.split('\n');
    const newLine: string[] = [];
    for (const line of allLine) {
      const commnentPosition: number = line.search(commentRe);
      if (commnentPosition === -1) {
        newLine.push(line);
      } else if (commnentPosition > 0 && line[0] !== '\t') {
        const doubleQuotePosition: number = line.search('"');
        const singleQuotePosition: number = line.search("'");

        if (doubleQuotePosition === -1 && singleQuotePosition === -1) {
          newLine.push(line.substring(0, commnentPosition));
        } else {
          newLine.push(line);
        }
      }
    }

    if (newLine[0] === '') {
      newLine.shift();
    }

    return newLine.join('\n');
  }

  return code;
};

const capitalize = (str: string): string => str[0].toUpperCase() + str.slice(1);

const getLang = (url: string): string => {
  const typeName: string[] = url.split('.');

  let lang: string = typeName[typeName.length - 1];

  if (lang in global.Language) {
    lang = global.Language[lang];
  } else {
    lang = capitalize(lang);
  }

  return lang;
};

export default {
  setCharAt,
  removeComment,
  getLang,
  replaceNewline,
  getCurrentTime,
};

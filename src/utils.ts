import global from './global';

const setCharAt = (str: string, index: number, chr: string): string => {
  if (index > str.length - 1) {
    return str;
  }

  return str.substring(0, index) + chr + str.substring(index + 1);
};

const removeComment = (code: string, lang: string): string => {
  const comment: string = global.Comment[lang];
  const commentRe: RegExp = new RegExp(comment, 'g');

  const allLine: string[] = code.split('\n');
  const newLine: string[] = [];
  for (const line of allLine) {
    const commnentPosition: number = line.search(commentRe);
    if (commnentPosition === -1) {
      newLine.push(line);
    } else if (commnentPosition > 0 && line[0] !== '\t') {
      newLine.push(line.substring(0, commnentPosition));
    }
  }

  if (newLine[0] === '') {
    newLine.shift();
  }

  return newLine.join('\n');
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

export default { setCharAt, removeComment, getLang };

const Language: object = {
  js: 'Javascript',
  ts: 'Typescript',
  py: 'Python',
  sh: 'Bash',
  rs: 'Rust',
  kt: 'Kotlin',
  yml: 'Yaml',
  tex: 'Latex',
};

const Theme: object = {
  Onedark: {
    foreground: '#ABB2BF',
    background: '#282C34',
    comment: '#5C6370',
  },
  Github: {
    foreground: '#24292E',
    background: '#FFFFFF',
    comment: '#6A737D',
  },
  OneLight: {
    foreground: '#383A42',
    background: '#FAFAFA',
    comment: '#A0A1A7',
  },
  NightOwl: {
    foreground: '#D6DEEB',
    background: '#011627',
    comment: '#637777',
  },
  Dracula: {
    foreground: '#F8F8F2',
    background: '#282A36',
    comment: '#6272A4',
  },
  GithubDark: {
    foreground: '#C9D1D9',
    background: '#0D1117',
    comment: '#8B949E',
  },
  Nord: {
    foreground: '#FFFFFF',
    background: '#2E3440',
    comment: '#4C566A',
  },
  Monokai: {
    foreground: '#DDD',
    background: '#272822',
    comment: '#75715E',
  },
};

const Comment: object = {
  Javascript: `\/\/`,
  Go: `\/\/`,
  Python: '#',
  Rust: `\/\/`,
};

const SelectTheme: string[] = [
  `Onedark`,
  `Github`,
  `OneLight`,
  `NightOwl`,
  `Dracula`,
  `GithubDark`,
  `Nord`,
  `Monokai`,
];

const SelectLanguage: string[] = [
  `Bash`,
  `C`,
  `CPP`,
  `CSS`,
  `Dockerfile`,
  `Java`,
  `Javascript`,
  `Json`,
  `Go`,
  `Kotlin`,
  `Latex`,
  `Markdown`,
  `PHP`,
  `Python`,
  `Rust`,
  `SQL`,
  `Typescript`,
  `Yaml`,
];

const SelectFont: string[] = [
  `Monospace`,
  `Source Code Pro`,
  `Fira Code`,
  `Cascadia Code`,
  `Inconsolata`,
  `JetBrains Mono`,
];

export default {
  Language,
  Theme,
  Comment,
  SelectTheme,
  SelectLanguage,
  SelectFont,
};

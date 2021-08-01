const Language: object = {
    js: "Javascript",
    ts: "Typescript",
    py: "Python",
    sh: "Bash",
    rs: "Rust",
    kt: "Kotlin",
    yml: "Yaml",
    tex: "Latex",
    php: "PHP",
    css: "CSS",
};

const Theme: object = {
    Onedark: {
        foreground: "#ABB2BF",
        background: "#282C34",
        comment: "#5C6370",
        lineNumber: "#565C64",
        cursorLine: "#353b45",
    },
    Github: {
        foreground: "#24292E",
        background: "#FFFFFF",
        comment: "#6A737D",
        lineNumber: "#6A737D",
        cursorLine: "#F5F5F5",
    },
    OneLight: {
        foreground: "#383A42",
        background: "#FAFAFA",
        comment: "#A0A1A7",
        lineNumber: "#696C77",
        cursorLine: "#F0F0F1",
    },
    NightOwl: {
        foreground: "#D6DEEB",
        background: "#011627",
        comment: "#637777",
        lineNumber: "#4B6479",
        cursorLine: "#00000033",
    },
    Dracula: {
        foreground: "#F8F8F2",
        background: "#282A36",
        comment: "#6272A4",
        lineNumber: "#62D6E8",
        cursorLine: "#3A3C4E",
    },
    GithubDark: {
        foreground: "#C9D1D9",
        background: "#0D1117",
        comment: "#8B949E",
        lineNumber: "#444d56",
        cursorLine: "#2b3036",
    },
    Nord: {
        foreground: "#FFFFFF",
        background: "#2E3440",
        comment: "#4C566A",
        lineNumber: "#D8DEE9",
        cursorLine: "#3B4252",
    },
    Monokai: {
        foreground: "#DDD",
        background: "#272822",
        comment: "#75715E",
        lineNumber: "#A59F85",
        cursorLine: "#383830",
    },
};

const Comment: object = {
    Javascript: `\/\/`,
    Typescript: `\/\/`,
    Lua: `--`,
    Go: `\/\/`,
    Python: "#",
    Rust: `\/\/`,
    PHP: `(\/\/|#)`,
    Java: `\/\/`,
    C: `\/\/`,
    CPP: `\/\/`,
    Bash: `#`,
    Kotlin: `\/\/`,
    Latex: `%`,
    SQL: `--`,
    Yaml: `#`,
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
    `Lua`,
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

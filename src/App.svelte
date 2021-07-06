<script lang="ts">
  import Highlight from "svelte-highlight";

  import * as syntaxHighlight from "./language";
  import * as syntaxTheme from "./theme";

  import global from "./global";
  import utils from "./utils";

  /* App include 3 layers:
   * _ Layer 1: Store code from Github
   * _ Layer 2: Highlight code from layer 3 with transparent background
   * _ Layer 3: Textarea with transparent color and transparent background
   *
   * Flow:
   * Web -> ./fetchCode.worker.js -> github.com/<User>/<Repo>/<Branch>/path/to/file.[ext]
   * Web -> ./getConfig.worker.js -> indexedDB
   * Web -> ./getCode.worker.js -> indexedDB
   *
   * After fetch codes from github, it will be removed comments, added newline icons, and displayed in layer1
   * Moveover, we make a copy of code to compare with code in layer 3
   * Everytime, user types new letters in layer3 will be checked with codes, and send to layer 2 to highlight
   */

  // Fetch code from Github in other thread
  const worker = new Worker(new URL("./fetchCode.worker.js", import.meta.url));

  // Get code from previous typing from inexedDB
  const getCode = new Worker(new URL("./getCode.worker.js", import.meta.url));

  // Set url, code to indexedDB
  const setCode = new Worker(new URL("./setCode.worker.js", import.meta.url));

  // Cache bundle, fonts
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js");
    });
  }

  // Get link to file
  const queryString: string = location.search; // gittyping/?github=<User>/<Repo>/<Branch>/directory/to/file.extention
  const params: URLSearchParams = new URLSearchParams(queryString); // /?github=<User>/<Repo>/<Branch>/directory/to/file.extention
  let url: string = params.get("github"); // <User>/<Repo>/<Branch>/directory/to/file.extention

  let urlComponent: string[] = url.split("/");
  let branch: string = "";

  if (urlComponent[2] === "blob") {
    branch = urlComponent[3];

    urlComponent.splice(2, 1);
    url = urlComponent.join("/");
  } else {
    branch = urlComponent[2];
  }
  // Send Url to ./fetchCode.worker.js
  worker.postMessage({ url });

  // Lanuage of file
  let lang: string = utils.getLang(url); // <User>/<Repo>/<Branch>/directory/to/file.extention -> Extension

  ////////////////////////////////////////
  //
  // Editor's configuration
  //
  ////////////////////////////////////////

  // Theme
  let theme: string;
  let foreground: string; // To highlight cursor in layer 3
  let background: string; // To highlight background of layer 1
  let comment: string; // To highlight code in layer 1
  let lineNumber: string;
  let cursorLine: string;

  // Code's style
  let fontFamily: string;
  let fontSize: number;

  // Get config from indexedDB
  const getConfig = new Worker(
    new URL("./getConfig.worker.js", import.meta.url)
  );
  getConfig.postMessage({});
  getConfig.onmessage = ({ data }) => {
    theme = data.theme;
    fontFamily = data.fontFamily;
    fontSize = data.fontSize;
  };

  // Data
  /* let originalCode: string = ""; */
  let rawCode: string = "";
  let displayCode: string = "";
  let codeLen: number = 0;
  let backup: string = "";
  let numberOfLine: number = 0;

  worker.onmessage = ({ data: { originalData } }) => {
    /* originalCode = originalData; */

    displayCode = utils.removeComment(originalData, lang);
    rawCode = displayCode;
    codeLen = rawCode.length - 1;
    getCode.postMessage({ url, rawCode });
    numberOfLine = rawCode.split("\n").length - 1;

    displayCode = utils.replaceNewline(displayCode);
  };

  // Editor
  let textarea: any; // Layer 3
  /* let widthEditor: number; */
  let heightEditor: number;
  let heightScreen: number;

  // Flog
  let finish: boolean = false;
  /* let typingError: boolean = false; */

  let startTime: number;
  let startPosition: number = 0;
  let countWords: number = 0;
  let wordsPerMinute: number = 0;

  let currentPosition: number = 0;
  let currentLine: number = 1;
  let currentColumn: number = 1;
  getCode.onmessage = ({ data }) => {
    if (data.code) {
      textarea.value = data.code;
      backup = data.code;
      currentPosition = data.code.length;
      startPosition = data.code.length;
      currentLine = data.currentLine;
      currentColumn = data.currentColumn;
    }
  };

  // Check a new character in layer3 match with a character in layer 1
  const checkTypingCharacter = () => {
    let current = textarea.value; // All characters in layer 3
    const len = current.length - 1; // Lenght of text in layer 3
    const character = current[len]; // The new character in layer 3

    if (len === startPosition + 1) {
      startTime = utils.getCurrentTime();
    }

    if (len === codeLen) {
      // Length of code in layer 3 equal length of code in layer 1
      wordsPerMinute = (countWords * 60) / (utils.getCurrentTime() - startTime);
      finish = true; // Set finish flag
      textarea.value = backup; // Stop layer 3 store new character

      // This will delete record of current Url in indexedDB
      setCode.postMessage({ currentLine: 1, currentColumn: 1, url });
    } else if (character !== rawCode[len] || currentPosition > len + 1) {
      // A new character is not matching
      /* typingError = true; */
      textarea.value = backup; // Stop layer 3 store new character
    } else {
      // Set position of cursor in newline
      if (character === "\n") {
        countWords++;
        wordsPerMinute =
          (countWords * 60) / (utils.getCurrentTime() - startTime);

        currentLine++;
        currentColumn = 1;
      } else if (character === " " || character === "." || character === "/") {
        countWords++;
        wordsPerMinute =
          (countWords * 60) / (utils.getCurrentTime() - startTime);
      }

      if (
        character === "\n" &&
        len < codeLen &&
        (rawCode[len + 1] === "\t" || rawCode[len + 1] === " ")
      ) {
        // Auto indent when enter
        let indent = rawCode[len + 1]; // Index is tab or space

        let i = len + 1;
        while (rawCode[i++] === indent) {
          current += indent;
        }

        currentPosition += i - (len + 1);
        currentColumn += i - (len + 1) - 1; // Minus 1 because currentColumn start at 1

        textarea.value = current; // Set cursor in layer 3 after insert indent
        backup = current; // Store backup of layer 3
      } else {
        // Overwrite code in layer 1 with space to not affect layer 2 syntax highlight
        if (character !== "\n") {
          let replaceCharacter = " ";

          displayCode = utils.setCharAt(
            displayCode,
            len + currentLine - 1,
            replaceCharacter
          );
        }

        currentColumn++;
        currentPosition++;
        backup = current; // Store backup of layer 3
      }

      /* typingError = false; */
    }
  };

  // Reset layer 3 to type again
  const doAgain = () => {
    textarea.value = "";
    backup = "";
    displayCode = utils.replaceNewline(rawCode);
    currentPosition = 0;
    currentLine = 1;
    currentColumn = 1;

    finish = false; // Turn off finish flag
  };

  // Check user close or reload page to store current typing position in this Url
  window.onbeforeunload = () => {
    if (!finish && (currentColumn > 1 || currentLine > 1)) {
      setCode.postMessage({ currentLine, currentColumn, url });
    }

    // Must have return to work, weird @@
    return "something";
  };

  ////////////////////////////////////////
  //
  // Set editor's configuration
  //
  ////////////////////////////////////////

  const setConfig = new Worker(
    new URL("./setConfig.worker.js", import.meta.url)
  );

  // When user change theme in selection
  // When user load page, theme will auto set to null because web worker ofter gets config before this
  $: if (theme && theme !== "null") {
    foreground = global.Theme[theme].foreground;
    background = global.Theme[theme].background;
    comment = global.Theme[theme].comment;
    lineNumber = global.Theme[theme].lineNumber;
    cursorLine = global.Theme[theme].cursorLine;

    setConfig.postMessage({ value: theme, key: "theme" });
  }

  // When user change font family in selection
  // When user load page, font family will auto set to null because web worker ofter gets config before this
  $: if (fontFamily && fontFamily !== "null") {
    setConfig.postMessage({ value: fontFamily, key: "fontFamily" });
  }

  // When user change font size in input
  // Fortunately, input doesn't need default text
  $: if (fontSize) {
    setConfig.postMessage({ value: fontSize, key: "fontSize" });
  }

  $: if (heightEditor > 20) {
    if (heightEditor < heightScreen - 138) {
      heightEditor = heightScreen - 138;
    }
  }
</script>

<svelte:head>
  {@html syntaxTheme[theme]}
</svelte:head>

<svelte:window bind:innerHeight={heightScreen} />

<div class={`finish ${finish ? "flex" : "none"}`}>
  <div>Finished</div>
  <button on:click={doAgain}>Do again</button>
</div>

<h1 class="title">Git Typing</h1>

<div
  class="flex"
  style="justify-content: space-between; padding-left: 10px; padding-right: 10px;"
>
  <div
    class="flex"
    style="column-gap: 20px; margin-bottom: 20px; margin-top: 20px;"
  >
    <div class="flex option">
      <p>Theme:</p>
      <select bind:value={theme}>
        <option value="null" selected disabled />
        {#each global.SelectTheme as selectTheme}
          <option value={selectTheme}>{selectTheme}</option>
        {/each}
      </select>
    </div>

    <div class="flex option">
      <p>Language:</p>
      <select bind:value={lang}>
        {#each global.SelectLanguage as language}
          <option value={language}>{language}</option>
        {/each}
      </select>
    </div>

    <div class="flex option">
      <p>Font:</p>
      <select bind:value={fontFamily}>
        <option value="null" selected disabled />
        {#each global.SelectFont as font}
          <option value={font}>{font}</option>
        {/each}
      </select>
    </div>

    <div class="flex option">
      <p>Size:</p>
      <input type="number" bind:value={fontSize} class="font-size" />
    </div>
  </div>
  <div class="flex" style="align-items: center">
    <div>{Math.round(wordsPerMinute)} wpm</div>
  </div>
</div>

<div
  class="flex editor"
  style="
--background: {background}; 
--foreground: {foreground}; 
--comment: {comment}; 
--font-family: {fontFamily}; 
--font-size: {fontSize + 'px'};
--line-number: {lineNumber};
--cursor-line: {cursorLine};"
>
  <div class="line-number" style={`height: ${heightEditor}px;`}>
    {#each Array(numberOfLine) as _, line}
      <div class={line === currentLine - 1 ? "cursor-line" : ""}>
        {line + 1}
      </div>
    {/each}
  </div>
  <div class="relative codeEditor">
    <div
      class="absolute layer0 top-left"
      style={`width: 100%; height: ${heightEditor}px;`}
    />
    <!-- Layer 1 -->
    <pre
      class="absolute top-left code-style original-code"
      bind:clientHeight={heightEditor}
      style={`box-sizing: border-box; width: 100%`}>{displayCode}</pre>

    <!-- Layer 2 -->
    <Highlight
      style={`
			z-index: 5;
			width: 100%;
			height: ${heightEditor}px;
			margin: 0px;
			box-sizing: border-box;
			background: transparent;
			font-family: inherit;
			font-size: ${fontSize}px;
			padding: 10px;
		`}
      class="absolute top-left"
      language={syntaxHighlight[lang]}
      code={backup}
    />

    <!-- Layer 3 -->
    <textarea
      on:input={checkTypingCharacter}
      bind:this={textarea}
      class="absolute code-style typing transparent top-left"
      style={`width: 100%; height: ${heightEditor}px;`}
      spellcheck="false"
    />
  </div>
</div>

<div class="footer flex">
  <div class="flex center-v">
    <a
      href={"https://raw.githubusercontent.com/" + url}
      target="blank"
      style="display: flex; column-gap: 10px;"
    >
      <img src="./images/branch.svg" alt="Github" class="github-icon" />
      {branch}
    </a>
  </div>
  <div class="right-footer flex center-v">
    <div>Ln {currentLine}, Col {currentColumn}</div>
    <div>{lang}</div>
    <a href="https://github.com/Nguyen-Hoang-Nam/git-typing/" target="blank">
      <img src="./images/github.svg" alt="Github" class="github-icon" />
    </a>
  </div>
</div>

<style>
  .github-icon {
    height: 20px;
  }

  .right-footer {
    column-gap: 20px;
  }

  .footer {
    padding-right: 10px;
    padding-left: 10px;
    height: 28px;
    justify-content: space-between;
  }

  .option {
    align-items: center;
    column-gap: 10px;
    height: 34px;
  }

  .title {
    padding-left: 10px;
    margin: auto;
    font-family: var(--font-family);
  }

  .editor {
    width: 100%;
    font-size: var(--font-size);
    font-family: var(--font-family);
    height: calc(100vh - 138px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .line-number {
    padding-top: 10px;
    padding-bottom: 10px;
    width: 50px;
    background-color: var(--background);
    color: var(--comment);
    box-sizing: border-box;
    border-right: 1px solid var(--comment);
    padding-left: 10px;
  }

  .codeEditor {
    width: calc(100vw - 50px);
  }

  .code-style {
    padding: 10px;
  }

  .layer0 {
    background-color: var(--background);
  }

  .original-code {
    z-index: 2;
    color: var(--comment);
    background: transparent;
  }

  .typing {
    z-index: 10;
    color: rgba(30, 30, 30, 0);
    caret-color: var(--foreground);
  }

  .font-size {
    width: 56px;
  }

  .cursor-line {
    position: relative;
    z-index: 2;
    color: var(--line-number);
    background: var(--cursor-line);
  }

  .cursor-line::after {
    content: "";
    display: block;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 40px;
    width: 100vw;
    height: 100%;
    background: var(--cursor-line);
  }

  .cursor-line::before {
    content: "";
    display: block;
    position: absolute;
    left: -10px;
    top: 0;
    width: 10px;
    height: 100%;
    background: var(--cursor-line);
  }
</style>

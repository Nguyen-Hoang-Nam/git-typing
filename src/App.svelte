<script lang="ts">
  import Highlight from "svelte-highlight";

  import * as syntaxHighlight from "./language";
  import * as syntaxTheme from "./theme";

  import global from "./global";
  import utils from "./utils";

  const queryString = location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("github");

  // Theme
  let theme: string = "Onedark";
  let foreground: string = global.Theme[theme].foreground;
  let background: string = global.Theme[theme].background;
  let comment: string = global.Theme[theme].comment;

  let lang: string = "";

  // Code's style
  let fontFamily: string = "monospace";
  let fontSize: number = 14;

  let code: string = "";
  let codeLen: number = 0;

  let backup: string = "";
  let textarea: any;

  let currentPosition: number = 0;

  let width: number;
  let height: number;

  const checkTypingCharacter = () => {
    const current = textarea.value;
    const len = current.length - 1;
    const character = current[len];

    if (character != code[len] || currentPosition > len + 1) {
      textarea.value = backup;
    } else {
      if (character === "\n" && len < codeLen && code[len + 1] === "\t") {
        let i = len + 1;
        let tab = "";
        while (code[i] === "\t") {
          tab += "\t";
          i++;
          currentPosition++;
        }

        textarea.value = current + tab;
        backup = current + tab;
      } else {
        if (character !== "\n") {
          code = utils.setCharAt(code, len, " ");
        }
        backup = current;
      }

      currentPosition++;
    }
  };

  fetch("https://raw.githubusercontent.com/" + id).then((res) => {
    lang = utils.getLang(id);

    res.text().then((data) => {
      code = utils.removeComment(data, lang);
      codeLen = code.length;
    });
  });

  $: if (theme) {
    foreground = global.Theme[theme].foreground;
    background = global.Theme[theme].background;
    comment = global.Theme[theme].comment;
  }
</script>

<svelte:head>
  {@html syntaxTheme[theme]}
</svelte:head>

<h1 class="title">Git Typing</h1>

<div
  class="flex"
  style="column-gap: 20px; margin-bottom: 20px; margin-top: 20px;"
>
  <div class="flex option">
    <p>Theme:</p>
    <select bind:value={theme}>
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

<div
  class="relative editor"
  style="
	--background: {background}; 
	--foreground: {foreground}; 
	--comment: {comment}; 
	--font-family: {fontFamily}; 
	--font-size: {fontSize + 'px'}"
>
  <pre
    class="code-style original-code"
    bind:clientWidth={width}
    bind:clientHeight={height}>{code}</pre>

  <Highlight
    style={`
			z-index: 1;
			width: ${width}px;
			height: ${height}px;
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

  <textarea
    on:input={checkTypingCharacter}
    bind:this={textarea}
    class="absolute code-style typing transparent top-left"
    style={`width: ${width}px; height: ${height}px;`}
    spellcheck="false"
  />
</div>

<style>
  .option {
    align-items: center;
    column-gap: 10px;
  }

  .title {
    margin: auto;
    font-family: var(--font-family);
  }

  .editor {
    font-size: var(--font-size);
    font-family: var(--font-family);
  }

  .code-style {
    padding: 10px;
  }

  .original-code {
    color: var(--comment);
    background-color: var(--background);
  }

  .typing {
    z-index: 10;
    color: rgba(30, 30, 30, 0);
    caret-color: var(--foreground);
  }

  .font-size {
    width: 56px;
  }
</style>

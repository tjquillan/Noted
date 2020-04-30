import { Editor, EditorChangeLinkedList } from "codemirror";
import EmojiDefinitions from "vickymd/addon/emoji";
import { useEffect } from "react";

export function useCommandHint(): void {
}

export function useEmojiHint(editor: Editor | null): void {
  useEffect(() => {
    if (!editor) {
      return
    }

    const onChange = (instance: Editor, changeObject: EditorChangeLinkedList): void => {
      if (changeObject.text[0] === ":") {
        instance.showHint({
          closeOnUnfocus: true,
          completeSingle: false,
          hint: () => {
            const cursor = editor.getCursor();
            const token = editor.getTokenAt(cursor);
            const line = cursor.line;
            const lineStr = editor.getLine(line);
            const end: number = cursor.ch;
            let start = token.start;
            if (lineStr[start] !== ":") {
              start = start - 1;
            }
            const currentWord: string = lineStr
              .slice(start, end)
              .replace(/^:/, "");

            const commands: { text: string; displayText: string }[] = [];
            for (const def in EmojiDefinitions) {
              const emoji = EmojiDefinitions[def];
              commands.push({
                text: `:${def}: `,
                displayText: `:${def}: ${emoji}`,
              });
            }
            const filtered = commands.filter(
              (item) =>
                item.displayText
                  .toLocaleLowerCase()
                  .indexOf(currentWord.toLowerCase()) >= 0,
            );
            return {
              list: filtered.length ? filtered : commands,
              from: { line, ch: start },
              to: { line, ch: end },
            };
          }
        })
      }
    }

    editor.on('change', onChange)

    return (): void => {
      editor.off('change', onChange)
    }
  }, [editor])
}

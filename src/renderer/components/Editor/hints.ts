import { Editor, EditorChangeLinkedList } from "codemirror"
import EmojiDefinitions from "vickymd/addon/emoji"
import { useEffect, useMemo } from "react"

export function useCommandHint(editor: Editor | null): void {
  const commands = useMemo(
    () => [
      {
        text: "# ",
        displayText: "/h1 - Insert Header 1"
      },
      {
        text: "## ",
        displayText: "/h2 - Insert Header 2"
      },
      {
        text: "### ",
        displayText: "/h3 - Insert Header 3"
      },
      {
        text: "#### ",
        displayText: "/h4 - Insert Header 4"
      },
      {
        text: "##### ",
        displayText: "/h5 - Insert Header 5"
      },
      {
        text: "###### ",
        displayText: "/h6 - Insert Header 6"
      },
      {
        text: "* ",
        displayText: `/ul - Insert Unordered List`
      },
      {
        text: "1. ",
        displayText: `/ol - Insert Ordered List`
      },
      {
        text: "[Example](http://example.com/)",
        displayText: `/ln - Insert Link`
      },
      {
        text: "> ",
        displayText: `/blockquote - Insert Blockquote`
      },
      {
        text: `|   |   |
|---|---|
|   |   |
`,
        displayText: "/table - Insert Table"
      }
    ],
    []
  )

  useEffect(() => {
    if (!editor) {
      return
    }

    const onChange = (instance: Editor, changeObject: EditorChangeLinkedList): void => {
      if (changeObject.text.length === 1 && changeObject.text[0] === "/") {
        const aheadStr = instance.getLine(changeObject.from.line).slice(0, changeObject.from.ch + 1)
        if (!aheadStr.match(/#[^\s]+?\/$/)) {
          // Not `/` inside a tag
          instance.showHint({
            closeOnUnfocus: false,
            completeSingle: false,
            hint: () => {
              const cursor = instance.getCursor()
              const token = instance.getTokenAt(cursor)
              const line = cursor.line
              const lineStr = instance.getLine(line)
              const end: number = cursor.ch
              let start = token.start
              if (lineStr[start] !== "/") {
                start = start - 1
              }
              const currentWord: string = lineStr.slice(start, end).replace(/^\//, "")
              const filtered = commands.filter(
                (item) => item.displayText.toLocaleLowerCase().indexOf(currentWord.toLowerCase()) >= 0
              )
              return {
                list: filtered.length ? filtered : commands,
                from: { line, ch: start },
                to: { line, ch: end }
              }
            }
          })
        }
      }
    }

    editor.on("change", onChange)

    return (): void => {
      editor.off("change", onChange)
    }
  }, [commands, editor])
}

export function useEmojiHint(editor: Editor | null): void {
  useEffect(() => {
    if (!editor) {
      return
    }

    const onChange = (instance: Editor, changeObject: EditorChangeLinkedList): void => {
      const line = instance.getLine(changeObject.from.line)
      if (line[changeObject.from.ch - 1] === ":") {
        instance.showHint({
          closeOnUnfocus: true,
          completeSingle: false,
          hint: () => {
            const cursor = instance.getCursor()
            const token = instance.getTokenAt(cursor)
            const line = cursor.line
            const lineStr = instance.getLine(line)
            const end: number = cursor.ch
            let start = token.start
            if (lineStr[start] !== ":") {
              start = start - 1
            }
            const currentWord: string = lineStr.slice(start, end).replace(/^:/, "")

            const commands: { text: string; displayText: string }[] = []
            for (const def in EmojiDefinitions) {
              const emoji = EmojiDefinitions[def]
              commands.push({
                text: `:${def}: `,
                displayText: `:${def}: ${emoji}`
              })
            }
            const filtered = commands.filter(
              (item) => item.displayText.toLocaleLowerCase().indexOf(currentWord.toLowerCase()) >= 0
            )
            return {
              list: filtered.length ? filtered : commands,
              from: { line, ch: start },
              to: { line, ch: end }
            }
          }
        })
      }
    }

    editor.on("change", onChange)

    return (): void => {
      editor.off("change", onChange)
    }
  }, [editor])
}

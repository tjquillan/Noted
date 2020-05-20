import { Editor, EditorChangeLinkedList } from "codemirror"
import EmojiDefinitions from "vickymd/addon/emoji"
import { useEffect, useMemo } from "react"
// @ts-ignore emoji-toolkit doesn't have types
import * as joypixels from "emoji-toolkit"
import { getResourceHome } from "../../util/paths"

interface CommandHint {
  text: string
  command: string
  description: string
  icon?: string
  render: (element: HTMLElement, data: CommandHint[], current: CommandHint) => void
}

export function useCommandHint(editor: Editor | null): void {
  const render = (element: HTMLElement, data: CommandHint[], cur: CommandHint): void => {
    const wrapper = document.createElement("div")
    wrapper.style.padding = "6px 0"
    wrapper.style.display = "flex"
    wrapper.style.flexDirection = "row"
    wrapper.style.alignItems = "flex-start"
    wrapper.style.maxWidth = "100%"
    wrapper.style.minWidth = "200px"

    const leftPanel = document.createElement("div")
    const iconWrapper = document.createElement("div")
    iconWrapper.style.padding = "0 6px"
    iconWrapper.style.marginRight = "6px"
    iconWrapper.style.fontSize = "1rem"

    const iconElement = document.createElement("span")
    iconElement.classList.add("mdi")
    iconElement.classList.add(cur.icon || "mdi-help-circle-outline")
    iconWrapper.appendChild(iconElement)
    leftPanel.appendChild(iconWrapper)

    const rightPanel = document.createElement("div")

    const descriptionElement = document.createElement("p")
    descriptionElement.innerText = cur.description
    descriptionElement.style.margin = "2px 0"
    descriptionElement.style.padding = "0"

    const commandElement = document.createElement("p")
    commandElement.innerText = cur.command
    commandElement.style.margin = "0"
    commandElement.style.padding = "0"
    commandElement.style.fontSize = "0.7rem"

    rightPanel.appendChild(descriptionElement)
    rightPanel.appendChild(commandElement)

    wrapper.appendChild(leftPanel)
    wrapper.appendChild(rightPanel)
    element.appendChild(wrapper)
  }

  const commands = useMemo(
    (): Array<CommandHint> => [
      {
        text: "# ",
        command: "/h1",
        description: "Insert Header 1",
        icon: "mdi-format-header-1",
        render
      },
      {
        text: "## ",
        command: "/h2",
        description: "Insert Header 2",
        icon: "mdi-format-header-2",
        render
      },
      {
        text: "### ",
        command: "/h3",
        description: "Insert Header 3",
        icon: "mdi-format-header-3",
        render
      },
      {
        text: "#### ",
        command: "/h4",
        description: "Insert Header 4",
        icon: "mdi-format-header-4",
        render
      },
      {
        text: "##### ",
        command: "/h5",
        description: "Insert Header 5",
        icon: "mdi-format-header-5",
        render
      },
      {
        text: "###### ",
        command: "/h6",
        description: "Insert Header 6",
        icon: "mdi-format-header-6",
        render
      },
      {
        text: "* ",
        command: "/ul",
        description: "Insert Unordered List",
        icon: "mdi-format-list-bulleted",
        render
      },
      {
        text: "1. ",
        command: "/ol",
        description: "Insert Ordered List",
        icon: "mdi-format-list-numbered",
        render
      },
      {
        text: "[Example](http://example.com/)",
        command: "/ln",
        description: "Insert Link",
        icon: "mdi-link", // TODO: Find Icon
        render
      },
      {
        text: "> ",
        command: "/blockquote",
        description: "Insert Blockquote",
        icon: "mdi-format-quote-open",
        render
      },
      {
        text: `|   |   |
|---|---|
|   |   |
`,
        command: "/table",
        description: "Insert Table",
        icon: "mdi-table",
        render
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
                (item) => (item.command + item.description).toLocaleLowerCase().indexOf(currentWord.toLowerCase()) >= 0
              )
              return {
                list: filtered,
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
  joypixels.emojiSize = "128"
  joypixels.imagePathPNG = `${getResourceHome("emoji", joypixels.emojiSize)}/`

  const render = (element: HTMLElement, data: CommandHint[], cur: CommandHint): void => {
    const wrapper = document.createElement("div")
    wrapper.style.padding = "6px 0"
    wrapper.style.display = "flex"
    wrapper.style.flexDirection = "row"
    wrapper.style.alignItems = "flex-start"
    wrapper.style.maxWidth = "100%"
    wrapper.style.minWidth = "200px"

    const leftPanel = document.createElement("div")
    const iconWrapper = document.createElement("div")
    iconWrapper.style.padding = "0 6px"
    iconWrapper.style.marginRight = "6px"
    iconWrapper.style.fontSize = "1rem"

    const iconElement = document.createRange().createContextualFragment(joypixels.shortnameToImage(cur.description))
      .firstChild as HTMLImageElement
    iconWrapper.appendChild(iconElement)
    leftPanel.appendChild(iconWrapper)

    const rightPanel = document.createElement("div")

    const descriptionElement = document.createElement("p")
    descriptionElement.innerText = cur.description
    descriptionElement.style.margin = "2px 0"
    descriptionElement.style.padding = "0"

    rightPanel.appendChild(descriptionElement)

    wrapper.appendChild(leftPanel)
    wrapper.appendChild(rightPanel)
    element.appendChild(wrapper)
  }

  const commands = useMemo(() => {
    const commands: Array<CommandHint> = []
    for (const def in EmojiDefinitions) {
      const command = joypixels.toShort(EmojiDefinitions[def])
      commands.push({
        text: `${command} `,
        command: `${command}`,
        description: `${command}`,
        render
      })
    }
    return commands
  }, [])

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

            const filtered = commands.filter(
              (item) => item.description.toLocaleLowerCase().indexOf(currentWord.toLowerCase()) >= 0
            )

            return {
              list: filtered,
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
  }, [commands, editor])
}

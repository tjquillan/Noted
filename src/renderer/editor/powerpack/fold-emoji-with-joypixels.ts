// @ts-ignore emoji-toolkit doesn't have types
import * as joypixels from "emoji-toolkit"
import "emoji-toolkit/extras/css/joypixels.min.css"
import { defaultOption, EmojiChecker, EmojiRenderer } from "vickymd/addon/fold-emoji"
import { getResourceHome } from "../../util/paths"

joypixels.emojiSize = "128"
joypixels.imagePathPNG = `${getResourceHome("emoji", joypixels.emojiSize)}/`

export const joypixelsChecker: EmojiChecker = (text) => joypixels.shortnameToUnicode(text) !== text
export const joypixelsRenderer: EmojiRenderer = (text): HTMLElement => {
  const html = joypixels.shortnameToImage(text)
  return document.createRange().createContextualFragment(html).firstChild as HTMLImageElement
}

defaultOption.emojiChecker = joypixelsChecker
defaultOption.emojiRenderer = joypixelsRenderer

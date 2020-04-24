// @ts-ignore emoji-toolkit doesn't have types
import * as joypixels from 'emoji-toolkit'
import 'emoji-toolkit/extras/css/joypixels.min.css'
import { defaultOption, EmojiChecker, EmojiRenderer } from 'vickymd/addon/fold-emoji'

export const joypixelsChecker: EmojiChecker = (text) => joypixels.shortnameToUnicode(text) !== text;
export const joypixelsRenderer: EmojiRenderer = (text): HTMLElement => {
    var html = joypixels.shortnameToImage(text)
    return document.createRange().createContextualFragment(html).firstChild as HTMLImageElement
}

defaultOption.emojiChecker = joypixelsChecker
defaultOption.emojiRenderer = joypixelsRenderer
import * as path from 'path';
import { getNotebooksHome } from './paths';
import * as fs from 'fs';
import { watch } from 'chokidar';

type WatcherHook = (path: string) => void

interface WatcherHooks {
  add?: Array<WatcherHook>
  change?: Array<WatcherHook>
}

interface Tags {
  [tag: string]: Array<string>
}

const TAGS_FILE = '.tags.json'

export class Notebook {
  private readonly path: string
  private readonly tagsPath: string
  private notes: Array<string> = []
  private tags: Tags
  private readonly notesWatcher: fs.FSWatcher
  private readonly notesHooks: WatcherHooks = { add: [] }

  static getNotebooks(): Array<string> {
    const notebooksHome = getNotebooksHome()
    return fs.readdirSync(notebooksHome)
      .filter((item) => fs.lstatSync(path.join(notebooksHome, item)).isDirectory())
  }

  static createNotebook(name: string): void {
    const notebookPath = path.join(getNotebooksHome(), name)
    fs.promises.mkdir(notebookPath)
      .then(() => {
        fs.promises.writeFile(path.join(notebookPath, TAGS_FILE), "{}")
      })
  }

  constructor(name: string) {
    this.path = path.join(getNotebooksHome(), name)
    this.tagsPath = path.join(this.path, TAGS_FILE)

    this.indexNotes()

    this.tags = this.readTags()

    this.notesWatcher = watch(this.path, {
      ignoreInitial: true
    })
    this.notesWatcher.on('add', (path: string) => {
      this.indexNotes()
      this.notesHooks.add?.map(async (hook) => hook(path))
    })
  }

  public createNote(name: string): void {
    fs.promises.writeFile(path.join(this.path, `${name}.md`), "")
  }

  public getNotes(): Array<string> {
    return this.notes
  }

  public getNote(name: string): string | null {
    if (!this.notes.includes(name)) {
      return null
    }
    return fs.readFileSync(path.join(this.path, `${name}.md`)).toString()
  }

  public addTag(tag: string, note: string): void {
    // If note already has tag then return
    if(this.tags[tag].includes(note)) {
      return
    }

    // If the tag doesnt exist yet create it
    if(this.tags[tag]) {
      this.tags[tag] = [note]
    } else {
      this.tags[tag].push(note)
    }
  }

  public removeTag(tag: string, note: string): void {
    this.tags[tag] = this.tags[tag].filter((item) => item !== note)

    if(!this.tags[tag]) {
      delete this.tags[tag]
    }
  }

  public saveTags(): void {
    fs.promises.writeFile(this.tagsPath, JSON.stringify(this.tags))
  }

  public getTags(): Tags {
    return this.tags
  }

  public addNotesHook(event: 'add', hook: WatcherHook): void {
    this.notesHooks[event]?.push(hook)
  }

  private indexNotes(): void {
    const files = fs.readdirSync(this.path).filter((file) => path.extname(file) === '.md')
    this.notes = files.map((file) => file.split('.')[0])
  }

  private readTags(): Tags {
    return JSON.parse(fs.readFileSync(this.tagsPath).toString())
  }

}
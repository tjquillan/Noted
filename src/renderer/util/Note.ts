import * as fs from 'fs';

export class Note {
  private bufferedContents: string

  constructor(public readonly name: string, private readonly path: string) {
    this.bufferedContents = fs.readFileSync(this.path).toString()
  }

  public setBufferedContents(value: string): void {
    this.bufferedContents = value
  }

  public save(): void {
    if (this.bufferedContents) {
      fs.promises.writeFile(this.path, this.bufferedContents)
    }
  }

  public getCurrentFileContents(): string {
    return fs.readFileSync(this.path).toString()
  }
}

import React, { useState, useEffect, useContext } from 'react';
import { remote } from 'electron'
import { NewNotebookDialog } from '../NewNotebookDialog';
import { NewNoteDialog } from '../NewNoteDialog';
import { NotebookSelectDialog } from '../NotebookSelectDialog';
import { Theme } from '../../types';
import { Notebook } from '../../util/Notebook';
import { NotebookProvider } from '../App/App';
import { Settings } from '../../util/Settings';

interface MenuProps {
  theme: Theme
  setTheme: (theme: Theme) => void
  setNotebook: React.Dispatch<React.SetStateAction<Notebook | null>>
}

export const Menu = (props: MenuProps): JSX.Element => {
  const notebook = useContext(NotebookProvider)
  const [newNotebookOpen, setNewNotebookOpen] = useState(false)
  const [newNoteOpen, setNewNoteOpen] = useState(false)
  const [notebookSelectOpen, setNotebookSelectOpen] = useState(false)

  useEffect(() => {
    const isMac = false
    const menu = remote.Menu.buildFromTemplate([
      {
        label: "File",
        submenu: [
          {
            label: "New",
            submenu: [
              {
                label: "Notebook",
                click(): void {
                  setNewNotebookOpen(true)
                }
              },
              {
                label: "Note",
                click(): void {
                  setNewNoteOpen(true)
                },
                visible: notebook !== null
              }
            ]
          },
          {
            label: "Open",
            submenu: [
              {
                label: "Notebook",
                click(): void {
                  setNotebookSelectOpen(true)
                }
              }
            ]
          },
          { type: 'separator' },
          isMac ? { role: 'close' } : { role: 'quit' }
        ]
      },
      {
        label: "Edit",
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ]
      },
      {
        label: "View",
        submenu: [
          { role: 'reload'},
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: "Window",
        submenu: [
          { role: 'minimize' },
          { role: 'zoom' },
          {
            label: "Theme",
            submenu: [
              {
                label: "Dark",
                type: "checkbox",
                checked: props.theme === 'dark',
                click(): void {
                  props.setTheme('dark')
                }
              },
              {
                label: "Light",
                type: "checkbox",
                checked: props.theme === 'light',
                click(): void {
                  props.setTheme('light')
                }
              }
            ]
          },
          ...(isMac ? [
            { type: 'separator' as 'separator'},
            { role: 'front' as 'front' },
            { type: 'separator' as 'separator' },
            { role: 'window' as 'window'},
          ] : [
            { role: 'close' as 'close' }
          ])
        ]
      }
    ])

    remote.Menu.setApplicationMenu(menu)
  }, [props.theme, notebook])

  function setNotebok(notebook: string): void {
    props.setNotebook(new Notebook(notebook))
    Settings.getInstance().setCurrentNotebook(notebook)
  }

  return (
    <>
      <NewNotebookDialog open={newNotebookOpen} setOpen={setNewNotebookOpen}/>
      {notebook ? <NewNoteDialog open={newNoteOpen} setOpen={setNewNoteOpen}/> : null}
      <NotebookSelectDialog onSelect={setNotebok} open={notebookSelectOpen} setOpen={setNotebookSelectOpen}/>
    </>
  )
}

import React, { useState, useEffect } from 'react';
import { remote } from 'electron'
import { NewNotebookDialog } from '../NewNotebookDialog';
import { NewNoteDialog } from '../NewNoteDialog';
import { NotebookSelectDialog } from '../NotebookSelectDialog';

interface MenuProps {
  setTheme: (darkTheme: boolean) => void
}

export const Menu = (props: MenuProps): JSX.Element => {
  const [newNotebookOpen, setNewNotebookOpen] = useState(false)
  const [newNoteOpen, setNewNoteOpen] = useState(false)
  const [notebookSelectOpen, setNotebookSelectOpen] = useState(false)
  const [ darkTheme, setDarkTheme ] = useState(true)

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
                }
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
                checked: darkTheme,
                click(): void {
                  setDarkTheme(true)
                  props.setTheme(true)
                }
              },
              {
                label: "Light",
                type: "checkbox",
                checked: !darkTheme,
                click(): void {
                  setDarkTheme(false)
                  props.setTheme(false)
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
  }, [darkTheme])

  return (
    <>
      <NewNotebookDialog open={newNotebookOpen} setOpen={setNewNotebookOpen}/>
      <NewNoteDialog open={newNoteOpen} setOpen={setNewNoteOpen}/>
      <NotebookSelectDialog open={notebookSelectOpen} setOpen={setNotebookSelectOpen}/>
    </>
  )
}

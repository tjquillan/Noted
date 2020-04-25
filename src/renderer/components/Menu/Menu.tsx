import React, { useState, useEffect } from 'react';
import { remote, MenuItem } from 'electron'
import { NewNotebookDialog } from '../NewNotebookDialog';
import { NewNoteDialog } from '../NewNoteDialog';
import { NotebookSelectDialog } from '../NotebookSelectDialog';

interface MenuProps {
  setTheme: (darkTheme: boolean) => void
}

export const Menu = (props: MenuProps) => {
  const [newNotebookOpen, setNewNotebookOpen] = useState(false)
  const [newNoteOpen, setNewNoteOpen] = useState(false)
  const [notebookSelectOpen, setNotebookSelectOpen] = useState(false)
  const [ darkTheme, setDarkTheme ] = useState(true)

  useEffect(() => {
    const menu = remote.Menu.buildFromTemplate([
      {
        label: "File",
        submenu: [
          {
            label: "New",
            submenu: [
              {
                label: "Notebook",
                click() {
                  setNewNotebookOpen(true)
                }
              },
              {
                label: "Note",
                click() {
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
                click() {
                  setNotebookSelectOpen(true)
                }
              }
            ]
          }
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
                click() {
                  setDarkTheme(true)
                  props.setTheme(true)
                }
              },
              {
                label: "Light",
                type: "checkbox",
                checked: !darkTheme,
                click() {
                  setDarkTheme(false)
                  props.setTheme(false)
                }
              }
            ]
          }
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

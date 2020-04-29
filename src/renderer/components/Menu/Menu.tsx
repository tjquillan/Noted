import React, { useState, useEffect, useContext } from 'react';
import { remote } from 'electron'
import { NewNotebookDialog } from '../NewNotebookDialog';
import { NewNoteDialog } from '../NewNoteDialog';
import { NotebookSelectDialog } from '../NotebookSelectDialog';
import { NotebookProvider } from '../App/App';
import { ThemeProvider, ThemeContext } from '../ThemeProvider/ThemeProvider';
import { ThemeIndex } from '../../theme/ThemeIndex';

interface MenuProps {
  setNotebook: (notebook: string) => void
}

export const Menu = (props: MenuProps): JSX.Element => {
  const [selectedTheme, setSelectedTheme] = useContext(ThemeProvider) as ThemeContext
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
          { role: 'reload' },
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
            submenu: ThemeIndex.getInstance().getThemes().map((theme) => {
              return {
                label: theme.name,
                type: "checkbox",
                checked: selectedTheme.id === theme.id,
                click(): void {
                  setSelectedTheme(theme)
                }
              }
            })
          },
          ...(isMac ? [
            { type: 'separator' as 'separator' },
            { role: 'front' as 'front' },
            { type: 'separator' as 'separator' },
            { role: 'window' as 'window' },
          ] : [
              { role: 'close' as 'close' }
            ])
        ]
      }
    ])

    remote.Menu.setApplicationMenu(menu)
  }, [notebook, selectedTheme.id, setSelectedTheme])

  return (
    <>
      <NewNotebookDialog open={newNotebookOpen} setOpen={setNewNotebookOpen} />
      {notebook ? <NewNoteDialog open={newNoteOpen} setOpen={setNewNoteOpen} /> : null}
      <NotebookSelectDialog onSelect={props.setNotebook} open={notebookSelectOpen} setOpen={setNotebookSelectOpen} />
    </>
  )
}

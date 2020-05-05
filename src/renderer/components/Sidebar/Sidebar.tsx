import React, { useState, useCallback, useContext, useEffect, useMemo } from "react"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { TreeView, TreeItem } from "@material-ui/lab"
import { ExpandMore, ChevronRight, Description, Book } from "@material-ui/icons"
import { NotebookProvider } from "../App"
import { Notebook } from "../../util/Notebook"
import { Note } from "../../util/Note"
import { Drawer, Chip } from "@material-ui/core"
import { Cache } from "../../util/Cache"
import { ContextMenuTreeItem } from "./ContextMenuTreeItem"
import { MenuItemConstructorOptions } from "electron"

const drawerWidth = "175px"
const useStyles = makeStyles((theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    chip: {
      margin: theme.spacing(1)
    }
  })
)
interface SidebarProps {
  setNote: (note: Note) => void
}

export const Sidebar = ({ setNote }: SidebarProps): JSX.Element => {
  // This component wont render if the context is null so we can safely cast it
  const notebook = useContext(NotebookProvider) as Notebook

  const renderNotes = useCallback(() => {
    return notebook.getNotes().map((item: string) => {
      const menuTemplate: Array<MenuItemConstructorOptions> = [
        {
          label: "Delete",
          click: (): void => {
            notebook.deleteNote(item)
          }
        }
      ]

      return (
        <ContextMenuTreeItem
          key={item}
          nodeId={`note-${item}`}
          label={item}
          icon={<Description />}
          menuTemplate={menuTemplate}
        />
      )
    })
  }, [notebook])

  const [notes, setNotes] = useState<Array<JSX.Element>>(renderNotes())

  useEffect(() => {
    setNotes(renderNotes())

    const onNotesChange = (): void => setNotes(renderNotes())

    notebook.addNotesHook("add", onNotesChange)
    notebook.addNotesHook("unlink", onNotesChange)

    return (): void => {
      notebook.removeNotesHook("add", onNotesChange)
      notebook.removeNotesHook("unlink", onNotesChange)
    }
  }, [notebook, renderNotes])

  const defaultNote = useMemo(() => Cache.getInstance().getCurrentNote(), [])
  const [selected, setSelected] = useState<Array<string>>(defaultNote ? [`note-${defaultNote}`] : [])

  const onSelect = useCallback(
    (event: React.ChangeEvent<{}>, nodeIds: string[] | string) => {
      // As we dont have multiSelect enabled according to the API this will be a string
      // so we cast as the types dont represent this
      // See: https://material-ui.com/api/tree-view/
      const id = (nodeIds as unknown) as string

      if (id.startsWith("note-") && selected[0] !== id) {
        const noteName = id.split("-")[1]
        setNote(notebook.getNote(noteName))

        if (typeof nodeIds === "string") {
          setSelected([nodeIds])
        } else {
          setSelected(nodeIds)
        }
      }
    },
    [notebook, selected, setNote]
  )

  const classes = useStyles()

  // TODO: Add tags tree
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <Chip className={classes.chip} icon={<Book />} label={notebook.name} />
      <TreeView
        defaultExpanded={["notes"]}
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        selected={selected}
        onNodeSelect={onSelect}
      >
        <TreeItem nodeId="notes" label="Notes">
          {notes}
        </TreeItem>
        {/* <TreeItem nodeId="tags" label="Tags" menuTemplate={[]} /> */}
      </TreeView>
    </Drawer>
  )
}

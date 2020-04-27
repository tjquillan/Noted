import React, { useState, useCallback, useContext, useEffect } from "react"
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DescriptionIcon from '@material-ui/icons/Description';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { NotebookProvider } from "../App";
import { Notebook } from "../../util/Notebook";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";

const drawerWidth = '175px'
const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      position: "absolute",
      top: '0px',
      left: '0px',
      height: '100%',
      width: drawerWidth,
    },
    drawerPaper: {
      width: drawerWidth
    },
  }),
)

type icon = { icon: JSX.Element } | {
  expandIcon: JSX.Element
  collapseIcon: JSX.Element
}

function renderTree(items: Array<string>, icon?: icon, isNotes?: boolean): Array<JSX.Element> {
  return items.map<JSX.Element>((item: string) => <TreeItem key={item}
                                                            nodeId={`${isNotes ? "note-" : ""}${item}`}
                                                            label={item} {...icon}/>)
}

export const Sidebar = (): JSX.Element => {
  // This component wont render if the context is null so we can safely cast it
  const notebook = useContext(NotebookProvider) as Notebook

  const getNotes = useCallback(() => renderTree(notebook.getNotes(), {icon: <DescriptionIcon/>}), [])

  const [notes, setNotes] = useState<Array<JSX.Element>>(getNotes())

  useEffect(() => {
    notebook.addNotesHook('add', () => {
      setNotes(getNotes())
    })
  }, [])

  const [selected, setSelected] = useState<Array<string>>([])

  const onSelect = useCallback((event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    // As we dont have multiSelect enabled according to the API this will be a string
    // so we cast as the types dont represent this
    // See: https://material-ui.com/api/tree-view/
    const id = nodeIds as unknown as string
    if (id.startsWith('note-')) {
      setSelected(nodeIds)
      const noteName = id.split("-")[1]
      console.log(noteName)
    }

  }, [])

  const classes = useStyles()

  // TODO: Add tags tree
  return (
    <>
      <Drawer variant="permanent"
        anchor="left"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon/>}
          defaultExpandIcon={<ChevronRightIcon/>}
          selected={selected}
          onNodeSelect={onSelect}
        >
          <TreeItem nodeId="notes" label="Notes">
            {notes}
          </TreeItem>
          {/* <TreeItem nodeId="tags" label="Tags">
          </TreeItem> */}
        </TreeView>
      </Drawer>
      <Divider orientation="vertical"/>
    </>
  )
}

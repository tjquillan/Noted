import React, { useState, useContext, useEffect } from 'react';
import { Tree, TreeNode } from '../Tree';

import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import BookIcon from '@material-ui/icons/Book';
import DescriptionIcon from '@material-ui/icons/Description';

import { FaSlackHash } from 'react-icons/fa';

// import './Sidebar.css'
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import { NotebookProvider } from '../App/App';
import { Notebook } from '../../util/Notebook';

function getNoteTreeNodes(notebook: Notebook | null): Array<TreeNode> {
  const children: Array<TreeNode> = []
  notebook?.getNotes().forEach((item: string) => {
    children.push({
      id: item.toLowerCase(),
      name: item,
    })
  })

  return children
}


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

export const Sidebar = (): JSX.Element => {
  // This component wont render if the context is null so we can safely cast it
  const notebook = useContext(NotebookProvider) as Notebook

  const classes = useStyles()
  const [notes, setNotes] = useState<Array<TreeNode>>(getNoteTreeNodes(notebook));

  useEffect(() => {
    notebook.addNotesHook('add', () => setNotes(getNoteTreeNodes(notebook)))
  }, [])

  const [tags,] = useState<Array<TreeNode>>([]);

  const notebookData = {
    id: 'root',
    name: 'Notes',
    children: notes
  }
  const tagData = {
    id: 'root',
    name: 'Tags',
    children: tags
  }

  return (
    <>
      <Drawer variant="permanent"
        anchor="left"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Tree nodes={notebookData} hasChildrenExpandIcon={<BookIcon />}
          hasChildrenCollapseIcon={<ImportContactsIcon />} noChildrenIcon={<DescriptionIcon />} />
        <Tree nodes={tagData} hasChildrenExpandIcon={<FaSlackHash />}
          hasChildrenCollapseIcon={<FaSlackHash />} noChildrenIcon={<DescriptionIcon />} />
      </Drawer>
      <Divider orientation="vertical"/>
    </>
  )
}

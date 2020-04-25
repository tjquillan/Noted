import React, { useState } from 'react';
import { Tree, TreeNode } from '../Tree';

import { getNotebooksHome } from '../../util/paths';

import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import BookIcon from '@material-ui/icons/Book';
import DescriptionIcon from '@material-ui/icons/Description';

import { FaSlackHash } from 'react-icons/fa';

import * as path from 'path'
import * as fs from 'fs'

// import './Sidebar.css'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

const DATA_HOME = getNotebooksHome()

function getNotebookTreeNodes(nodePath?: string) {
  const dirPath = nodePath ? nodePath : DATA_HOME
  const dirContents = fs.readdirSync(dirPath)

  let children: Array<TreeNode> = []
  dirContents.forEach((item: string) => {
    const itemPath = path.join(dirPath, item)
    const isDir = fs.lstatSync(itemPath).isDirectory()
    children.push({
      id: item.toLowerCase(),
      name: item,
      children: isDir ? getNotebookTreeNodes(itemPath) : undefined
    })
  })

  return children
}

const drawerWidth = '175px'
const useStyles = makeStyles((theme: Theme) =>
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
  const classes = useStyles()
  const [notebookData,] = useState<TreeNode>({
    id: 'root',
    name: 'Notebooks',
    children: getNotebookTreeNodes()
  });
  const [tagData,] = useState<TreeNode>({
    id: 'root',
    name: 'Tags',
  });

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

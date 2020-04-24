import React, { useState } from 'react';
import { Tree, TreeNode } from '../Tree';

import { getDataHome } from '../../util/paths';

import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import BookIcon from '@material-ui/icons/Book';
import DescriptionIcon from '@material-ui/icons/Description';

import { FaSlackHash } from 'react-icons/fa';

import * as path from 'path'
import * as fs from 'fs'

import './Sidebar.css'

const DATA_HOME = getDataHome("Notebooks")

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

export const Sidebar = (): JSX.Element => {
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
        <div className="Sidebar">
            <Tree nodes={notebookData} hasChildrenExpandIcon={<BookIcon/>}
                  hasChildrenCollapseIcon={<ImportContactsIcon/>} noChildrenIcon={<DescriptionIcon/>}/>
            <Tree nodes={tagData} hasChildrenExpandIcon={<FaSlackHash/>}
                  hasChildrenCollapseIcon={<FaSlackHash/>} noChildrenIcon={<DescriptionIcon/>}/>
        </div>
    )
}

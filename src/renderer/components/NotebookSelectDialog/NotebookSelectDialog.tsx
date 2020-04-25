import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import BookIcon from '@material-ui/icons/Book';

import * as path from 'path'
import * as fs from 'fs'
import { getNotebooksHome } from '../../util/paths';

interface NotebookSelectDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function renderNotebooks(onClose: () => void) {
  const notebookHome = getNotebooksHome()
  let notebooks: Array<JSX.Element> = []
  fs.readdirSync(notebookHome)
    .filter((item) => fs.lstatSync(path.join(notebookHome, item)).isDirectory())
    .forEach((item) => {
      notebooks.push(
        <ListItem button onClick={onClose} key={item}>
          <ListItemAvatar>
            <Avatar>
              <BookIcon/>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item}/>
        </ListItem>
      )
    })
    return notebooks
}

export const NotebookSelectDialog = (props: NotebookSelectDialogProps): JSX.Element => {
  function onClose() {
    props.setOpen(false)
  }

  return (
    <Dialog open={props.open} onClose={onClose} aria-labelledby="simple-dialog-title">
      <DialogTitle id="simple-dialog-title">Select Notebook</DialogTitle>
      <List>
        {renderNotebooks(onClose)}
      </List>
    </Dialog>
  )
}

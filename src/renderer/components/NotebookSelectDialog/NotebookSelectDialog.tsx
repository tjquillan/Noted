import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import BookIcon from '@material-ui/icons/Book';
import { Notebook } from '../../util/Notebook';

interface NotebookSelectDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSelect: (notebook: string) => void
}

function renderNotebooks(onSelect: (notebook: string) => void): Array<JSX.Element> {
  const notebooks: Array<JSX.Element> = []

  Notebook.getNotebooks()
    .forEach((item) => {
      notebooks.push(
        <ListItem button onClick={(): void => onSelect(item)} key={item}>
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
  function onClose(): void {
    props.setOpen(false)
  }

  function onSelect(notebook: string): void {
    onClose()
    props.onSelect(notebook)
  }

  return (
    <Dialog open={props.open} onClose={onClose} aria-labelledby="simple-dialog-title">
      <DialogTitle id="simple-dialog-title">Select Notebook</DialogTitle>
      <List>
        {renderNotebooks(onSelect)}
      </List>
    </Dialog>
  )
}

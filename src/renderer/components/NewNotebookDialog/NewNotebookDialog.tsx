import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getNotebooksHome } from '../../util/paths';
import {promises as fs} from 'fs'
import * as path from 'path';

interface NewNotebookDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const NewNotebookDialog = (props: NewNotebookDialogProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>()

  const handleClose = () => {
    props.setOpen(false);
  }

  const handleCreate = () => {
    if (inputRef.current?.value) {
      handleClose()
      const notebookName = inputRef.current?.value as string

      fs.mkdir(path.join(getNotebooksHome(), notebookName))
    }
  }

  return (
    <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create Notebook</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the name of your new notebook.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Notebook Name"
          type="text"
          fullWidth
          required
          inputRef={inputRef}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreate} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

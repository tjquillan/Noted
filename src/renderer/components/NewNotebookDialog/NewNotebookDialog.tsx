import React, { useRef, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Notebook } from '../../util/Notebook';

interface NewNotebookDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const NewNotebookDialog = (props: NewNotebookDialogProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>()

  const onClose = useCallback(() => {
    props.setOpen(false);
  }, [props.setOpen])

  const onCreate = useCallback(() => {
    if (inputRef.current?.value) {
      onClose()
      const notebookName = inputRef.current?.value as string

      Notebook.createNotebook(notebookName)
    }
  }, [inputRef])

  return (
    <Dialog open={props.open} onClose={onClose} aria-labelledby="form-dialog-title">
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
        <Button onClick={onCreate} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

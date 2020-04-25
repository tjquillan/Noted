import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface NewNoteDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const NewNoteDialog = (props: NewNoteDialogProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>()

  function onClose(): void {
    props.setOpen(false)
  }

  function onCreate(): void {
    if (inputRef.current?.value) {
      onClose()
      // const notebookName = inputRef.current?.value as string

      // fs.writeFile(path.join(getNotebooksHome()))
    }
  }

  return (
    <Dialog open={props.open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create Note</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the name of your new note.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Note Name"
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
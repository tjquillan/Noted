import React, { useRef, useCallback, useState } from "react"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import { Notebook } from "../../util/Notebook"

interface NewNotebookDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setNotebook: (notebook: string) => void
}

export const NewNotebookDialog = ({ open, setOpen, setNotebook }: NewNotebookDialogProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)

  const onClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const [notebookName, setNotebookName] = useState<string | null>(null)
  const [openNotebookOpen, setOpenNotebookOpen] = useState(false)

  const onOpenNotebookClose = useCallback(() => {
    setOpenNotebookOpen(false)
  }, [])

  const onNotebookOpen = useCallback(() => {
    onOpenNotebookClose()
    if (notebookName) {
      setNotebook(notebookName)
    }
  }, [notebookName, onOpenNotebookClose, setNotebook])

  const onCreate = useCallback(() => {
    if (inputRef.current?.value) {
      onClose()
      const notebookName = inputRef.current?.value as string

      setNotebookName(notebookName)
      Notebook.createNotebook(notebookName)

      setOpenNotebookOpen(true)
    }
  }, [onClose])

  const onKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        onCreate()
      }
    },
    [onCreate]
  )

  return (
    <>
      <Dialog open={open} onClose={onClose} onKeyPress={onKeyPress} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Notebook</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the name of your new notebook.</DialogContentText>
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
      <Dialog open={openNotebookOpen} onClose={onOpenNotebookClose}>
        <DialogTitle id="form-dialog-title">Open Notebook?</DialogTitle>
        <DialogContentText style={{ margin: "5px" }}>Do you want to open your new notebook?</DialogContentText>
        <DialogActions>
          <Button onClick={onNotebookOpen} color="primary">
            Yes
          </Button>
          <Button onClick={onOpenNotebookClose} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

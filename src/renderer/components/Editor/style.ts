import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      '.CodeMirror .CodeMirror-cursor': {
        borderLeft: `2px solid ${theme.palette.info.dark}`
      }
    },
    editorPanel: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: 0,
    },
    editorWrapper: {
      display: 'block',
      backgroundColor: theme.palette.background.paper,
      "& .CodeMirror-gutters": {
        display: "none",
      },
      "& .CodeMirror-code": {
        width: "100%",
      },
      "& .CodeMirror": {
        height: "100%",
        padding: theme.spacing(0, 1.9), // 1.9 as 2 produces a white bar on the left
      },
      "& .CodeMirror-placeholder": {
        color: `${theme.palette.action.disabled} !important`,
      }
    },
    editor: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.palette.background.default,
      border: "none"
    },
    bottomPanel: {
      position: "relative",
      padding: theme.spacing(0.5, 1),
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.palette.background.paper,
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    cursorPositionInfo: {
      zIndex: 150,
    },
  }),
);

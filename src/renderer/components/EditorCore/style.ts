import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const previewZIndex = 99;
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
      "flex": 1,
      "overflow": "auto",
      "backgroundColor": theme.palette.background.paper,
      "& .CodeMirror-gutters": {
        display: "none",
      },
      "& .CodeMirror-code": {
        width: "100%",
      },
      "& .CodeMirror": {
        height: "100%",
        padding: theme.spacing(0, 2),
        [theme.breakpoints.down("sm")]: {
          padding: theme.spacing(1),
        }
      },
      "& .CodeMirror-vscrollbar": {
        // display: "none !important",
      },
      "& .CodeMirror-placeholder": {
        color: `${theme.palette.action.disabled} !important`,
      }
    },
    presentation: {
      padding: "0 !important",
    },
    fullScreen: {
      position: "fixed",
      width: "100%",
      height: "100%",
      left: "0",
      top: "0",
      zIndex: 2000,
      overflow: "auto",
      padding: "0",
    },

    editor: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.palette.background.default,
      border: "none"
    },
    preview: {
      position: "relative",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      border: "none",
      overflow: "auto !important",
      padding: theme.spacing(2),
      zIndex: previewZIndex,
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(1),
      },
      // gridArea: "2 / 2 / 3 / 3"
    },
    backBtn: {
      marginRight: "8px",
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    menuItemOverride: {
      "cursor": "default",
      "padding": `0 0 0 ${theme.spacing(2)}px`,
      "&:hover": {
        backgroundColor: "inherit",
      },
    },
    menuItemTextField: {
      paddingRight: theme.spacing(2),
    },
    // math
    floatWin: {
      position: "fixed",
      zIndex: 100,
      background: "#EEE",
      backgroundImage: "linear-gradient(to bottom, #FFF, #EEE)",
      borderRadius: "5px",
      overflow: "hidden",
      boxShadow: "0 3px 7px rgba(0,0,0,0.3)",
      minWidth: "200px",
      maxWidth: "70%",
    },
    floatWinHidden: {
      display: "none",
    },
    floatWinTitle: {
      display: "flex",
      alignItems: "center",
      background: "#579",
      backgroundImage: "linear-gradient(to bottom, #68A, #579)",
      color: "#eee",
    },
    floatWinContent: {
      maxHeight: "80vh",
      overflow: "auto",
      padding: "10px 20px",
    },
    floatWinClose: {
      color: "#eee",
    },
    iconBtnSVG: {
      color: theme.palette.text.secondary,
    },
  }),
);

import React, { useRef, useEffect, useMemo } from "react"
import { TreeItem, TreeItemProps } from "@material-ui/lab"
import { MenuItemConstructorOptions, remote } from "electron"

interface ContextMenuTreeItemProps extends TreeItemProps {
  menuTemplate: Array<MenuItemConstructorOptions>
}

export const ContextMenuTreeItem = ({ menuTemplate, ...treeItemProps }: ContextMenuTreeItemProps): JSX.Element => {
  const ref = useRef<HTMLLIElement>(null)

  const menu = useMemo(() => remote.Menu.buildFromTemplate(menuTemplate), [menuTemplate])

  useEffect(() => {
    const currentRef = ref.current

    const onContextMenu = (): void => {
      menu.popup()
    }

    currentRef?.addEventListener("contextmenu", onContextMenu)

    return (): void => {
      currentRef?.removeEventListener("contextmenu", onContextMenu)
    }
  }, [menu])

  return <TreeItem {...treeItemProps} ref={ref} />
}

import React, { PropsWithChildren, useRef, useMemo, useEffect } from "react"
import { MenuItemConstructorOptions, remote } from "electron"

interface ContextMenuAreaProps {
  className?: string
  style?: React.CSSProperties
  menuTemplate: Array<MenuItemConstructorOptions>
}

export const ContextMenuArea = (props: PropsWithChildren<ContextMenuAreaProps>): JSX.Element => {
  const menu = useMemo(() => remote.Menu.buildFromTemplate(props.menuTemplate), [props.menuTemplate])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onContextMenu = (event: MouseEvent): void => {
      event.preventDefault()
      menu.popup()
    }

    const divElement = ref.current

    divElement?.addEventListener("contextmenu", onContextMenu)

    return (): void => {
      divElement?.removeEventListener("contextmenu", onContextMenu)
    }
  }, [menu])

  return (
    <div className={props.className} style={{ ...props.style }} ref={ref}>
      {props.children}
    </div>
  )
}

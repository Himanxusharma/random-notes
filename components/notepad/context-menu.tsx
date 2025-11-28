"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  Scissors,
  Copy,
  Clipboard,
  MousePointer,
  Trash2,
  AlignLeft,
  ChevronRight,
  X,
  XCircle,
  Edit2,
  Pin,
  FolderOpen,
  Files,
  FolderInput,
  Highlighter,
  Type,
  RefreshCw,
} from "lucide-react"

type ContextMenuItem = {
  label: string
  icon?: ReactNode
  onClick: () => void
  submenu?: ContextMenuItem[]
  divider?: false
  destructive?: boolean
} | {
  divider: true
  label?: never
  icon?: never
  onClick?: never
  submenu?: never
  destructive?: never
}

interface ContextMenuProps {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  // Adjust position to stay within viewport
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let adjustedX = x
      let adjustedY = y

      if (rect.right > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10
      }
      if (rect.bottom > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10
      }

      menuRef.current.style.left = `${Math.max(10, adjustedX)}px`
      menuRef.current.style.top = `${Math.max(10, adjustedY)}px`
    }
  }, [x, y])

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-[200px] rounded-xl glassmorphic shadow-soft-lg border border-border/50 animate-in fade-in-0 zoom-in-95 duration-200"
      style={{ left: x, top: y }}
    >
      <div className="py-1.5">
        {items.map((item, index) => (
          <div key={index}>
            {item.divider ? (
              <div className="h-px bg-border/50 my-1.5" />
            ) : (
              <ContextMenuItemComponent item={item} onClose={onClose} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ContextMenuItemComponent({ item, onClose }: { item: ContextMenuItem; onClose: () => void }) {
  const [showSubmenu, setShowSubmenu] = useState(false)
  const itemRef = useRef<HTMLButtonElement>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleClick = () => {
    if (!('divider' in item && item.divider) && !item.submenu && item.onClick) {
      item.onClick()
      onClose()
    }
  }

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    if (item.submenu) {
      setShowSubmenu(true)
    }
  }

  const handleMouseLeave = () => {
    if (item.submenu) {
      // Add a small delay before hiding to make clicking easier
      hideTimeoutRef.current = setTimeout(() => {
        setShowSubmenu(false)
      }, 150)
    }
  }

  return (
    <div className="relative">
      <button
        ref={itemRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-all duration-200 hover:bg-sidebar-accent/60 hover:border-l-2 hover:border-accent context-menu-item ${
          item.destructive ? "text-destructive hover:text-destructive" : "text-foreground"
        }`}
      >
        {item.icon && <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">{item.icon}</span>}
        <span className="flex-1 text-left">{item.label}</span>
        {item.submenu && <ChevronRight className="w-3.5 h-3.5 ml-auto" strokeWidth={1.5} />}
      </button>

      {item.submenu && showSubmenu && (
        <div
          className="absolute left-full top-0 ml-1 min-w-[180px] z-[200] rounded-xl glassmorphic shadow-soft-lg border border-border/50 animate-in fade-in-0 slide-in-from-left-1 duration-150"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="py-1.5">
            {item.submenu.map((subItem, subIndex) => (
              <button
                key={subIndex}
                onClick={(e) => {
                  e.stopPropagation()
                  if ('onClick' in subItem && subItem.onClick) {
                    subItem.onClick()
                  }
                  onClose()
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm transition-all duration-200 hover:bg-sidebar-accent/60 hover:border-l-2 hover:border-accent text-foreground context-menu-item"
              >
                {subItem.icon && (
                  <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">{subItem.icon}</span>
                )}
                <span className="flex-1 text-left">{subItem.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Context menu builders for different scenarios

export function buildEditorContextMenu(
  hasSelection: boolean,
  onCut: () => void,
  onCopy: () => void,
  onPaste: () => void,
  onSelectAll: () => void,
  onDuplicateLine: () => void,
  onDeleteLine: () => void,
  onFormat: () => void,
  onToggleWordWrap: () => void,
  onClearAll: () => void,
): ContextMenuItem[] {
  return [
    {
      label: "Cut",
      icon: <Scissors className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onCut,
    },
    {
      label: "Copy",
      icon: <Copy className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onCopy,
    },
    {
      label: "Paste",
      icon: <Clipboard className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onPaste,
    },
    { divider: true },
    {
      label: "Select All",
      icon: <MousePointer className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onSelectAll,
    },
    { divider: true },
    {
      label: "Duplicate Line",
      icon: <Files className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onDuplicateLine,
    },
    {
      label: "Delete Line",
      icon: <Trash2 className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onDeleteLine,
      destructive: true,
    },
    { divider: true },
    {
      label: "Format Document",
      icon: <AlignLeft className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onFormat,
    },
    {
      label: "Toggle Word Wrap",
      icon: <RefreshCw className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onToggleWordWrap,
    },
    { divider: true },
    {
      label: "Clear All",
      icon: <Trash2 className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onClearAll,
      destructive: true,
    },
  ]
}

export function buildSelectionContextMenu(
  onCut: () => void,
  onCopy: () => void,
  onPaste: () => void,
  onHighlight: (color: string) => void,
  onClearFormatting: () => void,
  onConvertCase: (caseType: "upper" | "lower" | "title") => void,
  onClearAll: () => void,
): ContextMenuItem[] {
  return [
    {
      label: "Cut",
      icon: <Scissors className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onCut,
    },
    {
      label: "Copy",
      icon: <Copy className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onCopy,
    },
    {
      label: "Paste",
      icon: <Clipboard className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onPaste,
    },
    { divider: true },
    {
      label: "Highlight",
      icon: <Highlighter className="w-4 h-4" strokeWidth={1.5} />,
      onClick: () => {},
      submenu: [
        {
          label: "Yellow",
          icon: <span className="w-4 h-4 rounded-full bg-yellow-300 border border-yellow-400" />,
          onClick: () => onHighlight("yellow"),
        },
        {
          label: "Green",
          icon: <span className="w-4 h-4 rounded-full bg-green-300 border border-green-400" />,
          onClick: () => onHighlight("green"),
        },
        {
          label: "Blue",
          icon: <span className="w-4 h-4 rounded-full bg-blue-300 border border-blue-400" />,
          onClick: () => onHighlight("blue"),
        },
        {
          label: "Pink",
          icon: <span className="w-4 h-4 rounded-full bg-pink-300 border border-pink-400" />,
          onClick: () => onHighlight("pink"),
        },
      ],
    },
    {
      label: "Clear Formatting",
      icon: <XCircle className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onClearFormatting,
    },
    { divider: true },
    {
      label: "Change Case",
      icon: <Type className="w-4 h-4" strokeWidth={1.5} />,
      onClick: () => {},
      submenu: [
        {
          label: "ABC (UPPERCASE)",
          onClick: () => onConvertCase("upper"),
        },
        {
          label: "abc (lowercase)",
          onClick: () => onConvertCase("lower"),
        },
        {
          label: "Abc (Title Case)",
          onClick: () => onConvertCase("title"),
        },
      ],
    },
    { divider: true },
    {
      label: "Clear All",
      icon: <Trash2 className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onClearAll,
      destructive: true,
    },
  ]
}

export function buildTabContextMenu(
  onClose: () => void,
  onCloseOthers: () => void,
  onCloseRight: () => void,
  onRename: () => void,
  onPin: () => void,
): ContextMenuItem[] {
  return [
    {
      label: "Close Tab",
      icon: <X className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onClose,
    },
    {
      label: "Close Other Tabs",
      icon: <XCircle className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onCloseOthers,
    },
    {
      label: "Close Tabs to the Right",
      icon: <ChevronRight className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onCloseRight,
    },
    { divider: true },
    {
      label: "Rename",
      icon: <Edit2 className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onRename,
    },
    {
      label: "Pin Tab",
      icon: <Pin className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onPin,
    },
  ]
}

export function buildFileContextMenu(
  onOpen: () => void,
  onRename: () => void,
  onDuplicate: () => void,
  onMove: () => void,
  onDelete: () => void,
): ContextMenuItem[] {
  return [
    {
      label: "Open",
      icon: <FolderOpen className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onOpen,
    },
    { divider: true },
    {
      label: "Rename",
      icon: <Edit2 className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onRename,
    },
    {
      label: "Duplicate",
      icon: <Files className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onDuplicate,
    },
    {
      label: "Move to Folder",
      icon: <FolderInput className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onMove,
    },
    { divider: true },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" strokeWidth={1.5} />,
      onClick: onDelete,
      destructive: true,
    },
  ]
}

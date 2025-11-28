"use client"

import { useState, useEffect } from "react"
import type { FileType } from "../notepad-app"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, Globe } from "lucide-react"

type Timezone = "LOCAL" | "EST" | "IST"

interface BottomStatusBarProps {
  content: string
  fileType: FileType
  autoSave: boolean
  onToggleAutoSave: () => void
}

export function BottomStatusBar({ content, fileType, autoSave, onToggleAutoSave }: BottomStatusBarProps) {
  const lines = content.split("\n").length
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const chars = content.length

  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [currentTime, setCurrentTime] = useState("")
  const [currentTimeShort, setCurrentTimeShort] = useState("")
  const [timezone, setTimezone] = useState<Timezone>("LOCAL")

  // Timezone configurations
  const timezoneConfig = {
    LOCAL: { label: "Local", zone: undefined },
    EST: { label: "EST", zone: "America/New_York" },
    IST: { label: "IST", zone: "Asia/Kolkata" },
  }

  // Cycle through timezones
  const cycleTimezone = () => {
    const zones: Timezone[] = ["LOCAL", "EST", "IST"]
    const currentIndex = zones.indexOf(timezone)
    const nextIndex = (currentIndex + 1) % zones.length
    setTimezone(zones[nextIndex])
  }

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const config = timezoneConfig[timezone]
      
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: config.zone,
      }
      
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: config.zone,
      }
      
      const dateStr = now.toLocaleDateString("en-US", dateOptions)
      const timeStr = now.toLocaleTimeString("en-US", timeOptions)
      setCurrentTime(`${dateStr} • ${timeStr}`)
      setCurrentTimeShort(timeStr)
    }

    updateTime() // Initial call
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [timezone])

  useEffect(() => {
    const calculateCursorPosition = () => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      // Find the contenteditable editor
      const editor = document.querySelector('[contenteditable="true"]')
      if (!editor || !editor.contains(selection.anchorNode)) return

      // Get all text content up to the cursor position
      const range = selection.getRangeAt(0)
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(editor)
      preCaretRange.setEnd(range.startContainer, range.startOffset)
      
      // Get text before cursor, converting <br> to newlines
      const tempDiv = document.createElement("div")
      tempDiv.appendChild(preCaretRange.cloneContents())
      let textBeforeCursor = tempDiv.innerHTML
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]*>/g, "")
      
      // Calculate line and column
      const linesArray = textBeforeCursor.split("\n")
      const currentLine = linesArray.length
      const currentColumn = linesArray[linesArray.length - 1].length + 1

      setCursorPosition({ line: currentLine, column: currentColumn })
    }

    // Listen for selection changes
    document.addEventListener("selectionchange", calculateCursorPosition)

    // Also listen for keyboard and mouse events on the editor
    const editor = document.querySelector('[contenteditable="true"]')
    if (editor) {
      editor.addEventListener("keyup", calculateCursorPosition)
      editor.addEventListener("mouseup", calculateCursorPosition)
      editor.addEventListener("input", calculateCursorPosition)
    }

    return () => {
      document.removeEventListener("selectionchange", calculateCursorPosition)
      if (editor) {
        editor.removeEventListener("keyup", calculateCursorPosition)
        editor.removeEventListener("mouseup", calculateCursorPosition)
        editor.removeEventListener("input", calculateCursorPosition)
      }
    }
  }, [])

  return (
    <TooltipProvider delayDuration={300}>
      <footer className="flex items-center justify-between border-t border-border bg-card px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 text-[10px] sm:text-xs text-muted-foreground">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-6 flex-1 min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="hidden sm:inline cursor-help">{words} words</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Word count</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{chars} chars</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Character count</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="hidden md:inline cursor-help">
                Ln {cursorPosition.line}, Col {cursorPosition.column}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cursor position</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="uppercase font-medium cursor-help">{fileType}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>File type</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Center Section - Date & Time */}
        <div className="flex items-center justify-center flex-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={cycleTimezone}
                className="flex items-center gap-1 sm:gap-2 font-medium text-foreground/70 hover:text-foreground transition-colors px-1 sm:px-2 py-0.5 sm:py-1 rounded-md hover:bg-muted/50"
              >
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" strokeWidth={1.5} />
                {/* Full date & time on larger screens */}
                <span className="hidden md:inline">{currentTime}</span>
                {/* Time with seconds on smaller screens */}
                <span className="md:hidden text-[10px] sm:text-xs">{currentTimeShort}</span>
                <span className="hidden sm:flex items-center gap-1 px-1 sm:px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] sm:text-[10px] font-semibold flex-shrink-0">
                  <Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3" strokeWidth={1.5} />
                  {timezoneConfig[timezone].label}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to switch timezone (Local / EST / IST)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 md:gap-3 flex-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="hidden sm:inline text-[10px] sm:text-xs">Auto-save</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Automatically save changes</p>
            </TooltipContent>
          </Tooltip>
          <Switch checked={autoSave} onCheckedChange={onToggleAutoSave} className="scale-75 sm:scale-100" />
        </div>
      </footer>
    </TooltipProvider>
  )
}

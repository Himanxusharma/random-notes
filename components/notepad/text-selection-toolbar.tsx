"use client"

import { Bold, Italic, Highlighter, List, Heading } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TextSelectionToolbarProps {
  x: number
  y: number
  selectedText: string
  onClose: () => void
  onBold: () => void
  onItalic: () => void
  onHighlight: () => void
  onBulletPoints: () => void
  onHeading: () => void
}

export function TextSelectionToolbar({
  x,
  y,
  onBold,
  onItalic,
  onHighlight,
  onBulletPoints,
  onHeading,
}: TextSelectionToolbarProps) {
  // Keep toolbar within viewport bounds
  const toolbarWidth = 200
  const toolbarHeight = 40
  const padding = 10
  
  const adjustedX = Math.min(Math.max(toolbarWidth / 2 + padding, x), window.innerWidth - toolbarWidth / 2 - padding)
  const adjustedY = Math.max(toolbarHeight + padding, y)

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className="fixed z-50 flex items-center gap-0.5 sm:gap-1 rounded-lg border border-border glassmorphic p-0.5 sm:p-1 shadow-soft-lg animate-in fade-in-50 slide-in-from-bottom-2 duration-200"
        style={{
          left: `${adjustedX}px`,
          top: `${adjustedY}px`,
          transform: "translate(-50%, -100%)",
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 btn-hover-lift" onClick={onBold}>
              <Bold className="h-3 w-3" strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 btn-hover-lift" onClick={onItalic}>
              <Italic className="h-3 w-3" strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 btn-hover-lift" onClick={onHighlight}>
              <Highlighter className="h-3 w-3" strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Highlight</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 btn-hover-lift" onClick={onBulletPoints}>
              <List className="h-3 w-3" strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bullet Points</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 btn-hover-lift" onClick={onHeading}>
              <Heading className="h-3 w-3" strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

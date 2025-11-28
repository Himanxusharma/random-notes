"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Clock, MoreVertical, Trash2, Edit2, Copy, Lock, Unlock, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { NoteFile } from "../notepad-app"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ContextMenu, buildFileContextMenu } from "./context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface LeftSidebarProps {
  files: NoteFile[]
  activeFileId: string
  onSelectFile: (id: string) => void
  onDeleteFile: (id: string) => void
  onRenameFile: (id: string, newName: string) => void
  onDuplicateFile: (id: string) => void
  onDecryptFile: (id: string, password: string) => boolean
  onCloseSidebar: () => void
  content: string
}

export function LeftSidebar({
  files,
  activeFileId,
  onSelectFile,
  onDeleteFile,
  onRenameFile,
  onDuplicateFile,
  onDecryptFile,
  onCloseSidebar,
  content,
}: LeftSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null)
  const [unlockDialog, setUnlockDialog] = useState<{ open: boolean; fileId: string; fileName: string } | null>(null)
  const [unlockPassword, setUnlockPassword] = useState("")
  const [unlockError, setUnlockError] = useState("")

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const charCount = content.length

  const startRename = (file: NoteFile) => {
    setEditingId(file.id)
    setEditName(file.name)
  }

  const finishRename = () => {
    if (editingId && editName.trim()) {
      onRenameFile(editingId, editName.trim())
    }
    setEditingId(null)
  }

  const handleFileContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY, fileId })
  }

  const handleDuplicate = (fileId: string) => {
    onDuplicateFile(fileId)
  }

  const handleMove = (fileId: string) => {
    // Note: Move to folder would require folder structure implementation
    // For now, we'll show a notification that this feature requires folders
    alert("Move to folder requires folder structure. Create folders first!")
  }

  const handleFileClick = (file: NoteFile) => {
    if (file.encrypted) {
      // Show unlock dialog for encrypted files
      setUnlockDialog({ open: true, fileId: file.id, fileName: file.name })
      setUnlockPassword("")
      setUnlockError("")
    } else {
      onSelectFile(file.id)
    }
  }

  const handleUnlock = () => {
    if (!unlockDialog || !unlockPassword.trim()) {
      setUnlockError("Please enter a password")
      return
    }

    const success = onDecryptFile(unlockDialog.fileId, unlockPassword)
    if (success) {
      setUnlockDialog(null)
      setUnlockPassword("")
      setUnlockError("")
      onSelectFile(unlockDialog.fileId)
    } else {
      setUnlockError("Wrong password. Please try again.")
    }
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onCloseSidebar}
      />
      <aside className="fixed md:relative inset-y-0 left-0 z-50 w-72 max-w-[85vw] md:max-w-none border-r border-border glassmorphic shadow-soft flex flex-col sidebar-expand md:z-auto">
      <div className="p-4 md:p-6 border-b border-sidebar-border">
        <h2 className="text-sm font-medium text-sidebar-foreground mb-4">Files</h2>
        <div className="space-y-1">
          {files.map((file, index) => (
            <div
              key={file.id}
              className={`group flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer tab-slide-in ${
                file.id === activeFileId
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                  : "hover:bg-sidebar-accent/50"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleFileClick(file)}
              onContextMenu={(e) => handleFileContextMenu(e, file.id)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {file.encrypted ? (
                  <Lock className="h-4 w-4 flex-shrink-0 text-amber-500" strokeWidth={1.5} />
                ) : (
                  <FileText className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
                )}
                {editingId === file.id ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={finishRename}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") finishRename()
                      if (e.key === "Escape") setEditingId(null)
                    }}
                    className="h-6 text-sm"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="text-sm truncate">{file.name}</span>
                )}
                {file.encrypted && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    Encrypted
                  </span>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glassmorphic shadow-soft-lg">
                  <DropdownMenuItem onClick={() => startRename(file)}>
                    <Edit2 className="h-3 w-3 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicate(file.id)}>
                    <Copy className="h-3 w-3 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteFile(file.id)} className="text-destructive">
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 border-b border-sidebar-border">
        <h2 className="text-sm font-medium text-sidebar-foreground mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4" strokeWidth={1.5} />
          Recent
        </h2>
        <div className="space-y-2">
          {files.slice(0, 3).map((file) => (
            <button
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className="w-full text-left text-xs text-muted-foreground hover:text-foreground transition-colors truncate"
            >
              {file.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 mt-auto">
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Words</span>
            <span className="font-medium">{wordCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Characters</span>
            <span className="font-medium">{charCount}</span>
          </div>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={buildFileContextMenu(
            () => onSelectFile(contextMenu.fileId),
            () => {
              const file = files.find((f) => f.id === contextMenu.fileId)
              if (file) startRename(file)
            },
            () => handleDuplicate(contextMenu.fileId),
            () => handleMove(contextMenu.fileId),
            () => onDeleteFile(contextMenu.fileId),
          )}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Unlock Encrypted File Dialog */}
      <Dialog open={unlockDialog?.open || false} onOpenChange={(open) => !open && setUnlockDialog(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md glassmorphic">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-500" />
              Unlock File
            </DialogTitle>
            <DialogDescription>
              Enter password to unlock "{unlockDialog?.fileName}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="unlock-password">Password</Label>
              <Input
                id="unlock-password"
                type="password"
                placeholder="Enter password..."
                value={unlockPassword}
                onChange={(e) => {
                  setUnlockPassword(e.target.value)
                  setUnlockError("")
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUnlock()
                }}
                autoFocus
              />
            </div>
            {unlockError && (
              <p className="text-sm text-destructive flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {unlockError}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setUnlockDialog(null)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleUnlock} className="flex-1">
              <Unlock className="h-4 w-4 mr-2" />
              Unlock
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
    </>
  )
}

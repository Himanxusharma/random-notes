"use client"

import { useState } from "react"
import { Lock, Unlock, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { NoteFile } from "../notepad-app"

interface EncryptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: NoteFile
  onEncrypt: (id: string, encryptedContent: string) => void
  onDecrypt: (id: string, decryptedContent: string) => void
}

// Note: This is a demonstration - for production use, consider Web Crypto API
function simpleEncrypt(text: string, password: string): string {
  const encoded = btoa(unescape(encodeURIComponent(text)))
  let result = ""
  for (let i = 0; i < encoded.length; i++) {
    result += String.fromCharCode(encoded.charCodeAt(i) ^ password.charCodeAt(i % password.length))
  }
  return btoa(result)
}

function simpleDecrypt(encryptedText: string, password: string): string | null {
  try {
    const decoded = atob(encryptedText)
    let result = ""
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ password.charCodeAt(i % password.length))
    }
    return decodeURIComponent(escape(atob(result)))
  } catch {
    return null
  }
}

export function EncryptionDialog({ open, onOpenChange, file, onEncrypt, onDecrypt }: EncryptionDialogProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [mode, setMode] = useState<"encrypt" | "decrypt">(file?.encrypted ? "decrypt" : "encrypt")
  const [error, setError] = useState("")

  const handleEncrypt = () => {
    setError("")

    if (!password) {
      setError("Please enter a password")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters")
      return
    }

    const encrypted = simpleEncrypt(file.content, password)
    onEncrypt(file.id, encrypted)
    setPassword("")
    setConfirmPassword("")
    onOpenChange(false)
  }

  const handleDecrypt = () => {
    setError("")

    if (!password) {
      setError("Please enter the password")
      return
    }

    if (!file.encryptedContent) {
      setError("No encrypted content found")
      return
    }

    const decrypted = simpleDecrypt(file.encryptedContent, password)

    if (decrypted === null) {
      setError("Wrong password or corrupted data")
      return
    }

    onDecrypt(file.id, decrypted)
    setPassword("")
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setPassword("")
          setConfirmPassword("")
          setError("")
        }
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[440px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "encrypt" ? (
              <>
                <Lock className="h-4 w-4" />
                Encrypt File
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4" />
                Decrypt File
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "encrypt"
              ? "Protect your file with a password. Make sure to remember it!"
              : "Enter the password to unlock this file."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && mode === "decrypt") {
                  handleDecrypt()
                }
              }}
            />
          </div>

          {mode === "encrypt" && (
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Confirm password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEncrypt()
                  }
                }}
              />
            </div>
          )}

          {file?.encrypted && mode === "encrypt" && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This file is already encrypted. Decrypt it first before re-encrypting.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <Button className="flex-1 bg-transparent" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={mode === "encrypt" ? handleEncrypt : handleDecrypt}
              disabled={file?.encrypted && mode === "encrypt"}
            >
              {mode === "encrypt" ? "Encrypt" : "Decrypt"}
            </Button>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setMode(mode === "encrypt" ? "decrypt" : "encrypt")
                setError("")
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {mode === "encrypt" ? "Decrypt a file instead?" : "Encrypt a file instead?"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

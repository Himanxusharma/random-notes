"use client"

import { useState } from "react"
import { FileDown, FileText, FileCode } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { NoteFile } from "../notepad-app"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: NoteFile
}

export function ExportDialog({ open, onOpenChange, file }: ExportDialogProps) {
  const [format, setFormat] = useState<"txt" | "md" | "html" | "pdf">("txt")

  const handleExport = () => {
    let content = file.content
    let mimeType = "text/plain"
    let extension = format

    // Get base file name without extension
    const baseName = file.name.replace(/\.[^.]+$/, "")

    switch (format) {
      case "txt":
        mimeType = "text/plain"
        extension = "txt"
        break
      case "md":
        mimeType = "text/markdown"
        extension = "md"
        break
      case "html":
        mimeType = "text/html"
        extension = "html"
        // Convert content to basic HTML with formatting
        content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${baseName}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; 
      max-width: 800px; 
      margin: 40px auto; 
      padding: 20px; 
      line-height: 1.8;
      color: #333;
      background: #fafafa;
    }
    .content { 
      background: white; 
      padding: 30px; 
      border-radius: 8px; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 14px;
    }
    h1 { color: #222; margin-bottom: 20px; }
    strong { font-weight: 600; }
    em { font-style: italic; }
    mark { background: #fff3cd; padding: 0 2px; }
  </style>
</head>
<body>
  <h1>${baseName}</h1>
  <div class="content">${convertToHTMLContent(file.content)}</div>
</body>
</html>`
        break
      case "pdf":
        // For PDF, open in new window with print dialog
        handlePDFExport()
        return // Don't continue with blob download
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${baseName}.${extension}`
    a.click()
    URL.revokeObjectURL(url)

    onOpenChange(false)
  }

  // Convert markdown-like syntax to HTML
  const convertToHTMLContent = (text: string): string => {
    return text
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/==(.+?)==/g, "<mark>$1</mark>")
      .replace(/~~(.+?)~~/g, "<del>$1</del>")
      .replace(/^# (.+)$/gm, "<h2>$1</h2>")
      .replace(/\n/g, "<br>")
  }

  // Handle PDF export by opening print dialog
  const handlePDFExport = () => {
    const baseName = file.name.replace(/\.[^.]+$/, "")
    const exportDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    const htmlContent = convertToHTMLContent(file.content)
    
    // Create an iframe for printing (more reliable than popup)
    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.top = '-10000px'
    iframe.style.left = '-10000px'
    iframe.style.width = '1px'
    iframe.style.height = '1px'
    document.body.appendChild(iframe)

    const iframeDoc = iframe.contentWindow?.document
    if (!iframeDoc) {
      alert('Unable to create print preview. Please try again.')
      document.body.removeChild(iframe)
      return
    }

    iframeDoc.open()
    iframeDoc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${baseName}</title>
  <style>
    @page { 
      margin: 0.75in; 
      size: A4;
    }
    @media print {
      body { 
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
    * {
      box-sizing: border-box;
    }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6;
      color: #333;
      font-size: 11pt;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 2px solid #333;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 20pt;
      color: #111;
      font-weight: 600;
    }
    .header .date {
      font-size: 9pt;
      color: #666;
    }
    .content { 
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 11pt;
      line-height: 1.7;
    }
    strong { font-weight: 600; }
    em { font-style: italic; }
    mark { background-color: #fff3cd; padding: 1px 3px; }
    del { text-decoration: line-through; color: #888; }
    h2 { font-size: 14pt; margin: 16px 0 8px 0; color: #222; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${baseName}</h1>
    <div class="date">Exported on ${exportDate}</div>
  </div>
  <div class="content">${htmlContent}</div>
</body>
</html>`)
    iframeDoc.close()

    // Wait for iframe to load, then print
    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus()
          iframe.contentWindow?.print()
        } catch (e) {
          console.error('Print failed:', e)
        }
        // Remove iframe after printing (with delay to allow print dialog)
        setTimeout(() => {
          document.body.removeChild(iframe)
        }, 1000)
      }, 250)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[420px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export Document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={(value: any) => setFormat(value)}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="txt" id="txt" />
                <Label htmlFor="txt" className="flex-1 cursor-pointer flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Plain Text (.txt)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="md" id="md" />
                <Label htmlFor="md" className="flex-1 cursor-pointer flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  Markdown (.md)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="html" id="html" />
                <Label htmlFor="html" className="flex-1 cursor-pointer flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  HTML (.html)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex-1 cursor-pointer flex items-center gap-2">
                  <FileDown className="h-4 w-4" />
                  PDF (via Print)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-transparent" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleExport}>
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

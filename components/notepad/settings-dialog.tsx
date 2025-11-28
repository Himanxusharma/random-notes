"use client"

import {
  Settings,
  Palette,
  Columns,
  Lock,
  Clipboard,
  Download,
  Type,
  Clock,
  FileType,
  History,
  Printer,
  WrapText,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { SyntaxTheme, AppSettings, NoteFile, AccentColor } from "../notepad-app"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  syntaxTheme: SyntaxTheme
  onSyntaxThemeChange: (theme: SyntaxTheme) => void
  distractionFree: boolean
  onDistractionFreeChange: (enabled: boolean) => void
  splitView: "none" | "vertical" | "horizontal"
  onSplitViewChange: (view: "none" | "vertical" | "horizontal") => void
  onEncryptionOpen: () => void
  onClipboardOpen: () => void
  onUndoHistoryOpen: () => void
  onExportOpen: () => void
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
  currentFile?: NoteFile
}

export function SettingsDialog({
  open,
  onOpenChange,
  syntaxTheme,
  onSyntaxThemeChange,
  distractionFree,
  onDistractionFreeChange,
  splitView,
  onSplitViewChange,
  onEncryptionOpen,
  onClipboardOpen,
  onUndoHistoryOpen,
  onExportOpen,
  settings,
  onSettingsChange,
}: SettingsDialogProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[600px] max-h-[90vh] overflow-y-auto modal-fade-in backdrop-blur-xl bg-background/95 shadow-soft-lg border border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Type className="h-4 w-4" />
              Typography
            </div>
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select
                  value={settings.fontFamily}
                  onValueChange={(value) => onSettingsChange({ ...settings, fontFamily: value })}
                >
                  <SelectTrigger id="font-family">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                    <SelectItem value="Fira Code">Fira Code</SelectItem>
                    <SelectItem value="monospace">System Mono</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size: {settings.fontSize}px</Label>
                <Slider
                  id="font-size"
                  min={12}
                  max={24}
                  step={1}
                  value={[settings.fontSize]}
                  onValueChange={(value) => onSettingsChange({ ...settings, fontSize: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="line-spacing">Line Spacing: {settings.lineSpacing.toFixed(1)}</Label>
                <Slider
                  id="line-spacing"
                  min={1.2}
                  max={2.4}
                  step={0.1}
                  value={[settings.lineSpacing]}
                  onValueChange={(value) => onSettingsChange({ ...settings, lineSpacing: value[0] })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Palette className="h-4 w-4" />
              Appearance
            </div>
            <div className="space-y-3 pl-6">
              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color Theme</Label>
                <Select
                  value={settings.accentColor}
                  onValueChange={(value) => onSettingsChange({ ...settings, accentColor: value as AccentColor })}
                >
                  <SelectTrigger id="accent-color">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-background/95 shadow-soft-lg">
                    <SelectItem value="default">Default (Neutral)</SelectItem>
                    <SelectItem value="mint">Mint Green</SelectItem>
                    <SelectItem value="lavender">Lavender</SelectItem>
                    <SelectItem value="sunset">Sunset Orange</SelectItem>
                    <SelectItem value="ocean">Ocean Blue</SelectItem>
                    <SelectItem value="forest">Forest Green</SelectItem>
                    <SelectItem value="slate">Slate Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="syntax-theme">Syntax Highlighting Theme</Label>
                <Select value={syntaxTheme} onValueChange={(value) => onSyntaxThemeChange(value as SyntaxTheme)}>
                  <SelectTrigger id="syntax-theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-background/95 shadow-soft-lg">
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="monokai">Monokai</SelectItem>
                    <SelectItem value="solarized">Solarized Dark</SelectItem>
                    <SelectItem value="material">Material</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-texture">Subtle Background Texture</Label>
                  <p className="text-xs text-muted-foreground">Add a gentle texture to the editor</p>
                </div>
                <Switch
                  id="enable-texture"
                  checked={settings.enableTexture}
                  onCheckedChange={(checked) => onSettingsChange({ ...settings, enableTexture: checked })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <WrapText className="h-4 w-4" />
              Editor
            </div>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="word-wrap">Word Wrap</Label>
                  <p className="text-xs text-muted-foreground">Wrap long lines to fit the editor width</p>
                </div>
                <Switch
                  id="word-wrap"
                  checked={settings.wordWrap}
                  onCheckedChange={(checked) => onSettingsChange({ ...settings, wordWrap: checked })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Auto-Save
            </div>
            <div className="space-y-3 pl-6">
              <div className="space-y-2">
                <Label htmlFor="autosave-freq">Frequency: {settings.autoSaveFrequency / 1000}s</Label>
                <Slider
                  id="autosave-freq"
                  min={1000}
                  max={10000}
                  step={1000}
                  value={[settings.autoSaveFrequency]}
                  onValueChange={(value) => onSettingsChange({ ...settings, autoSaveFrequency: value[0] })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileType className="h-4 w-4" />
              File Settings
            </div>
            <div className="space-y-3 pl-6">
              <div className="space-y-2">
                <Label htmlFor="default-format">Default File Format</Label>
                <Select
                  value={settings.defaultFileFormat}
                  onValueChange={(value) => onSettingsChange({ ...settings, defaultFileFormat: value })}
                >
                  <SelectTrigger id="default-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="txt">Plain Text (.txt)</SelectItem>
                    <SelectItem value="md">Markdown (.md)</SelectItem>
                    <SelectItem value="code">Code File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Columns className="h-4 w-4" />
              Split View
            </div>
            <div className="space-y-3 pl-6">
              <Select
                value={splitView}
                onValueChange={(value) => onSplitViewChange(value as "none" | "vertical" | "horizontal")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="vertical">Vertical Split</SelectItem>
                  <SelectItem value="horizontal">Horizontal Split</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4" />
              Privacy & Tools
            </div>
            <div className="space-y-2 pl-6">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  onOpenChange(false)
                  onEncryptionOpen()
                }}
              >
                <Lock className="h-4 w-4 mr-2" />
                File Encryption
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  onOpenChange(false)
                  onClipboardOpen()
                }}
              >
                <Clipboard className="h-4 w-4 mr-2" />
                Clipboard History
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  onOpenChange(false)
                  onUndoHistoryOpen()
                }}
              >
                <History className="h-4 w-4 mr-2" />
                Undo History Timeline
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Download className="h-4 w-4" />
              Export
            </div>
            <div className="space-y-2 pl-6">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  onOpenChange(false)
                  onExportOpen()
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Document (TXT, MD, HTML, PDF)
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Printer className="h-4 w-4" />
              Print
            </div>
            <div className="space-y-2 pl-6">
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print Current File
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

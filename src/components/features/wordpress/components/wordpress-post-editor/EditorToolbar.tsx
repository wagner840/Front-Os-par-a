"use client";

import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  Quote,
  Code,
  Link2,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";

interface EditorToolbarProps {
  wordCount: number;
  onImageUpload: (file: File) => void;
}

export function EditorToolbar({
  wordCount,
  onImageUpload,
}: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center gap-1">
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("bold")}
        >
          <Bold className="w-4 h-4" />
        </AnimatedButton>
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("italic")}
        >
          <Italic className="w-4 h-4" />
        </AnimatedButton>
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("underline")}
        >
          <Underline className="w-4 h-4" />
        </AnimatedButton>
      </div>

      <div className="w-px h-6 bg-white/20" />

      <div className="flex items-center gap-1">
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("formatBlock", false, "h1")}
        >
          <Heading1 className="w-4 h-4" />
        </AnimatedButton>
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("formatBlock", false, "h2")}
        >
          <Heading2 className="w-4 h-4" />
        </AnimatedButton>
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("formatBlock", false, "h3")}
        >
          <Heading3 className="w-4 h-4" />
        </AnimatedButton>
      </div>

      <div className="w-px h-6 bg-white/20" />

      <div className="flex items-center gap-1">
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("justifyLeft")}
        >
          <AlignLeft className="w-4 h-4" />
        </AnimatedButton>
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("justifyCenter")}
        >
          <AlignCenter className="w-4 h-4" />
        </AnimatedButton>
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("justifyRight")}
        >
          <AlignRight className="w-4 h-4" />
        </AnimatedButton>
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("justifyFull")}
        >
          <AlignJustify className="w-4 h-4" />
        </AnimatedButton>
      </div>

      <div className="w-px h-6 bg-white/20" />

      <div className="flex items-center gap-1">
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("insertUnorderedList")}
        >
          <List className="w-4 h-4" />
        </AnimatedButton>
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() =>
            document.execCommand("formatBlock", false, "blockquote")
          }
        >
          <Quote className="w-4 h-4" />
        </AnimatedButton>
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("formatBlock", false, "pre")}
        >
          <Code className="w-4 h-4" />
        </AnimatedButton>
      </div>

      <div className="w-px h-6 bg-white/20" />

      <div className="flex items-center gap-1">
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt("Digite a URL:");
            if (url) document.execCommand("createLink", false, url);
          }}
        >
          <Link2 className="w-4 h-4" />
        </AnimatedButton>
        <label htmlFor="image-upload-toolbar" className="cursor-pointer">
          <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3">
            <ImageIcon className="w-4 h-4" />
          </div>
        </label>
        <input
          id="image-upload-toolbar"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImageUpload(file);
          }}
        />
      </div>

      <div className="w-px h-6 bg-white/20" />

      <div className="flex items-center gap-1">
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("undo")}
        >
          <Undo className="w-4 h-4" />
        </AnimatedButton>
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => document.execCommand("redo")}
        >
          <Redo className="w-4 h-4" />
        </AnimatedButton>
      </div>

      <div className="flex-1" />

      <Badge variant="outline" className="text-xs">
        {wordCount} palavras
      </Badge>
    </div>
  );
}

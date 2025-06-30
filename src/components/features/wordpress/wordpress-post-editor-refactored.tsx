"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWordPressPostEditor } from "@/lib/hooks/use-wordpress-post-editor";
import {
  PostEditorHeader,
  PostEditorSidebar,
  EditorToolbar,
} from "./components/wordpress-post-editor";
import type { WordPressPost } from "@/lib/types/wordpress";

interface WordPressPostEditorProps {
  post?: WordPressPost;
  blogId: string;
  onSave?: (post: WordPressPost) => void;
  onCancel?: () => void;
}

export function WordPressPostEditor({
  post,
  blogId,
  onSave,
  onCancel,
}: WordPressPostEditorProps) {
  const {
    activeTab,
    setActiveTab,
    isPreview,
    setIsPreview,
    isSaving,
    hasChanges,
    seoScore,
    readabilityScore,
    wordCount,
    editorState,
    categories,
    tags,
    handleEditorChange,
    handleSave,
    handleImageUpload,
  } = useWordPressPostEditor({ post, blogId, onSave });

  return (
    <div className="space-y-6">
      <PostEditorHeader
        post={post}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        onCancel={onCancel}
        onSave={handleSave}
        isSaving={isSaving}
        hasChanges={hasChanges}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Column */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="p-6">
            {/* Título */}
            <div className="space-y-2 mb-6">
              <Label htmlFor="title" className="text-white">
                Título
              </Label>
              <Input
                id="title"
                value={editorState.title}
                onChange={(e) => handleEditorChange("title", e.target.value)}
                placeholder="Digite o título do post..."
                className="text-lg font-semibold bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2 mb-6">
              <Label htmlFor="slug" className="text-white">
                URL (Slug)
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">
                  {typeof window !== "undefined" ? window.location.origin : ""}/
                </span>
                <Input
                  id="slug"
                  value={editorState.slug}
                  onChange={(e) => handleEditorChange("slug", e.target.value)}
                  placeholder="url-do-post"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            {/* Editor Toolbar */}
            <EditorToolbar
              wordCount={wordCount}
              onImageUpload={handleImageUpload}
            />

            {/* Editor Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-4"
            >
              <TabsList className="bg-white/10 border-white/20">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="mt-4">
                <RichTextEditor
                  value={editorState.content}
                  onChange={(content) => handleEditorChange("content", content)}
                  height={500}
                  placeholder="Comece a escrever seu post..."
                  enableSEOAnalysis={true}
                  showWordCount={false}
                />
              </TabsContent>

              <TabsContent value="html" className="mt-4">
                <div className="space-y-2">
                  <Label className="text-white">HTML do Post</Label>
                  <textarea
                    value={editorState.content}
                    onChange={(e) =>
                      handleEditorChange("content", e.target.value)
                    }
                    className="w-full min-h-[400px] p-4 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Digite o HTML do post..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <div
                  className="prose prose-invert max-w-none p-4 bg-white/5 border border-white/10 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: editorState.content }}
                />
              </TabsContent>
            </Tabs>

            {/* Resumo */}
            <div className="space-y-2 mt-6">
              <Label htmlFor="excerpt" className="text-white">
                Resumo
              </Label>
              <textarea
                id="excerpt"
                value={editorState.excerpt}
                onChange={(e) => handleEditorChange("excerpt", e.target.value)}
                placeholder="Digite um resumo do post..."
                rows={3}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <PostEditorSidebar
          seoScore={seoScore}
          readabilityScore={readabilityScore}
          wordCount={wordCount}
          editorState={editorState}
          handleEditorChange={handleEditorChange}
          categories={categories}
          tags={tags}
        />
      </div>
    </div>
  );
}

"use client";

import { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { motion } from "framer-motion";
import { GlassCard } from "./glass-card";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number | string;
  placeholder?: string;
  disabled?: boolean;
  showWordCount?: boolean;
  enableSEOAnalysis?: boolean;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  height = 400,
  placeholder = "Comece a escrever...",
  disabled = false,
  showWordCount = true,
  enableSEOAnalysis = false,
  className = "",
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string, editor: any) => {
    onChange(content);

    // Atualizar variável global para o window.activeEditor (necessário para integração)
    if (typeof window !== "undefined") {
      (window as any).activeEditor = editor;
    }
  };

  const editorConfig = {
    height,
    menubar: false,
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "code",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "help",
      "wordcount",
      "emoticons",
      "codesample",
      "hr",
      "pagebreak",
      "nonbreaking",
      "toc",
      "imagetools",
      "textpattern",
      "autosave",
      "quickbars",
    ],
    toolbar: [
      "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor",
      "alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist",
      "link image media table | insertdatetime emoticons hr | code fullscreen preview",
      "searchreplace | help",
    ].join(" | "),
    content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
        font-size: 16px; 
        line-height: 1.6;
        color: #1a1a1a;
        background: #ffffff;
        margin: 16px;
      }
      h1, h2, h3, h4, h5, h6 {
        margin-top: 24px;
        margin-bottom: 16px;
        font-weight: 600;
        line-height: 1.25;
      }
      h1 { font-size: 2em; color: #2563eb; }
      h2 { font-size: 1.5em; color: #1e40af; }
      h3 { font-size: 1.25em; color: #1e3a8a; }
      p { margin-bottom: 16px; }
      blockquote {
        border-left: 4px solid #e5e7eb;
        margin: 16px 0;
        padding-left: 16px;
        font-style: italic;
        color: #6b7280;
      }
      code {
        background: #f3f4f6;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.875em;
      }
      pre {
        background: #1f2937;
        color: #f9fafb;
        padding: 16px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 16px 0;
      }
      a {
        color: #2563eb;
        text-decoration: underline;
      }
      img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 16px 0;
      }
      table, th, td {
        border: 1px solid #e5e7eb;
      }
      th, td {
        padding: 12px;
        text-align: left;
      }
      th {
        background-color: #f9fafb;
        font-weight: 600;
      }
    `,
    placeholder,
    skin: "oxide",
    content_css: false,
    branding: false,
    promotion: false,
    resize: "both",
    autosave_ask_before_unload: true,
    autosave_interval: "30s",
    autosave_prefix: "{path}{query}-{id}-",
    autosave_restore_when_empty: false,
    autosave_retention: "2m",
    image_advtab: true,
    image_caption: true,
    image_description: false,
    image_title: true,
    image_uploadtab: true,
    file_picker_types: "image",
    paste_data_images: true,
    paste_as_text: false,
    paste_auto_cleanup_on_paste: true,
    paste_remove_styles: false,
    paste_remove_styles_if_webkit: false,
    link_assume_external_targets: true,
    link_context_toolbar: true,
    quickbars_selection_toolbar:
      "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
    quickbars_insert_toolbar: "quickimage quicktable",
    contextmenu: "link image table",
    table_toolbar:
      "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
    table_appearance_options: false,
    table_grid: false,
    table_class_list: [
      { title: "None", value: "" },
      { title: "Tabela responsiva", value: "table-responsive" },
      { title: "Tabela listrada", value: "table-striped" },
      { title: "Tabela compacta", value: "table-compact" },
    ],
    emoticons_database: "emojis",
    setup: (editor: any) => {
      // Adicionar botões customizados
      editor.ui.registry.addButton("seoHeading", {
        text: "H2 SEO",
        onAction: () => {
          editor.formatter.apply("h2");
        },
      });

      editor.ui.registry.addButton("insertKeyword", {
        text: "Keyword",
        onAction: () => {
          const keyword = prompt("Digite a keyword:");
          if (keyword) {
            editor.insertContent(`<strong>${keyword}</strong>`);
          }
        },
      });

      // Eventos para análise SEO
      if (enableSEOAnalysis) {
        editor.on("input keyup", () => {
          const content = editor.getContent({ format: "text" });
          // Aqui você pode adicionar lógica de análise SEO
          console.log("Análise SEO:", {
            wordCount: content.split(" ").length,
            characterCount: content.length,
          });
        });
      }
    },
    init_instance_callback: (editor: any) => {
      if (editorRef.current) {
        editorRef.current = editor;
      }
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${className}`}
    >
      <GlassCard className="p-1 overflow-hidden">
        <Editor
          apiKey="no-api-key" // Use sua própria chave da TinyMCE se necessário
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={value}
          onEditorChange={handleEditorChange}
          disabled={disabled}
          init={editorConfig}
        />

        {showWordCount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-2 bg-white/5 border-t border-white/10 flex justify-between items-center text-sm text-white/60"
          >
            <div className="flex items-center gap-4">
              <span>
                Palavras:{" "}
                <span className="text-white font-medium">
                  {
                    value
                      .replace(/<[^>]*>/g, "")
                      .split(" ")
                      .filter((word) => word.length > 0).length
                  }
                </span>
              </span>
              <span>
                Caracteres:{" "}
                <span className="text-white font-medium">
                  {value.replace(/<[^>]*>/g, "").length}
                </span>
              </span>
            </div>

            {enableSEOAnalysis && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400">SEO: Bom</span>
              </div>
            )}
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  );
}

// Hook para obter o editor ativo
export function useActiveEditor() {
  const getEditor = () => {
    if (typeof window !== "undefined") {
      return (window as any).activeEditor;
    }
    return null;
  };

  const insertContent = (content: string) => {
    const editor = getEditor();
    if (editor) {
      editor.insertContent(content);
    }
  };

  const getContent = () => {
    const editor = getEditor();
    return editor ? editor.getContent() : "";
  };

  const setContent = (content: string) => {
    const editor = getEditor();
    if (editor) {
      editor.setContent(content);
    }
  };

  const focus = () => {
    const editor = getEditor();
    if (editor) {
      editor.focus();
    }
  };

  return {
    editor: getEditor(),
    insertContent,
    getContent,
    setContent,
    focus,
  };
}

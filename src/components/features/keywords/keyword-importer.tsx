"use client";

import { useState } from "react";
import { Upload, FileText, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBulkImportKeywords } from "@/lib/hooks/use-keywords";
import { toast } from "sonner";
import type { Database } from "@/lib/types/database";

type KeywordInsert = Database["public"]["Tables"]["main_keywords"]["Insert"];

interface KeywordImporterProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function KeywordImporter({ onSuccess, onCancel }: KeywordImporterProps) {
  const [importMethod, setImportMethod] = useState<"csv" | "manual">("csv");
  const [csvContent, setCsvContent] = useState("");
  const [manualKeywords, setManualKeywords] = useState<string[]>([""]);

  const bulkImport = useBulkImportKeywords();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvContent(content);
    };
    reader.readAsText(file);
  };

  const parseCSV = (content: string): KeywordInsert[] => {
    const lines = content.split("\n").filter((line) => line.trim());
    const headers = lines[0].split(",").map((h) => h.trim());

    return lines
      .slice(1)
      .map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const keyword: KeywordInsert = {
          keyword: values[0] || "",
          search_volume: values[1] ? parseInt(values[1]) : null,
          difficulty: values[2] ? parseInt(values[2]) : null,
          cpc: values[3] ? parseFloat(values[3]) : null,
          competition: values[4] || null,
          category: values[5] || null,
          status: (values[6] as any) || "active",
          language: "Portuguese",
          country: "Brazil",
        };
        return keyword;
      })
      .filter((k) => k.keyword);
  };

  const handleCSVImport = async () => {
    if (!csvContent.trim()) {
      toast.error("Por favor, adicione o conteúdo CSV");
      return;
    }

    try {
      const keywords = parseCSV(csvContent);
      if (keywords.length === 0) {
        toast.error("Nenhuma keyword válida encontrada no CSV");
        return;
      }

      await bulkImport.mutateAsync(keywords);
      toast.success(`${keywords.length} keywords importadas com sucesso!`);
      onSuccess();
    } catch (error) {
      console.error("Erro ao importar CSV:", error);
      toast.error("Erro ao importar keywords");
    }
  };

  const handleManualImport = async () => {
    const validKeywords = manualKeywords
      .filter((k) => k.trim())
      .map((keyword) => ({
        keyword: keyword.trim(),
        status: "active" as const,
        language: "Portuguese",
        country: "Brazil",
      }));

    if (validKeywords.length === 0) {
      toast.error("Adicione pelo menos uma keyword");
      return;
    }

    try {
      await bulkImport.mutateAsync(validKeywords);
      toast.success(
        `${validKeywords.length} keywords adicionadas com sucesso!`
      );
      onSuccess();
    } catch (error) {
      console.error("Erro ao importar keywords:", error);
      toast.error("Erro ao adicionar keywords");
    }
  };

  const addManualKeyword = () => {
    setManualKeywords([...manualKeywords, ""]);
  };

  const removeManualKeyword = (index: number) => {
    setManualKeywords(manualKeywords.filter((_, i) => i !== index));
  };

  const updateManualKeyword = (index: number, value: string) => {
    const updated = [...manualKeywords];
    updated[index] = value;
    setManualKeywords(updated);
  };

  return (
    <div className="space-y-6">
      {/* Método de Importação */}
      <div className="flex gap-4">
        <Button
          variant={importMethod === "csv" ? "default" : "outline"}
          onClick={() => setImportMethod("csv")}
          className="flex-1 gap-2"
        >
          <FileText className="w-4 h-4" />
          Importar CSV
        </Button>
        <Button
          variant={importMethod === "manual" ? "default" : "outline"}
          onClick={() => setImportMethod("manual")}
          className="flex-1 gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Manual
        </Button>
      </div>

      {/* Importação CSV */}
      {importMethod === "csv" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload de Arquivo CSV
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm text-gray-600 mb-2">
                Clique para selecionar ou arraste o arquivo CSV
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ou cole o conteúdo CSV
            </label>
            <textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="keyword,volume,difficulty,cpc,competition,category,status
marketing digital,1000,45,2.50,MEDIUM,Marketing,active
seo otimização,800,60,1.80,HIGH,SEO,active"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Formato do CSV:
            </h4>
            <p className="text-sm text-blue-700">
              keyword,volume,difficulty,cpc,competition,category,status
            </p>
            <ul className="text-xs text-blue-600 mt-2 space-y-1">
              <li>• keyword: Texto da palavra-chave (obrigatório)</li>
              <li>• volume: Volume de busca mensal (número)</li>
              <li>• difficulty: Dificuldade 0-100 (número)</li>
              <li>• cpc: Custo por clique em USD (decimal)</li>
              <li>• competition: LOW, MEDIUM ou HIGH</li>
              <li>• category: Categoria da keyword</li>
              <li>• status: active, inactive ou researching</li>
            </ul>
          </div>
        </div>
      )}

      {/* Adição Manual */}
      {importMethod === "manual" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords (uma por linha)
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {manualKeywords.map((keyword, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={keyword}
                    onChange={(e) => updateManualKeyword(index, e.target.value)}
                    placeholder={`Keyword ${index + 1}`}
                    className="flex-1"
                  />
                  {manualKeywords.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeManualKeyword(index)}
                      className="px-3"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={addManualKeyword}
              className="mt-3 gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Keyword
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              As keywords serão criadas com status "Ativo" e configurações
              padrão. Você pode editar individualmente após a importação.
            </p>
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={bulkImport.isPending}
        >
          Cancelar
        </Button>
        <Button
          onClick={
            importMethod === "csv" ? handleCSVImport : handleManualImport
          }
          disabled={bulkImport.isPending}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          {bulkImport.isPending ? "Importando..." : "Importar Keywords"}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { useSemanticSearch } from "@/lib/hooks/use-semantic-search";
import {
  Brain,
  Search,
  Sparkles,
  Loader2,
  FileText,
  Hash,
  Layers,
  Lightbulb,
  X,
  TrendingUp,
} from "lucide-react";

interface SemanticSearchBarProps {
  placeholder?: string;
  onResultSelect?: (result: any) => void;
  filters?: {
    blogId?: string;
    includeKeywords?: boolean;
    includePosts?: boolean;
    includeClusters?: boolean;
    includeOpportunities?: boolean;
    threshold?: number;
    limit?: number;
  };
  compact?: boolean;
  autoFocus?: boolean;
}

export function SemanticSearchBar({
  placeholder = "Descreva o que você está procurando...",
  onResultSelect,
  filters = {},
  compact = false,
  autoFocus = false,
}: SemanticSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data: results, isLoading } = useSemanticSearch(query, {
    threshold: 0.7,
    limit: 8,
    includeKeywords: true,
    includePosts: true,
    includeClusters: true,
    includeOpportunities: true,
    ...filters,
  });

  const handleSearch = () => {
    if (query.trim()) {
      setIsOpen(true);
    }
  };

  const handleResultClick = (result: any) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setIsOpen(false);
    setQuery("");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "post":
        return <FileText className="h-4 w-4" />;
      case "keyword":
        return <Hash className="h-4 w-4" />;
      case "cluster":
        return <Layers className="h-4 w-4" />;
      case "opportunity":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "post":
        return "text-blue-400 bg-blue-500/20 border-blue-500/30";
      case "keyword":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "cluster":
        return "text-purple-400 bg-purple-500/20 border-purple-500/30";
      case "opportunity":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "post":
        return "Post";
      case "keyword":
        return "Keyword";
      case "cluster":
        return "Cluster";
      case "opportunity":
        return "Oportunidade";
      default:
        return type;
    }
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className={`relative ${compact ? "" : "mb-4"}`}>
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <Brain className="h-4 w-4 text-purple-400" />
        </div>

        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className={`
            pl-10 pr-20 bg-black/40 border-purple-500/30 text-white placeholder:text-white/50
            focus:border-purple-400 focus:ring-purple-400/20
            ${compact ? "h-10" : "h-12"}
          `}
          autoFocus={autoFocus}
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery("")}
              className="h-8 w-8 p-0 hover:bg-white/10"
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          <Button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            size="sm"
            className={`
              bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
              ${compact ? "h-8 px-3" : "h-8 px-4"}
            `}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          >
            <GlassCard className="max-h-96 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <span className="font-medium text-white">
                    Busca Semântica
                  </span>
                  {results && results.length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {results.length} encontrados
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-3" />
                  <p className="text-white/60">Analisando conteúdo com IA...</p>
                </div>
              )}

              {/* Results */}
              {!isLoading && results && results.length > 0 && (
                <div className="p-2">
                  {results.map((result, index) => (
                    <motion.div
                      key={`${result.type}-${result.id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleResultClick(result)}
                      className="p-3 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5 cursor-pointer transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Type Icon */}
                        <div
                          className={`
                          p-2 rounded-lg border ${getTypeColor(result.type)}
                          group-hover:scale-110 transition-transform
                        `}
                        >
                          {getTypeIcon(result.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getTypeColor(result.type)}`}
                            >
                              {getTypeLabel(result.type)}
                            </Badge>

                            <div className="flex items-center gap-1 text-xs text-purple-400">
                              <TrendingUp className="h-3 w-3" />
                              {Math.round(result.similarity * 100)}%
                            </div>
                          </div>

                          <h4 className="font-medium text-white text-sm mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors">
                            {result.title}
                          </h4>

                          {result.description && (
                            <p className="text-xs text-white/60 line-clamp-2">
                              {result.description}
                            </p>
                          )}

                          {/* Metadata */}
                          {result.metadata &&
                            Object.keys(result.metadata).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {Object.entries(result.metadata)
                                  .slice(0, 3)
                                  .map(([key, value]) => (
                                    <Badge
                                      key={key}
                                      variant="outline"
                                      className="text-xs text-white/40 border-white/20"
                                    >
                                      {key}: {String(value)}
                                    </Badge>
                                  ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isLoading && results && results.length === 0 && (
                <div className="p-8 text-center">
                  <Search className="h-8 w-8 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60 mb-2">
                    Nenhum resultado encontrado
                  </p>
                  <p className="text-white/40 text-sm">
                    Tente reformular sua busca ou usar termos diferentes
                  </p>
                </div>
              )}

              {/* Tips */}
              {!query && (
                <div className="p-4 border-t border-white/10">
                  <div className="text-xs text-white/40">
                    <p className="mb-1">
                      💡 <strong>Dica:</strong> Use linguagem natural para
                      descrever o que procura
                    </p>
                    <p className="ml-4">
                      Exemplo: "posts sobre marketing digital" ou "keywords
                      relacionadas a vendas"
                    </p>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={handleClose}
        />
      )}
    </div>
  );
}

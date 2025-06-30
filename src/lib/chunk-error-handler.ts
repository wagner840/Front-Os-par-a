"use client";

// Declarações de tipos para webpack
declare global {
  interface Window {
    __webpack_require__?: {
      e: (...args: any[]) => Promise<any>;
      cache: { [key: string]: any };
    };
    __CHUNK_RETRY_COUNT__?: number;
  }
}

// Constantes de configuração
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Chunk Load Error Handler melhorado para Next.js
export function setupChunkErrorHandler() {
  if (typeof window === "undefined") return;

  // Inicializar contador de tentativas
  window.__CHUNK_RETRY_COUNT__ = window.__CHUNK_RETRY_COUNT__ || 0;

  // Interceptar erros globais
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    if (type === "error") {
      const wrappedListener = (event: Event) => {
        const errorEvent = event as ErrorEvent;
        const error = errorEvent.error;

        // Verificar se é um erro de chunk loading
        if (error && isChunkLoadError(error)) {
          handleChunkError(error);
          return;
        }

        // Chamar listener original
        if (typeof listener === "function") {
          listener(event);
        } else if (listener && typeof listener.handleEvent === "function") {
          listener.handleEvent(event);
        }
      };

      return originalAddEventListener.call(
        this,
        type,
        wrappedListener,
        options
      );
    }

    return originalAddEventListener.call(this, type, listener, options);
  };

  // Interceptar erros não capturados
  window.addEventListener("unhandledrejection", (event) => {
    const error = event.reason;
    if (isChunkLoadError(error)) {
      event.preventDefault();
      handleChunkError(error);
    }
  });
}

// Verificar se é um erro de chunk loading
function isChunkLoadError(error: any): boolean {
  if (!error) return false;

  const errorMessage = error.message || String(error);
  const errorName = error.name || "";

  return (
    errorName === "ChunkLoadError" ||
    errorMessage.includes("Loading chunk") ||
    errorMessage.includes("Loading CSS chunk") ||
    errorMessage.includes("ChunkLoadError") ||
    errorMessage.includes("timeout") ||
    errorMessage.includes("failed to fetch")
  );
}

// Lidar com erros de chunk de forma inteligente
function handleChunkError(error: any) {
  console.warn("Erro de chunk detectado:", error);

  const retryCount = window.__CHUNK_RETRY_COUNT__ || 0;

  if (retryCount < MAX_RETRIES) {
    window.__CHUNK_RETRY_COUNT__ = retryCount + 1;

    console.log(
      `Tentativa ${retryCount + 1} de ${MAX_RETRIES} para recarregar chunks...`
    );

    // Tentar limpar cache primeiro
    clearChunkCache();

    // Aguardar um pouco antes de tentar novamente
    setTimeout(() => {
      window.location.reload();
    }, RETRY_DELAY * (retryCount + 1));
  } else {
    console.error("Máximo de tentativas excedido, recarregando página...");
    window.location.reload();
  }
}

// Limpar cache de chunks
function clearChunkCache() {
  try {
    // Limpar cache de módulos webpack se disponível
    if (window.__webpack_require__?.cache) {
      Object.keys(window.__webpack_require__.cache).forEach((key) => {
        if (key.includes("chunk") || key.includes("vendor")) {
          delete window.__webpack_require__!.cache[key];
        }
      });
    }

    // Limpar localStorage relacionado ao Next.js
    if (typeof localStorage !== "undefined") {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("__next") || key.includes("chunk")) {
          localStorage.removeItem(key);
        }
      });
    }

    // Limpar sessionStorage relacionado ao Next.js
    if (typeof sessionStorage !== "undefined") {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("__next") || key.includes("chunk")) {
          sessionStorage.removeItem(key);
        }
      });
    }
  } catch (err) {
    console.warn("Erro ao limpar cache de chunks:", err);
  }
}

// Supress Supabase LockManager warnings
export function suppressSupabaseLockManagerWarnings() {
  if (typeof window === "undefined") return;

  const originalWarn = console.warn;
  console.warn = function (...args: any[]) {
    const message = args.join(" ");

    // Suprimir warnings específicos do Supabase
    if (
      message.includes("@supabase/gotrue-js: Navigator LockManager") ||
      message.includes("LockManager returned a null lock") ||
      message.includes("not following the LockManager spec")
    ) {
      return;
    }

    // Suprimir sugestão do React DevTools em produção
    if (
      message.includes("Download the React DevTools") ||
      message.includes("https://reactjs.org/link/react-devtools")
    ) {
      return;
    }

    // Suprimir warnings de hidratação conhecidos
    if (
      message.includes("Text content does not match server-rendered HTML") ||
      message.includes("Hydration failed") ||
      message.includes("server HTML was replaced")
    ) {
      return;
    }

    // Chamar warn original para outras mensagens
    originalWarn.apply(console, args);
  };
}

// Função de setup combinada
export function setupErrorHandlers() {
  try {
    setupChunkErrorHandler();
    suppressSupabaseLockManagerWarnings();

    // Reset contador de tentativas quando a página carrega com sucesso
    if (window.__CHUNK_RETRY_COUNT__ && window.__CHUNK_RETRY_COUNT__ > 0) {
      console.log(
        "Página carregada com sucesso após tentativas de recuperação"
      );
      window.__CHUNK_RETRY_COUNT__ = 0;
    }
  } catch (error) {
    console.error("Erro ao configurar handlers de erro:", error);
  }
}

// Função para recheck chunks (legacy)
export function recheckChunks() {
  clearChunkCache();
}

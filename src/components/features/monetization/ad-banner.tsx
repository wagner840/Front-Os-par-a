"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  /**
   * ID do slot de anúncio configurado no Google Ad Manager/AdSense
   */
  slotId: string;

  /**
   * Dimensões fixas do anúncio para prevenir CLS
   */
  width: number;
  height: number;

  /**
   * Formato do anúncio (responsivo, banner, leaderboard, etc.)
   */
  format?: "auto" | "rectangle" | "vertical" | "horizontal";

  /**
   * Se deve carregar o anúncio de forma lazy (só quando visível)
   */
  lazy?: boolean;

  /**
   * Classe CSS adicional
   */
  className?: string;

  /**
   * Se deve mostrar placeholder enquanto carrega
   */
  showPlaceholder?: boolean;

  /**
   * Título para acessibilidade
   */
  title?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
    googletag: unknown;
  }
}

export function AdBanner({
  slotId,
  width,
  height,
  format = "auto",
  lazy = true,
  className,
  showPlaceholder = true,
  title = "Anúncio",
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const pathname = usePathname();

  // Observer para lazy loading
  useEffect(() => {
    if (!lazy || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isVisible]);

  // Carregar anúncio quando visível
  useEffect(() => {
    if (!isVisible || isLoaded) return;

    const loadAd = async () => {
      try {
        // Aguardar o script do AdSense estar carregado
        let attempts = 0;
        while (!window.adsbygoogle && attempts < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
          setIsLoaded(true);
        } else {
          throw new Error("AdSense script não carregado");
        }
      } catch (error) {
        console.error("Erro ao carregar anúncio:", error);
        setHasError(true);
      }
    };

    loadAd();
  }, [isVisible, isLoaded]);

  // Recarregar anúncio em mudanças de rota (SPA)
  useEffect(() => {
    if (isLoaded && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (error) {
        console.error("Erro ao recarregar anúncio:", error);
      }
    }
  }, [pathname, isLoaded]);

  // Placeholder enquanto carrega
  const renderPlaceholder = () => (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
        "border border-gray-300 dark:border-gray-700 rounded-lg",
        "text-sm text-gray-500 dark:text-gray-400",
        className
      )}
      style={{ width, height }}
      aria-label="Carregando anúncio"
    >
      {hasError ? (
        <div className="text-center">
          <div className="text-red-500 mb-1">⚠️</div>
          <div>Erro ao carregar</div>
        </div>
      ) : (
        <div className="text-center">
          <div className="animate-pulse mb-1">📺</div>
          <div>Carregando anúncio...</div>
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={adRef}
      className={cn("ad-container", className)}
      style={{ width, height }}
      role="complementary"
      aria-label={title}
    >
      {!isVisible || (!isLoaded && showPlaceholder) ? (
        renderPlaceholder()
      ) : (
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            width: `${width}px`,
            height: `${height}px`,
          }}
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="false" // Importante para CLS
        />
      )}
    </div>
  );
}

// Componentes pré-configurados para tamanhos padrão
export function LeaderboardAd({
  slotId,
  className,
}: {
  slotId: string;
  className?: string;
}) {
  return (
    <AdBanner
      slotId={slotId}
      width={728}
      height={90}
      format="horizontal"
      className={className}
      title="Anúncio Leaderboard"
    />
  );
}

export function RectangleAd({
  slotId,
  className,
}: {
  slotId: string;
  className?: string;
}) {
  return (
    <AdBanner
      slotId={slotId}
      width={300}
      height={250}
      format="rectangle"
      className={className}
      title="Anúncio Retângulo"
    />
  );
}

export function SkyscraperAd({
  slotId,
  className,
}: {
  slotId: string;
  className?: string;
}) {
  return (
    <AdBanner
      slotId={slotId}
      width={160}
      height={600}
      format="vertical"
      className={className}
      title="Anúncio Skyscraper"
    />
  );
}

export function MobileBannerAd({
  slotId,
  className,
}: {
  slotId: string;
  className?: string;
}) {
  return (
    <AdBanner
      slotId={slotId}
      width={320}
      height={50}
      format="horizontal"
      className={className}
      title="Anúncio Mobile Banner"
    />
  );
}

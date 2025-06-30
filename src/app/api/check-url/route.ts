import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 });
    }

    const startTime = Date.now();

    try {
      // Usar AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: "HEAD", // Usar HEAD para economizar bandwidth
        signal: controller.signal,
        headers: {
          "User-Agent": "WordPress-Checker/1.0",
        },
      });

      clearTimeout(timeoutId);

      const responseTime = Date.now() - startTime;

      return NextResponse.json({
        url,
        status: response.status,
        isWorking: response.ok,
        responseTime,
        statusText: response.statusText,
      });
    } catch (fetchError) {
      const responseTime = Date.now() - startTime;

      return NextResponse.json({
        url,
        status: 0,
        isWorking: false,
        responseTime,
        error:
          fetchError instanceof Error ? fetchError.message : "Erro de conexão",
      });
    }
  } catch (error) {
    console.error("Erro na verificação de URL:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

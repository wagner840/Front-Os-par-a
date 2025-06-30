import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./src/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Atualizar sessão Supabase
  const response = await updateSession(request);

  // Gerar nonce para CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://tpc.googlesyndication.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://wayzhnpwphekjuznwqnr.supabase.co https://www.google-analytics.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://wayzhnpwphekjuznwqnr.supabase.co https://www.google-analytics.com https://region1.google-analytics.com wss://wayzhnpwphekjuznwqnr.supabase.co;
    frame-src 'self' https://www.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  // Adicionar headers de segurança adicionais
  const requestHeaders = new Headers(response.headers);
  requestHeaders.set("Content-Security-Policy", cspHeader);
  requestHeaders.set("X-Nonce", nonce);

  // Headers adicionais de segurança
  requestHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
  requestHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
  requestHeaders.set("Cross-Origin-Resource-Policy", "same-site");

  // Verificar se é uma rota da API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Adicionar headers específicos para API
    requestHeaders.set("X-Robots-Tag", "noindex");
  }

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: requestHeaders,
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};

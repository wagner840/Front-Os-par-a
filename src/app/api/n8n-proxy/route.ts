import { NextRequest, NextResponse } from "next/server";

const N8N_BASE_URL = "https://n8n.einsof7.com";
const N8N_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1YTM2MzJhNi0wMzhmLTQxNDQtYjk1MC0xZjM3ODAwNGVhMzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUxMjY3NDAzfQ.WDdlAVCGbF8JkVKh0ZOfnc2b8saFhg0LAWdCGubGrlk";

// Log da configuração para debug
console.log(`🔧 n8n proxy configurado: ${N8N_BASE_URL}`);

async function proxyRequest(
  endpoint: string,
  method: string = "GET",
  body?: any
): Promise<Response> {
  // Follow official n8n documentation: <your-instance>/api/v1/workflows
  // Ensure we don't double up on /api/v1 if it's already in the endpoint
  let finalEndpoint = endpoint;
  if (!endpoint.startsWith("/api/v1/")) {
    // Remove leading slash if present, then add /api/v1/
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.substring(1)
      : endpoint;
    finalEndpoint = `/api/v1/${cleanEndpoint}`;
  }

  const url = `${N8N_BASE_URL}${finalEndpoint}`;
  console.log(`🔗 Proxy n8n request: ${method} ${url}`);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "X-N8N-API-KEY": N8N_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`📡 n8n response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ n8n error: ${response.status} - ${error}`);

      return NextResponse.json(
        {
          error: `n8n API Error: ${response.status} - ${error}`,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("❌ Proxy error:", error);

    return NextResponse.json(
      {
        error: "Connection failed",
        message: error instanceof Error ? error.message : "Unknown error",
        demo: true,
      },
      {
        status: 503,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint") || "/workflows";

  return proxyRequest(endpoint);
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint") || "/workflows";

  try {
    const body = await request.json();
    return proxyRequest(endpoint, "POST", body);
  } catch (error) {
    return proxyRequest(endpoint, "POST");
  }
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint") || "/workflows";

  try {
    const body = await request.json();
    return proxyRequest(endpoint, "PUT", body);
  } catch (error) {
    return proxyRequest(endpoint, "PUT");
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint") || "/workflows";

  return proxyRequest(endpoint, "DELETE");
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

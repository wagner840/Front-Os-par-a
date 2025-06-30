import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { WordPressIntegrationService } from "@/lib/services/wordpress-integration";

export async function POST(
  request: NextRequest,
  { params }: { params: { blogId: string } }
) {
  try {
    const blogId = params.blogId;
    const body = await request.json();

    // Verificar autenticação do webhook
    const authHeader = request.headers.get("X-WP-Webhook-Source");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized webhook request" },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const wpService = new WordPressIntegrationService();

    // Processar evento do webhook
    const { event, data } = body;

    switch (event) {
      case "post.created":
      case "post.updated":
        // Sincronizar post do WordPress para Supabase
        await wpService.syncPostToWordPress(blogId, data.id.toString());
        break;

      case "post.deleted":
        // Remover post do Supabase
        await supabase
          .from("content_posts")
          .update({ status: "trash" })
          .eq("wordpress_post_id", data.id)
          .eq("blog_id", blogId);
        break;

      case "category.created":
      case "category.updated":
        // Sincronizar categoria
        await wpService.syncCategoriesFromWordPress(blogId);
        break;

      case "tag.created":
      case "tag.updated":
        // Sincronizar tag
        await wpService.syncTagsFromWordPress(blogId);
        break;

      case "media.uploaded":
        // Sincronizar mídia
        await wpService.syncMediaFromWordPress(blogId);
        break;

      case "comment.created":
        // Notificar novo comentário
        await supabase.from("notifications").insert({
          type: "new_comment",
          title: `Novo comentário em "${data.post_title}"`,
          message: `${data.author_name}: ${data.content.substring(0, 100)}...`,
          blog_id: blogId,
          data: { comment_id: data.id, post_id: data.post },
        });
        break;

      default:
        console.log(`Evento webhook não tratado: ${event}`);
    }

    // Atualizar timestamp da última sincronização
    await supabase
      .from("blogs")
      .update({
        settings: {
          last_webhook_sync: new Date().toISOString(),
          last_webhook_event: event,
        },
      })
      .eq("id", blogId);

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Erro no webhook WordPress:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}

// Handler para verificar se o webhook está ativo
export async function GET(
  request: NextRequest,
  { params }: { params: { blogId: string } }
) {
  return NextResponse.json({
    status: "active",
    blogId: params.blogId,
    timestamp: new Date().toISOString(),
  });
}

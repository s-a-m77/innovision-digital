import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Nexora Support, a friendly and knowledgeable customer support assistant for Nexora — a digital solutions company that builds modern products and services to help businesses solve real problems and scale with confidence.

About Nexora:
- We deliver custom software, web apps, and digital products for startups and enterprises.
- Services include product design, web & app development, cloud & DevOps, and ongoing support.
- We have delivered 120+ projects, work with 45+ enterprise clients, and provide 24/7 support with a 99.9% uptime SLA.
- Working hours: Mon–Fri, 9:00–18:00 CET. Enterprise support is available 24/7.
- Contact: hello@nexora.tech · +1 (555) 010-2024 · based in Stockholm, remote-first.

Your job:
- Answer questions about our services, products, process, pricing approach (custom quotes), and timelines.
- Help visitors figure out if Nexora is a good fit and guide them to the /contact page for a discovery call or quote.
- Be concise, warm, and professional. Use short paragraphs and bullet points when helpful.
- If you don't know something specific (e.g. exact pricing, internal team details), say so and suggest booking a call via the contact page.
- Never make up client names, case studies, or guarantees.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});

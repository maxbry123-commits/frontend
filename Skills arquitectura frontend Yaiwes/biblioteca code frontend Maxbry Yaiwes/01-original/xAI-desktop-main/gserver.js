import OpenAI from "openai";
import { serveDir } from "@std/http/file-server";
import open from "open";

const client = new OpenAI({
    apiKey: Deno.env.get("XAI_API_KEY") || "dummy_key",
    baseURL: "https://api.x.ai/v1",
});

export async function handleRequest(req) {
    const url = new URL(req.url);

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    }

    // API endpoint: /ask-xai
    if (url.pathname === "/ask-xai" && req.method === "POST") {
        try {
            const { messages, model } = await req.json();

            if (model && model.startsWith("grok-imagine")) {
                const lastMessage = messages[messages.length - 1];
                const prompt = typeof lastMessage?.content === "string"
                    ? lastMessage.content
                    : (Array.isArray(lastMessage?.content) ? lastMessage.content[0]?.text || lastMessage.content[0] : "");
                const imageResponse = await client.images.generate({
                    model: model,
                    prompt: prompt,
                    n: 2,
                });
                return Response.json(
                    { images: imageResponse.data },
                    {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                        },
                    },
                );
            } else {
                const completion = await client.chat.completions.create({
                    model: model || "grok-4.6",
                    messages: messages,
                    stream: true,
                });

                const encoder = new TextEncoder();
                const stream = new ReadableStream({
                    async start(controller) {
                        try {
                            for await (const chunk of completion) {
                                const content = chunk.choices[0]?.delta?.content;
                                if (content) {
                                    controller.enqueue(encoder.encode(content));
                                }
                            }
                        } catch (err) {
                            controller.error(err);
                        } finally {
                            controller.close();
                        }
                    },
                });

                return new Response(stream, {
                    headers: {
                        "Content-Type": "text/plain; charset=utf-8",
                        "Access-Control-Allow-Origin": "*",
                    },
                });
            }
        } catch (error) {
            console.error("API error:", error);
            return Response.json(
                { error: "Something went wrong with the API call", details: error.message },
                {
                    status: 500,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                },
            );
        }
    }

    // Serve static files from current directory
    return serveDir(req, {
        fsRoot: ".",
        urlRoot: "",
        quiet: true,
    });
}

const PORT = 3000;

if (import.meta.main) {
    Deno.serve({ port: PORT }, handleRequest);
    console.log(`Server is running on http://localhost:${PORT}`);

    if (Deno.env.get("NODE_ENV") !== "test" && !Deno.env.get("CI")) {
        try {
            await open(`http://localhost:${PORT}/index.html`);
        } catch (err) {
            console.error("Failed to open browser automatically:", err.message);
        }
    }
}

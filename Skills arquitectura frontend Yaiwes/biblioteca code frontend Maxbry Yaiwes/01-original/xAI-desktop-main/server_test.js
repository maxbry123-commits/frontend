import { assertEquals } from "@std/assert";
import { handleRequest } from "./gserver.js";

Deno.test("handleRequest serves index.html on root GET /", async () => {
    const req = new Request("http://localhost:3000/");
    const res = await handleRequest(req);
    assertEquals(res.status, 200);
    const contentType = res.headers.get("content-type");
    assertEquals(contentType?.includes("text/html"), true);
});

Deno.test("handleRequest serves script.js with javascript content-type", async () => {
    const req = new Request("http://localhost:3000/script.js");
    const res = await handleRequest(req);
    assertEquals(res.status, 200);
    const contentType = res.headers.get("content-type");
    assertEquals(contentType?.includes("javascript"), true);
});

Deno.test("handleRequest responds to OPTIONS preflight with CORS headers", async () => {
    const req = new Request("http://localhost:3000/ask-xai", {
        method: "OPTIONS",
    });
    const res = await handleRequest(req);
    assertEquals(res.status, 200);
    assertEquals(res.headers.get("access-control-allow-origin"), "*");
    assertEquals(res.headers.get("access-control-allow-methods"), "GET, POST, OPTIONS");
});

Deno.test("handleRequest returns 404 for nonexistent files", async () => {
    const req = new Request("http://localhost:3000/non-existent-file-xyz.txt");
    const res = await handleRequest(req);
    assertEquals(res.status, 404);
});

Deno.test("index.html contains grok-4.6 and grok-imagine-image-2.0 models", async () => {
    const req = new Request("http://localhost:3000/index.html");
    const res = await handleRequest(req);
    assertEquals(res.status, 200);
    const html = await res.text();
    assertEquals(html.includes("grok-4.6"), true);
    assertEquals(html.includes("grok-imagine-image-2.0"), true);
    assertEquals(html.includes("Current model: grok-4.6"), true);
});

Deno.test("script.js initializes currentModel to grok-4.6", async () => {
    const req = new Request("http://localhost:3000/script.js");
    const res = await handleRequest(req);
    assertEquals(res.status, 200);
    const js = await res.text();
    assertEquals(js.includes("let currentModel = 'grok-4.6';"), true);
});

Deno.test("handleRequest handles POST /ask-xai with error handling", async () => {
    const req = new Request("http://localhost:3000/ask-xai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            messages: [{ role: "user", content: "hello" }],
            model: "grok-4.6",
        }),
    });
    const res = await handleRequest(req);
    // In test environment without valid API key, it should return 500 JSON with error message
    assertEquals(res.status, 500);
    const json = await res.json();
    assertEquals(json.error, "Something went wrong with the API call");
});

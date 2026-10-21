import { createFileRoute } from "@tanstack/react-router";
import { handleMcp } from "@/lib/cinema/mcp.server";

export const Route = createFileRoute("/api/mcp")({
  server: {
    handlers: {
      POST: ({ request }) => handleMcp(request),
    },
  },
});

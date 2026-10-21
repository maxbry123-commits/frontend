import { createFileRoute } from "@tanstack/react-router";
import { studioDiscover, studioHttp } from "@/lib/cinema/studio.server";

export const Route = createFileRoute("/api/studio")({
  server: {
    handlers: {
      GET: () => studioDiscover(),
      POST: ({ request }) => studioHttp(request),
    },
  },
});

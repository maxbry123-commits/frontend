import { createFileRoute } from "@tanstack/react-router";
import { Replica } from "@/components/cinema/replica";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Replica />;
}

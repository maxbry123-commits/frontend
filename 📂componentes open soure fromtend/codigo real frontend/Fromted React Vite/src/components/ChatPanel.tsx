import {
  AssistantRuntimeProvider,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
import { ArrowUp, FileText, Globe, Image as ImageIcon, Plus, Square, Brain } from "lucide-react";

const FromtedAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal }) {
    const last = [...messages].reverse().find((m) => m.role === "user");
    const prompt =
      last?.content
        ?.filter((p) => p.type === "text")
        .map((p) => (p as { type: "text"; text: string }).text)
        .join(" ") ?? "";
    const reply = `FROMTED · assistant-ui LocalRuntime\n\nRecibido: ${prompt.slice(0, 200)}`;
    let acc = "";
    for (const ch of reply) {
      if (abortSignal.aborted) return;
      acc += ch;
      await new Promise((r) => setTimeout(r, 8));
      yield { content: [{ type: "text" as const, text: acc }] };
    }
  },
};

function UserMessage() {
  return (
    <MessagePrimitive.Root className="bubble bubble-user">
      <MessagePrimitive.Content />
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="msg-block">
      <div className="bubble bubble-ai">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
}

function Composer() {
  return (
    <ComposerPrimitive.Root className="composer-card">
      <ComposerPrimitive.Input className="composer-area" rows={2} placeholder="Use / to use Skill" />
      <div className="composer-bar">
        <button type="button" className="icon-btn" aria-label="add"><Plus size={18} strokeWidth={1.6} /></button>
        <span className="think-btn"><Brain size={16} strokeWidth={1.6} /><span>Thinking</span></span>
        <span className="model-btn">FROMTED ▾</span>
        <span className="grow" />
        <ComposerPrimitive.Send className="send-btn" aria-label="send"><ArrowUp size={16} strokeWidth={2} /></ComposerPrimitive.Send>
        <ComposerPrimitive.Cancel className="send-btn" aria-label="stop"><Square size={12} fill="currentColor" strokeWidth={0} /></ComposerPrimitive.Cancel>
      </div>
    </ComposerPrimitive.Root>
  );
}

function Thread() {
  return (
    <ThreadPrimitive.Root className="mx-chat">
      <ThreadPrimitive.Viewport className="aui-viewport">
        <ThreadPrimitive.Empty>
          <div className="chat-center"><h1 className="chat-hero-title">FROMTED makes your work easier</h1></div>
        </ThreadPrimitive.Empty>
        <ThreadPrimitive.Messages components={{ UserMessage, AssistantMessage }} />
      </ThreadPrimitive.Viewport>
      <div className="mx-bottom">
        <Composer />
        <div className="tool-chips">
          <ThreadPrimitive.Suggestion prompt="[doc] " className="tool-chip"><FileText size={15} strokeWidth={1.6} /><span>Document</span></ThreadPrimitive.Suggestion>
          <ThreadPrimitive.Suggestion prompt="[web] " className="tool-chip"><Globe size={15} strokeWidth={1.6} /><span>Website</span></ThreadPrimitive.Suggestion>
          <ThreadPrimitive.Suggestion prompt="[img] " className="tool-chip"><ImageIcon size={15} strokeWidth={1.6} /><span>Image</span></ThreadPrimitive.Suggestion>
        </div>
        <p className="hint-orange chat-hint"><span className="label-orange">Cargar</span>{" · "}<span className="label-orange">Descargar</span></p>
      </div>
    </ThreadPrimitive.Root>
  );
}

function RuntimeProvider({ children }: { children: React.ReactNode }) {
  const runtime = useLocalRuntime(FromtedAdapter);
  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>;
}

export function ChatPanel() {
  return (
    <RuntimeProvider>
      <Thread />
    </RuntimeProvider>
  );
}

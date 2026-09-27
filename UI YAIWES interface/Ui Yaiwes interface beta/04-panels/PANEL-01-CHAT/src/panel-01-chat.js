/* Panel 1 — lógica modular. No contiene backend: expone acciones y frontera de contrato. */
export const PANEL_01_MANIFEST = Object.freeze({
  id: 'chat-01', kind: 'window', label: 'Chat operativo', slotId: 'panel-b-chat',
  actions: ['chat.create','chat.rename','send_message','upload_file','transcribe_audio','cancel_run','export_conversation'],
  backendBoundary: ['send_message','upload_file','transcribe_audio','cancel_run']
});

export class Panel01ChatController {
  constructor({ dispatch = () => ({ ok:false, reason:'bridge_not_connected' }), onEvent = () => {} } = {}) {
    this.dispatch = dispatch;
    this.onEvent = onEvent;
    this.state = { messages: [], attachments: [], status: 'READY' };
  }
  emit(actionId, payload = {}) {
    const event = { type:'YAIWES_UI_ACTION', panelId:'PANEL-01', windowId:'CHAT-01', actionId, payload, at:new Date().toISOString() };
    this.onEvent(event);
    return this.dispatch(actionId, payload);
  }
  addLocalMessage(role, text, attachments = []) {
    const message = { id:crypto.randomUUID(), role, text, attachments, at:new Date().toISOString() };
    this.state.messages.push(message);
    this.onEvent({ type:'YAIWES_STATE_CHANGE', panelId:'PANEL-01', change:'message.add', message });
    return message;
  }
  async send(text) {
    if (!String(text || '').trim() && !this.state.attachments.length) return { ok:false, reason:'empty_message' };
    const payload = { text:String(text || ''), attachments:this.state.attachments };
    this.addLocalMessage('user', payload.text || '[adjuntos]', payload.attachments);
    this.state.status = 'QUEUED';
    const result = await this.emit('send_message', payload);
    if (!result?.ok) this.state.status = 'BRIDGE_REQUIRED';
    return result;
  }
  cancel() { this.state.status = 'READY'; return this.emit('cancel_run'); }
}

export function createPanel01Chat(options) { return new Panel01ChatController(options); }

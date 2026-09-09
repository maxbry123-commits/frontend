# xAI Desktop

## Description

This is a local, user-friendly web application that provides a graphical interface for chatting with xAI's latest models via their official API. Designed for a seamless experience, this tool allows for rich communication with Grok using a simple text interface, full Markdown-rendered streaming responses, and advanced image generation capabilities.

The frontend is built with **HTML, CSS, and JavaScript**, while the backend uses **Deno 2** with standard web APIs to securely handle API requests and stream responses.

## Features

- **Latest xAI Models**: Support for the entire new lineup, including:
  - **Language**: `grok-4.6` (flagship reasoning & chat), `grok-4.5`, `grok-4.3`, `grok-4.1-fast`, and `grok-4.20-0309-reasoning`.
  - **Image**: `grok-imagine-image-2.0`.
- **Model Selection Dropdowns**: Easily switch between language and image models with clean dropdown menus.
- **Clear Chat**: A dedicated button to wipe your local session history and start fresh instantly.
- **Rich Streaming Response**: AI responses stream directly into the chat bubbles in real-time with Markdown parsing.
- **Smart UI Logic**: Selecting an image model automatically resets the language model dropdown to prevent confusion.
- **Dark Mode**: Automatically follows your system's default theme or can be toggled manually.
- **Persistent Context**: Full conversation history is preserved during your session for context-aware responses.

## Prerequisites

- **Deno**: Version 2.9.6 or higher ([Install Deno](https://deno.com/)).
- **xAI API Key**: Sign up at [xAI Console](https://console.x.ai/).
- **Browser**: Tested with Brave, Firefox, and Safari.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Shawshank01/xAI-desktop.git
cd xAI-desktop
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
XAI_API_KEY=your_xai_api_key_here
```

## Usage

### Start the App

Run the following command:

```bash
deno task start
```

This command opens the UI in your default browser and starts the server in the foreground.

### Stop the App

Simply press **`Ctrl + C`** in your terminal. This will safely stop the server.

### Troubleshooting "Ghost" Servers

If you get a `400` or `Port in use` error, it likely means a server process is stuck in the background. To clear it:

```bash
lsof -ti :3000 | xargs kill -9
```

Clean redundant dependencies:

```bash
deno clean
```

## Acknowledgements

- [OpenAI SDK](https://www.npmjs.com/package/openai) — Utilises xAI's compatibility layer

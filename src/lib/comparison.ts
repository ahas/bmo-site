// The comparison of BMO with the kinds of tool a reader may weigh it against, as the home page's matrix shows it.
// Each kind is judged by two named examples, from their own official sites and documents as read in November 2026.
// A mark says what those documents state, never what a tool lacks:
// - "yes": both examples document the capability;
// - "partial": one of them does, or both do only in part, and a footnote says which;
// - "none": neither example's official documents were found to describe it.
// BMO's column rests on its public repositories' READMEs and documents (bmo, bmo-receiver, bmo-telegram,
// bmo-discord, bmo-brain, bmo-job, bmo-agency, bmo-testbed, bmo-arbiter, bmo-voice, bmo-research, bmo-calendar,
// bmo-note, bmo-drive, bmo-mail, bmo-artifact, bmo-remote). The words of each row, kind and footnote are in
// src/i18n/, under `compare`.

export type Mark = "yes" | "partial" | "none";

export type Kind = "hosted" | "chatUi" | "framework" | "coding" | "workflow";

export type Capability = "selfHost" | "chatApps" | "memory" | "shipping" | "localGpu" | "voice" | "desk" | "research";

export const KINDS: Kind[] = ["hosted", "chatUi", "framework", "coding", "workflow"];

/** The examples each kind is judged by; product names, the same in every language. */
export const EXAMPLES: Record<Kind, string> = {
  hosted: "ChatGPT, Claude.ai",
  chatUi: "Open WebUI, LibreChat",
  framework: "Letta, AutoGPT",
  coding: "OpenHands, Devin",
  workflow: "n8n, Dify",
};

export interface Row {
  capability: Capability;
  others: Record<Kind, Mark>;
}

export const ROWS: Row[] = [
  {
    // BMO: every unit is its own repository, run on the owner's machines; MIT apart from bmo-note's server and
    // native packages (README of bmo and of bmo-site).
    // ChatGPT, Claude.ai: no self-hosting found in https://help.openai.com or https://support.claude.com.
    // Open WebUI: https://docs.openwebui.com/license (BSD-3-Clause up to v0.6.5, a branding clause after).
    // LibreChat: https://github.com/danny-avila/LibreChat (MIT, "open-source for self-hosting").
    // Letta: https://docs.letta.com/self-hosting ("run entirely on infrastructure you control"; Apache-2.0).
    // AutoGPT: https://github.com/Significant-Gravitas/AutoGPT ("Run AutoGPT on your own infrastructure").
    // OpenHands: https://github.com/All-Hands-AI/OpenHands (MIT; runs locally, in Docker or on VMs).
    // Devin: https://docs.devin.ai/cloud/outposts/overview (commands and edits on the customer's machines; the
    // agent itself stays in Devin's cloud) - in part.
    // n8n: https://github.com/n8n-io/n8n (self-hosted, Sustainable Use License).
    // Dify: https://github.com/langgenius/dify (self-hosted, Dify Open Source License).
    capability: "selfHost",
    others: { hosted: "none", chatUi: "yes", framework: "yes", coding: "partial", workflow: "yes" },
  },
  {
    // BMO: bmo-telegram and bmo-discord are chat providers of the one receiver; the console is a room too.
    // Claude.ai: https://code.claude.com/docs/en/channels (Telegram and Discord through Claude Code channels, a
    // research preview, not the claude.ai chat) - in part; ChatGPT: none found.
    // Open WebUI: https://docs.openwebui.com (only a community integration found); LibreChat:
    // https://www.librechat.ai/docs/features/agent_channels (Slack only).
    // Letta: https://docs.letta.com/configuration/channels (Telegram and Discord, local backend only);
    // AutoGPT: https://agpt.co/docs/integrations/block-integrations/discord (Discord blocks) - in part.
    // OpenHands: https://docs.openhands.dev/enterprise/integrations/overview (Slack); Devin:
    // https://docs.devin.ai/integrations/overview (Slack, Microsoft Teams).
    // n8n: https://docs.n8n.io/changelog (2.40: one agent connected to Slack, Telegram, Linear or Discord);
    // Dify: none found.
    capability: "chatApps",
    others: { hosted: "partial", chatUi: "none", framework: "partial", coding: "none", workflow: "partial" },
  },
  {
    // BMO: bmo-brain keeps each agent's memories as versioned rows about people, rooms and situations, with a
    // person's sheet and a screen to set them right (docs/design.md of bmo-brain).
    // ChatGPT: https://help.openai.com/en/articles/8590148-memory-faq; Claude.ai:
    // https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context.
    // Open WebUI: https://docs.openwebui.com/features/chat-conversations/memory/; LibreChat:
    // https://www.librechat.ai/docs/features/memory.
    // Letta: https://docs.letta.com/concepts/stateful-agents; AutoGPT: https://agpt.co/integrations/built-in/
    // (a key-value store across runs, not a memory of conversations) - in part.
    // Devin: https://docs.devin.ai/product-guides/memory; OpenHands: none found.
    // n8n: https://docs.n8n.io/changelog (agents with memory); Dify:
    // https://docs.dify.ai/en/self-host/use-dify/nodes/llm (memory does not persist between conversations).
    capability: "memory",
    others: { hosted: "yes", chatUi: "yes", framework: "partial", coding: "partial", workflow: "partial" },
  },
  {
    // BMO: a request becomes a bmo-job item; bmo-agency runs a Claude Code or Codex worker in the repository's
    // checkout; bmo-testbed runs the checks and the suite and deploys a release once its health check answers.
    // ChatGPT: https://learn.chatgpt.com/docs/cloud (Codex opens a pull request); Claude.ai:
    // https://code.claude.com/docs/en/overview (Claude Code opens pull requests) - neither documents deploying.
    // Open WebUI: https://docs.openwebui.com/features/ (a terminal for the model, no repository flow); LibreChat:
    // https://www.librechat.ai/docs/features (a code sandbox) - none.
    // AutoGPT: https://agpt.co/integrations/github/ (blocks that open pull requests) - in part; Letta: none found.
    // Devin: https://docs.devin.ai/product-guides/deployment-capabilities (pull requests and deployed apps);
    // OpenHands: https://docs.openhands.dev/openhands/usage/use-cases/daily-workflow (edits and runs checks).
    // n8n, Dify: none found.
    capability: "shipping",
    others: { hosted: "partial", chatUi: "none", framework: "partial", coding: "partial", workflow: "none" },
  },
  {
    // BMO: bmo-arbiter shares the GPU nodes' cards among the engines, for local text, vision (bmo-eye) and speech
    // (bmo-voice).
    // ChatGPT, Claude.ai: none found.
    // Open WebUI: https://docs.openwebui.com/features/ (Ollama); LibreChat: https://www.librechat.ai/docs (Ollama).
    // Letta: https://docs.letta.com/self-hosting (Ollama, LM Studio, llama.cpp); AutoGPT:
    // https://agpt.co/docs/platform/ollama.
    // OpenHands: https://docs.openhands.dev/openhands/usage/llms/local-llms; Devin: none found.
    // n8n: https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatollama/;
    // Dify: https://docs.dify.ai/en/self-host/use-dify/nodes/llm (Ollama, LocalAI, Xinference).
    capability: "localGpu",
    others: { hosted: "none", chatUi: "yes", framework: "yes", coding: "partial", workflow: "yes" },
  },
  {
    // BMO: bmo-voice speaks with trained voices on the voice nodes and keeps a room's spoken briefings.
    // ChatGPT: https://help.openai.com/en/articles/8400625-voice-mode-faq; Claude.ai:
    // https://support.claude.com/en/articles/11101966-using-voice-mode.
    // Open WebUI: https://docs.openwebui.com/features/; LibreChat:
    // https://www.librechat.ai/docs/configuration/stt_tts.
    // Letta, AutoGPT, OpenHands: none found; Devin: https://docs.devin.ai/release-notes/2025 (voice input only).
    // Dify: https://docs.dify.ai/en/cloud/use-dify/build/additional-features (text to speech); n8n: none found.
    capability: "voice",
    others: { hosted: "yes", chatUi: "yes", framework: "none", coding: "none", workflow: "partial" },
  },
  {
    // BMO: bmo-calendar, bmo-note, bmo-drive, bmo-mail, bmo-artifact and bmo-remote each bring a screen into the
    // one console.
    // ChatGPT: https://help.openai.com/en/articles/20001052-library (a library of files); Claude.ai:
    // https://support.claude.com/en/articles/10166901-use-google-workspace-connectors (connectors to Google's
    // apps, none of its own) - in part.
    // Open WebUI: https://docs.openwebui.com/features/ (notes and a file browser) - in part; LibreChat: none found.
    // Letta, AutoGPT, OpenHands, Devin: none found. n8n: https://docs.n8n.io/advanced-ai/chat-hub/ (a chat hub);
    // Dify: none found.
    capability: "desk",
    others: { hosted: "partial", chatUi: "partial", framework: "none", coding: "none", workflow: "none" },
  },
  {
    // BMO: bmo-research runs research by category and on request and files each run as a bmo-artifact document.
    // ChatGPT: https://help.openai.com/en/articles/10500283-deep-research-faq; Claude.ai:
    // https://support.claude.com/en/articles/11095361-use-research-on-claude.
    // Open WebUI: https://docs.openwebui.com/features/chat-conversations/web-search/agentic-search/ (research by
    // repeated searches, no report mode) - in part; LibreChat: web search only.
    // Letta, AutoGPT, OpenHands: none found. Devin: https://docs.devin.ai/release-notes/2025 (Deep Research over
    // the repository) - in part.
    // Dify: https://dify.ai/blog/deepresearch-building-a-research-automation-app-with-dify (a template) - in part;
    // n8n: none found.
    capability: "research",
    others: { hosted: "yes", chatUi: "partial", framework: "none", coding: "partial", workflow: "partial" },
  },
];

export const DEFAULT_LLM_PROVIDER = "groq";
export const DEFAULT_LLM_MODEL = process.env.LLM_MODEL || "openai/gpt-oss-120b";

export function normalizeProvider(provider: string | null | undefined): string {
  const safe = provider?.trim().toLowerCase();
  return safe || DEFAULT_LLM_PROVIDER;
}

export function normalizeModel(model: string | null | undefined): string {
  const safe = model?.trim();
  return safe || DEFAULT_LLM_MODEL;
}

export function canUpdateAssignmentModel(lockedAt: string | null | undefined): boolean {
  return !lockedAt;
}

export function getModelDisplayName(modelId: string): string {
  if (!modelId) return "Unknown Model";
  const id = modelId.toLowerCase().trim();
  if (id === "openai/gpt-oss-120b") return "GPT-OSS 120B";
  if (id === "openai/gpt-oss-20b") return "GPT-OSS 20B";
  if (id === "openai/gpt-oss-safeguard-20b") return "Safety GPT-OSS 20B";
  if (id === "llama-3.3-70b-versatile") return "Llama 3.3 70B";
  return modelId;
}

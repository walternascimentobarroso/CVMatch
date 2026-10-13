import "server-only";

export function getGroqApiKey(): string {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    throw new Error("GROQ_API_KEY não está definida no .env");
  }
  return groqApiKey;
}

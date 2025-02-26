import { encodingForModel, TiktokenModel } from "js-tiktoken";

/**
 * Estimates the number of tokens in a text string for various AI models
 * @param text The text to count tokens for
 * @param model The model name
 * @returns The estimated token count
 */
export function countTokens(text: string, model: string): number {
  try {
    // Handle Claude models
    if (model.startsWith('claude')) {
      // Claude uses roughly 4 characters per token on average
      return Math.ceil(text.length / 4);
    }
    
    // For OpenAI and other supported models, use tiktoken
    const encoding = encodingForModel(model as TiktokenModel);
    return encoding.encode(text).length;
  } catch (error) {
    // Fallback for unsupported models
    console.warn(`Model ${model} not supported by tiktoken, using character-based estimation`);
    // Default to a conservative character-based estimate (1 token ≈ 4 chars)
    return Math.ceil(text.length / 4);
  }
}

/**
 * Gets the appropriate encoding for a model, with fallback for unsupported models
 * @param model The model name
 * @returns A function that encodes text to token counts
 */
export function getTokenCounter(model: string) {
  return (text: string) => countTokens(text, model);
} 
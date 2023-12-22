import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

export async function createCompletion(prompt: string, system: string | null = null): Promise<string | null> {
  let startTime = performance.now();

  const messages: Array<ChatCompletionMessageParam> = system === null
    ? [{ role: 'user', content: prompt }]
    : [{ role: 'system', content: system }, { role: 'user', content: prompt },];

  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages,
    model: 'gpt-4',
  };

  const completion = await openai.chat.completions.create(params);

  let endTime = performance.now();
  console.log(`OpenAI API call took ${(endTime - startTime) / 1000} seconds.`);

  return completion.choices[0]?.message?.content;
}
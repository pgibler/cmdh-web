import OpenAI from 'openai';
import { validateApiKey } from '../validateApiKey';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { apiKey, model, prompt, system } = await request.json();

  if (!apiKey) throw new Error('No API key provided');

  // Verify the API key
  // Assume we have a function to validate API key against Firestore
  const isValidApiKey = await validateApiKey(apiKey);
  if (!isValidApiKey) throw new Error('Invalid API key');

  const stream = await buildStream(model, prompt, system);

  // Return the complete response data
  return new Response(stream);
};

async function buildStream(model: string, prompt: string, system: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      const openai = new OpenAI();
      const stream = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt }
        ],
        stream: true,
      });

      try {
        console.time('OpenAI stream runtime');
        // Collecting data from the stream
        for await (const chunk of stream) {
          // Assuming chunk is a string or can be converted to string
          const content = chunk.choices[0].delta.content
          if (content) {
            console.log(content)
            controller.enqueue(encoder.encode(content));
          }
        }
        console.timeEnd('OpenAI stream runtime');
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });
}
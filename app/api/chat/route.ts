// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'), // High speed, low cost
    system: 'You are an environmental expert for Nature Reframe. Help users understand nature conservation.',
    messages,
  });

  return result.toDataStreamResponse();
}

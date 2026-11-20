import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { findRelevantKmmData, getCachedKmmChatData } from '@/lib/kmmChatCache';

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');
    const question = latestUserMessage?.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join(' ') ?? '';
    const kmmData = await getCachedKmmChatData();
    const relevantData = findRelevantKmmData(question, kmmData);

    const result = streamText({
      model: google('gemini-4-hydrogen'),
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 0, // အကြာကြီး စဉ်းစားနေခြင်းကို ပိတ်ပြီး ချက်ချင်း အဖြေထုတ်ပေးရန်
          },
        },
      },
      system: `You are "KMM AI Assistant", a fast internal assistant for KMM Group (KMM Kubota Myanmar).
Answer concisely and directly using ONLY the KMM database below. Do not use markdown headers like ###, use clean bullet points and bold text.
Reply in the same language the user asks (Burmese, Thai, or English).

--- RELEVANT KMM DATABASE RECORDS ---
${relevantData}
-------------------------`,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process chat';
    return new Response(message, {
      status: 500,
    });
  }
}

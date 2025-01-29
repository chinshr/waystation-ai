import { NextRequest } from "next/server";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { getAuthToken } from "@/data/services/get-token";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const TEMPLATE = `
INSTRUCTIONS: 
  For the following email:

  {text}

  complete the following steps.

  Extract the following information and and structure your response in a JSON structure with fields to extract the following information

  * supplier contact name
  * supplier contact email
  * supplier contact phone number
  * supplier company name
  * supplier contact headquarter address
  * price per pound
  * country of origin
  * certifications
  * minimum order

  Return a JSON structure.
`;

async function generateSummary(content: string, template: string) {
  const prompt = PromptTemplate.fromTemplate(template);

  console.log(process.env.OPENAI_API_KEY);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: process.env.OPENAI_TEMPERATURE
      ? parseFloat(process.env.OPENAI_TEMPERATURE)
      : 0.7,
    maxTokens: process.env.OPENAI_MAX_TOKENS
      ? parseInt(process.env.OPENAI_MAX_TOKENS)
      : 4000,
  });

  const outputParser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(outputParser);

  try {
    console.log(content);

    const summary = await chain.invoke({ text: content });

    console.log(summary);

    return summary;
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      console.log(error.message);

      return new Response(JSON.stringify({ error: error.message }));
    }

    return new Response(
      JSON.stringify({ error: "Failed to generate summary." })
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserMeLoader();
  const token = await getAuthToken();

  if (!user.ok || !token) {
    return new Response(
      JSON.stringify({ data: null, error: "Not authenticated" }),
      { status: 401 }
    );
  }

  if (user.data.credits < 1) {
    return new Response(
      JSON.stringify({
        data: null,
        error: "Insufficient credits",
      }),
      { status: 402 }
    );
  }

  const body = await req.json();
  const quoteId = body.quoteId;
  const emailText = body?.emailText

  console.log(body);
  console.log(quoteId);

  let summary: Awaited<ReturnType<typeof generateSummary>>;

  try {
    summary = await generateSummary(emailText, TEMPLATE);
    return new Response(JSON.stringify({ data: summary, error: null }));
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(JSON.stringify({ error: "Error generating summary." }));
  }
}

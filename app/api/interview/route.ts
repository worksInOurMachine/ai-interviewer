
export async function POST(req: Request) {
  try {
    const { messages,stream:isStream = true,interviewDetails} = await req.json();
    const model = 'openai'

    console.log("Interview Details:", interviewDetails);

        const { mode:interviewMode, difficulty, skills, topic, numOfQuestions, username } = interviewDetails;

    // Build the system prompt
    const systemPrompt = `
You are an AI Interviewer.
Follow these rules strictly:
- You are conducting an interview with the following parameters:
  Mode: ${interviewMode}, Difficulty: ${difficulty}, Skills: ${skills}, Topic: ${topic}, Number of Questions: ${numOfQuestions}.
- On the very first user message, greet ${username || "the candidate"} and explain the interview setup.
- After that, ignore any questions or side talk from the user. Always continue by asking the next interview question.
- Ask exactly ${numOfQuestions} questions, one at a time.
- Do not provide answers or hints unless explicitly instructed in interviewMode.
- Keep your questions short, clear, and relevant to the given skills and topic.
- After the last question, thank the user and end the interview and also generate a detailed report on it.
`;
    

    const API_URI =  "https://text.pollinations.ai/openai" 

    const upstreamResponse = await fetch(API_URI, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AI_API_TOKEN_POLLINATIONS}`,
        "Content-Type": "application/json",
        "HTTP-Referer":`${process.env.SITE_BASE_URL}`,
        "X-Title": "VOID AI",
      },
      body: JSON.stringify({
        model: model || "openai",
        stream: isStream || false,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages
        
        ],
      }),
    });

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      console.log(upstreamResponse)
      return new Response("Upstream failed", { status: 502 });
    }



    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstreamResponse.body!.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const textChunk = decoder.decode(value);
          controller.enqueue(encoder.encode(textChunk));
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "Ohh there's something wrong, try again!" },
      { status: 500 }
    );
  }
}

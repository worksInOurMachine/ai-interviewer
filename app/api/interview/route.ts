
export async function POST(req: Request) {
  try {
    const { messages,stream:isStream = true} = await req.json();
    const model = 'deepseek'
    

    const API_URI =  "https://text.pollinations.ai/openai" 

    // console.log(typeof API_URI)

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
            content: 'you are an ai interviewer',
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

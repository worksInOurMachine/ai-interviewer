export async function POST(req: Request) {
  try {
    const {  roadmapDetails } = await req.json();

    const model = "mistral";

    const systemPrompt = `
 You are a Professional AI Roadmap Generator.

Your role is to create structured, consistent, and detailed learning roadmaps based on the user’s inputs. 
Every roadmap must follow the exact same format and include learning resources, practical tasks, 
and a final capstone project.

📋 Roadmap Parameters:
- Job Role: ${roadmapDetails?.jobRole}
- Required Skills: ${roadmapDetails?.skills}
- Roadmap Duration (in months): ${roadmapDetails?.duration}

✅ Your Output Format (must always be identical):

1. Job Role Overview  
   - Provide 2–3 sentences describing the role, responsibilities, and its importance.

2. Skills Breakdown  
   - List each skill from the input and give a short explanation for each.

3. Month-by-Month Roadmap  
   For each month, include:
   - Learning Goals
   - Topics to Study
   - Practical Assignments / Mini-Projects

4. Learning Resources  
   Provide resources for the skills and monthly topics:  
   - Free Resources  
   - Paid Resources  
   - YouTube Channels and urls if available
   - Official Documentation and urls if available

5. Capstone Project  
   - A final project that applies all skills learned.
   - Explain its purpose and expected outcomes.

6. Extra Tips  
   - Provide 5–7 tips for staying consistent and mastering the job role.

🎯 Rules:
- Keep format consistent for every roadmap.
- Do not change the structure.
- Use clear headings and bullet points.
- Avoid unnecessary fluff.
- output in raw json format and file name should be roadmap.json
`;

    const API_URI = "https://text.pollinations.ai/openai";
    const response = await fetch(API_URI, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AI_API_TOKEN_POLLINATIONS}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
        ],
      }),
    });

    const data = await response.json();
    const roadmap =
      data?.choices?.[0]?.message?.content ||
      "No roadmap generated.";

    return new Response(JSON.stringify({ roadmap }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("Report generation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate roadmap" }),
      {
        status: 500,
      }
    );
  }
}





 
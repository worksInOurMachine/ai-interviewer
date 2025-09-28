export async function POST(req: Request) {
  try {
    const { messages, interviewDetails, faceMeshFeedback } = await req.json();

    const model = "mistral";

    const systemPrompt = `
You are an expert AI recruiter. Generate a **full interview report** using **pure Markdown formatting** only.  

Instructions:

1. **Output only Markdown** — no HTML tags, no triple backticks, no plain text formatting.
2. Use semantic Markdown:
   - Headings: #, ##, ###
   - Lists: -, *
   - Bold and italics for emphasis
   - Emojis for visual cues (✅ for strengths, ⚠️ for weaknesses, 🔍 for follow-ups)
3. Structure the report with these sections in order:
   - # Interview Report
   - ## Candidate Information
   - ## Answer Analysis
   - ## Overall Performance
   - ## Summary & Hiring Recommendation
4. Candidate Information section must show:
   - **Job Role:** ${interviewDetails?.topic || "N/A"}
   - **Difficulty:** ${interviewDetails?.difficulty || "N/A"}
   - **Mode:** ${interviewDetails?.mode || "N/A"}
   - **Number of Questions:** ${interviewDetails?.numOfQuestions || "N/A"}
   - **Skills Assessed:** ${interviewDetails?.skills || "N/A"}
5. Answer Analysis section should include:
   - **Candidate Answers Summary:** (summarize all answers concisely)
   - **Strengths:** list with ✅ bullets
   - **Weaknesses:** list with ⚠️ bullets
   - **Communication Style:** (clarity, conciseness, professionalism)
   - **Problem-Solving Approach:** (logic, methodology, critical thinking)
   - **What answers reveal:** bulleted insights per topic
6. Overall Performance:
   - Honest, concise professional summary
   - Explicit **Hiring Recommendation:** Yes / Maybe / No, with justification
7. Summary & Hiring Recommendation:
   - Final paragraph summary
   - **Recommendation:** Yes / Maybe / No
   - **Rationale:** 2–3 bullet points
   - **Actionable Next Steps:** 2–4 concrete follow-ups
8. Tone & style:
   - Professional, readable, visually scannable
   - Include facial analytics
   - Encouraging but critical
   - Use emojis for visual emphasis instead of inline colors
   - Short paragraphs and bulleted lists
9. Length: Target 100–400 words.
10. Requirements:
   - Output **pure Markdown only**
   - Do not include HTML, CSS, or code blocks
   - Be honest, analytical, and actionable
   - Report should be in simple and easy words, and normal english so everyone can understand
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
          {
            role: "user",
            content:
              JSON.stringify(messages) +
              `facial analytics = ${JSON.stringify(faceMeshFeedback)}` +
              "",
          },
        ],
      }),
    });

    const data = await response.json();
    const report =
      data?.choices?.[0]?.message?.content ||
      "# Interview Report\n\n_No report generated._";

    return new Response(JSON.stringify({ report }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate report" }),
      {
        status: 500,
      }
    );
  }
}

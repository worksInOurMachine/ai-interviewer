export async function POST(req: Request) {
  try {
    const { messages, interviewDetails, faceMeshFeedback } = await req.json();

    const model = "mistral";

    const systemPrompt = `
You are an expert AI recruiter. Generate a **full HTML interview report** inside a Markdown string, ready to render in ReactMarkdown + rehypeRaw.  

Instructions:

1. **Output only HTML** — no Markdown headings, triple backticks, or plain text formatting.
2. Use semantic HTML: <div>, <section>, <h1>, <h2>, <ul>, <li>, <p>, <span>.
3. Use **inline styles** for readability:
   - Border, padding, margin, rounded corners, and light background for the report sections.
   - Strengths in green ✅ using <span style="color:green;">...</span>
   - Weaknesses in red ⚠️ using <span style="color:red;">...</span>
   - Proper line-height and spacing.
4. Include **all content in one report** — do not repeat sections per question.
5. Be **honest, analytical, and actionable** — comment on what each answer reveals about the candidate.
6. Include a **summary and hiring recommendation** at the end.
7. Keep the HTML ready to render in **ReactMarkdown + rehypeRaw**.

Structure:

<div class="interview-report" style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">

  <section class="candidate-info" style="margin-bottom:20px;">
    <h2 style="color:#34495e;">Candidate Information</h2>
    <ul>
      <li><strong>Job Role:</strong> ${interviewDetails?.topic || "N/A"}</li>
      <li><strong>Difficulty:</strong> ${
        interviewDetails?.difficulty || "N/A"
      }</li>
      <li><strong>Mode:</strong> ${interviewDetails?.mode || "N/A"}</li>
      <li><strong>Number of Questions:</strong> ${
        interviewDetails?.numOfQuestions || "N/A"
      }</li>
      <li><strong>Skills Assessed:</strong> ${
        interviewDetails?.skills || "N/A"
      }</li>
    </ul>
  </section>

  <section class="answer-analysis" style="margin-bottom:20px;">
    <h2 style="color:#34495e;">Answer Analysis</h2>
    <div style="border:1px solid #ddd; padding:15px; margin-bottom:15px; border-radius:8px; background-color:#fafafa;">
      <p><strong>Candidate Answers Summary:</strong> (Summarize all answers concisely)</p>
      <p><strong>Strengths:</strong> <span style="color:green;">(Highlight main strengths across all answers)</span></p>
      <p><strong>Weaknesses:</strong> <span style="color:red;">(Highlight main weaknesses or gaps)</span></p>
      <p><strong>Communication Style:</strong> (Comment on clarity, conciseness, and professionalism)</p>
      <p><strong>Problem-Solving Approach:</strong> (Analyze logic, methodology, and critical thinking)</p>
    </div>
  </section>

  <section class="overall-performance" style="margin-bottom:20px;">
    <h2 style="color:#34495e;">Overall Performance</h2>
    <p><strong>Summary:</strong> (Provide an honest, concise, professional summary of the candidate's overall performance)</p>
    <p><strong>Hiring Recommendation:</strong> Yes / Maybe / No — (Explain reasoning briefly)</p>
  </section>

</div>

Requirements:

1. Output **pure HTML only** — no Markdown or backticks.
2. Keep the report **professional, readable, visually scannable**, and ready to render in ReactMarkdown + rehypeRaw.
3. Be **honest, critical, and analytical**.
4. Include **visual cues** (colors, spacing, borders) for clarity and emphasis.
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

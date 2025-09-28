export async function POST(req: Request) {
  try {
    const { messages, interviewDetails } = await req.json();

    const model = "gemini";

    const systemPrompt = `
You are an expert AI recruiter. Your task is to generate a polished **Markdown interview report** that is insightful, honest, and visually structured. 

Follow this format and include visual cues for readability:

# Interview Report

## Candidate Information
- **Job Role:** ${interviewDetails?.topic || "N/A"}
- **Difficulty:** ${interviewDetails?.difficulty || "N/A"}
- **Mode:** ${interviewDetails?.mode || "N/A"}
- **Number of Questions:** ${interviewDetails?.numOfQuestions || "N/A"}
- **Skills Assessed:** ${interviewDetails?.skills || "N/A"}

---

## Answer Analysis

For each candidate answer, analyze honestly and ask yourself: *“What does this answer truly reveal about the candidate?”*

**Question:** (Insert question text)

**Candidate Answer:** (Insert candidate answer summary)

- ✅ **Strengths:**  
  Highlight the candidate’s real strengths, focusing on skills, approach, and clarity.

- ⚠️ **Weaknesses:**  
  Point out specific areas for improvement or gaps in knowledge/communication.

- 💬 **Communication Style:**  
  Comment on clarity, conciseness, and professionalism.

- 🧩 **Problem-Solving Approach:**  
  Analyze logic, methodology, and thought process. Include honest insights.

---

## Overall Performance

- **Summary:**  
  Provide an honest, concise, professional summary of the candidate’s overall performance. Avoid generic statements; be analytical and objective.

- **Hiring Recommendation:**  
  Yes / Maybe / No — explain reasoning briefly.

---

**Requirements:**

1. Output **valid Markdown only** — do not include HTML or backticks.
2. Keep the report **professional, concise, readable, and visually scannable**.
3. Be honest and critical in your analysis — ask what the candidate’s answers truly reveal.
4. Use headings, bold, lists, horizontal rules (\`---\`), and emojis effectively for clarity and emphasis.
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
          { role: "user", content: JSON.stringify(messages) + "" },
        ],
      }),
    });

    const data = await response.json();
    const report =
      data?.choices?.[0]?.message?.content || "# Interview Report\n\n_No report generated._";

    return new Response(JSON.stringify({ report }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate report" }), {
      status: 500,
    });
  }
}

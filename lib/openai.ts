import OpenAI from "openai"

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set")
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateProposal(params: {
  grantTitle: string
  goal: string
  orgType: string
  grantDescription?: string
}) {
  const prompt = `You are an expert grant proposal writer specializing in African development projects. Write a comprehensive, professional grant proposal based on the following information:

**Grant Opportunity:** ${params.grantTitle}
${params.grantDescription ? `\n**Grant Description:** ${params.grantDescription}` : ''}

**Organization Type:** ${params.orgType}

**Project Goal/Idea:** ${params.goal}

Please generate a complete grant proposal that includes:

1. **Executive Summary** - A compelling overview of the project (150-200 words)

2. **Introduction** - Background about the organization and its mission

3. **Problem Statement** - Clear articulation of the problem or need being addressed

4. **Project Objectives** - Specific, measurable, achievable, relevant, and time-bound (SMART) objectives

5. **Methodology** - Detailed approach and activities to achieve the objectives

6. **Expected Outcomes and Impact** - Tangible results and long-term benefits, especially for African communities

7. **Budget Overview** - High-level budget categories and justification

8. **Sustainability Plan** - How the project will continue beyond the grant period

9. **Conclusion** - Strong closing statement reinforcing the project's value

The proposal should be:
- Professional and well-structured
- Culturally sensitive and relevant to African contexts
- Clear, concise, and compelling
- Approximately 2000-2500 words in total
- Written in a tone that demonstrates expertise and passion

Generate the proposal now:`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert grant proposal writer with deep knowledge of African development, non-profit organizations, and effective grant writing techniques. Your proposals are professional, compelling, and tailored to the specific grant opportunity."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    })

    return completion.choices[0]?.message?.content || ""
  } catch (error) {
    console.error("OpenAI API Error:", error)
    throw new Error("Failed to generate proposal. Please try again.")
  }
}




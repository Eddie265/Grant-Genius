import OpenAI from "openai"

// Groq exposes an OpenAI-compatible API, so both providers share the OpenAI SDK.
// Anthropic (Claude) will slot in here once its key is added.
const providers = {
  groq: {
    apiKey: () => process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
    model: () => process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    // gpt-oss models reason before answering; keep that short so the budget goes to the proposal
    extra: { reasoning_effort: "low" as const, max_completion_tokens: 8000 },
  },
  openai: {
    apiKey: () => process.env.OPENAI_API_KEY,
    baseURL: undefined,
    model: () => process.env.OPENAI_MODEL || "gpt-4",
    extra: { max_tokens: 3000 },
  },
} as const

type ProviderName = keyof typeof providers

const clients = new Map<ProviderName, OpenAI>()

// AI_PROVIDER picks a provider explicitly; otherwise use the first one with a key
function resolveProvider(): ProviderName {
  const requested = process.env.AI_PROVIDER as ProviderName | undefined
  if (requested && requested in providers) {
    if (!providers[requested].apiKey()) {
      throw new Error(`AI_PROVIDER is "${requested}" but its API key is not configured`)
    }
    return requested
  }

  const available = (Object.keys(providers) as ProviderName[]).find((name) => providers[name].apiKey())
  if (!available) {
    throw new Error("No AI provider is configured. Set GROQ_API_KEY or OPENAI_API_KEY")
  }
  return available
}

function getClient(name: ProviderName) {
  if (!clients.has(name)) {
    const provider = providers[name]
    clients.set(name, new OpenAI({ apiKey: provider.apiKey(), baseURL: provider.baseURL }))
  }
  return clients.get(name)!
}

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
- Formatted in Markdown, with "##" headings for each section

Accuracy rules (important):
- Do not invent statistics, budget figures, beneficiary numbers, partner names, past results or citations.
- Where a specific fact is needed, insert a clearly marked placeholder such as [insert number of beneficiaries] or [insert source].

Generate the proposal now:`

  try {
    const provider = resolveProvider()
    const client = getClient(provider)

    const completion = await client.chat.completions.create({
      model: providers[provider].model(),
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
      ...providers[provider].extra,
    })

    return completion.choices[0]?.message?.content || ""
  } catch (error) {
    console.error("AI provider error:", error)
    throw new Error("Failed to generate proposal. Please try again.")
  }
}




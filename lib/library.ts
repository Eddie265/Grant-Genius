// Grant-writing guides and templates shown in the dashboard library.
// Bodies are Markdown; templates can be turned into an editable proposal.

export type Guide = {
  slug: string
  title: string
  type: "Guide" | "Template"
  summary: string
  minutes: number
  body: string
}

export const guides: Guide[] = [
  {
    slug: "proposal-structure-template",
    title: "Standard grant proposal template",
    type: "Template",
    summary: "A section-by-section outline most funders recognise, with prompts for what to write in each part.",
    minutes: 4,
    body: `## 1. Executive Summary
[In 150–200 words: who you are, the problem, what you will do, for whom, where, for how long, how much you are requesting, and the main result you expect.]

## 2. Organisation Background
[Legal status and registration number, year founded, mission, relevant past work and results with evidence, key staff.]

## 3. Problem Statement
[The specific problem in your target area, who is affected, evidence and sources, root causes, and why it matters now.]

## 4. Goal and Objectives
**Goal:** [the long-term change you contribute to]

- Objective 1: [specific, measurable, time-bound]
- Objective 2: [specific, measurable, time-bound]

## 5. Activities and Methodology
[What you will do under each objective, who does it, where, and why this approach will work.]

## 6. Monitoring, Evaluation and Learning
[Indicators, baselines, targets, data sources, how often you measure, and who is responsible.]

## 7. Work Plan
[Key activities by quarter or month.]

## 8. Budget Summary
[Main cost categories, total requested, co-funding or in-kind contributions.]

## 9. Sustainability
[How results continue after the grant: community ownership, partnerships, income, policy change.]

## 10. Risks and Mitigation
[Main risks and how you will reduce them.]

## 11. Conclusion
[A short closing that restates the need, your fit and the impact of funding.]`,
  },
  {
    slug: "concept-note-template",
    title: "Concept note template (2 pages)",
    type: "Template",
    summary: "A short-form outline for funders that ask for a concept note or letter of inquiry before a full proposal.",
    minutes: 3,
    body: `## Project Title
[Clear, descriptive title]

## Applicant
[Organisation name, country, registration status, contact person]

## The Problem
[Two or three sentences with evidence, and the source of that evidence.]

## Proposed Solution
[What you will do, for whom, and where.]

## Expected Results
- [Result 1 with a measurable target]
- [Result 2 with a measurable target]

## Why Us
[Relevant experience, partnerships and community trust.]

## Duration and Budget
[Duration in months] · [Total budget and amount requested]

## Alignment with the Funder
[Quote or reference the funder's priority this project answers.]`,
  },
  {
    slug: "writing-a-problem-statement",
    title: "Writing a convincing problem statement",
    type: "Guide",
    summary: "How to describe the need clearly, back it with evidence and connect it to your solution.",
    minutes: 5,
    body: `A problem statement shows the funder that the need is real, specific and something your project can change.

## Start narrow
Describe the problem as it affects a defined group in a defined place: “women smallholder farmers in two districts”, not “poverty in Africa”.

## Use evidence, and cite it
Use recent figures from credible sources: national statistics offices, government ministries, UN agencies, peer-reviewed research, or your own baseline surveys. Always name the source and year. Never estimate a number and present it as fact.

## Explain the causes
Funders want to see that you understand *why* the problem exists. Two or three root causes are enough, and each should link to one of your activities.

## Show the consequences
What happens if nothing changes? Keep it factual and avoid exaggeration.

## Bring in community voice
A short quote or finding from consultations with the people affected shows that the project responds to real priorities.

## Checklist
- Is the problem specific to a group and location?
- Is every figure sourced?
- Do the causes connect to your activities?
- Would a reader outside your sector understand it?`,
  },
  {
    slug: "smart-objectives-and-logframes",
    title: "SMART objectives and logframes",
    type: "Guide",
    summary: "Turn goals into measurable objectives and organise them into a simple results framework.",
    minutes: 6,
    body: `## SMART objectives
Each objective should be:

- **Specific:** what will change, and for whom
- **Measurable:** an indicator you can count or observe
- **Achievable:** realistic with the budget and time
- **Relevant:** linked to the problem and the funder's priorities
- **Time-bound:** with a clear deadline

*Weak:* “Improve nutrition in the community.”
*Stronger:* “By month 18, increase the share of participating households eating three meals a day from [baseline]% to [target]%.”

## A simple logframe
A logical framework links each level of results:

1. **Goal:** the long-term change you contribute to.
2. **Outcomes:** changes in behaviour, practice or conditions for your participants.
3. **Outputs:** what your project delivers directly (people trained, systems installed).
4. **Activities:** what you do to produce the outputs.

For each level, list indicators, the means of verification (where the data comes from) and key assumptions.

## Tips
- Use baselines. If you don't have one, plan a baseline survey in the first months.
- Keep indicators few and meaningful; three to five per outcome is plenty.
- Make sure every activity in your budget appears in the logframe.`,
  },
  {
    slug: "budgeting-for-grants",
    title: "Building a credible grant budget",
    type: "Guide",
    summary: "Structure, justify and present a budget that matches your activities and the funder's rules.",
    minutes: 6,
    body: `A budget is the financial version of your work plan. Reviewers check that it is realistic, complete and consistent with your proposal.

## Follow the funder's format
Use their template, currency, cost categories and rules on eligible costs, indirect cost rates and co-funding.

## Common cost categories
- Personnel (salaries, with the percentage of time on the project)
- Activities (training, events, materials)
- Travel and transport
- Equipment
- Monitoring and evaluation
- Indirect or administrative costs (if allowed)

## Justify every line
Show how each figure is calculated: unit cost × quantity × duration. Base unit costs on quotes, past invoices or published rates.

## Check consistency
Every activity in the narrative should have a cost, and every cost should support an activity.

## Be honest about contributions
List co-funding and in-kind contributions accurately. Don't double-count costs funded by another donor.

## Plan for currency and inflation
If you budget in a foreign currency, state the exchange rate and date you used.`,
  },
  {
    slug: "using-ai-responsibly",
    title: "Using AI responsibly in grant writing",
    type: "Guide",
    summary: "How to get value from AI drafts while staying accurate, original and compliant with funder rules.",
    minutes: 4,
    body: `AI can save hours on structure and first drafts. Used carelessly, it can also introduce errors that damage your credibility.

## Treat the draft as a starting point
Rewrite it in your organisation's voice and add the specific details only you know.

## Replace every placeholder
Grant Genius marks unknown facts like **[insert number of beneficiaries]**. Fill each one with verified information, or remove the sentence.

## Check every fact
AI models can state wrong information confidently. Verify figures, names, policies and references against original sources.

## Follow the funder's AI policy
Some funders restrict AI-generated content or require you to disclose it. Read the call guidelines and comply.

## Protect personal data
Don't paste sensitive personal information about beneficiaries or staff into any AI tool.

## Keep it original
Funders read many proposals. Specific evidence, community voice and your track record are what make yours stand out.`,
  },
]

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug)
}

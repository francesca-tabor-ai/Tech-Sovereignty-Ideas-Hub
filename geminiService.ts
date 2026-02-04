
import { GoogleGenAI, Type } from "@google/genai";
import { Idea, SimulationResult, FinancialProjection, DiplomaticSimulationResult } from "./types";

// Always use process.env.API_KEY directly as per guidelines.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export interface AnalysisResult {
  sovereigntyScore: number;
  pros: string[];
  cons: string[];
  suggestedCategory: string;
  strategicInsight: string;
}

export interface StrategicReport {
  executiveSummary: string;
  keyPillars: { title: string; description: string }[];
  gapAnalysis: string;
  topPerformers: { id: string; title: string; rationale: string }[];
  recommendations: string[];
}

export interface DraftedProposal {
  title: string;
  description: string;
  category: string;
  tags: string[];
  impactForecast: string;
}

export interface PRDReport {
  title: string;
  problemStatement: string;
  goals: string[];
  functionalRequirements: { feature: string; priority: 'High' | 'Medium' | 'Low' }[];
  technicalConstraints: string[];
  stakeholderImpact: string;
  sovereigntyAlignment: string;
}

export interface GeopoliticalReport {
  title: string;
  globalPosture: string;
  frictionAnalysis: { bloc: string; riskLevel: 'Critical' | 'High' | 'Moderate' | 'Low'; rationale: string }[];
  strategicLeveragePoints: string[];
  mitigationStrategies: string[];
  longTermForecast: string;
}

export const analyzeIdea = async (title: string, description: string): Promise<AnalysisResult> => {
  const ai = getAI();
  const prompt = `Analyze this technology sovereignty idea:
  Title: ${title}
  Description: ${description}
  
  Provide a structured evaluation including:
  1. A "Sovereignty Score" (1-100) representing its contribution to national or organizational tech independence.
  2. 3 Pros and 3 Cons.
  3. The most fitting category from: Governance & Standards, Sovereign Infrastructure, Capital & Risk, Market Design, Talent & Education, Narrative & Influence, Frontier / Radical.
  4. A one-sentence strategic insight.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sovereigntyScore: { type: Type.NUMBER },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedCategory: { type: Type.STRING },
            strategicInsight: { type: Type.STRING }
          },
          required: ['sovereigntyScore', 'pros', 'cons', 'suggestedCategory', 'strategicInsight']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      sovereigntyScore: 50,
      pros: ["Potential for impact", "Community interest", "Addresses core issue"],
      cons: ["Feasibility concerns", "Regulatory hurdles", "Resource intensive"],
      suggestedCategory: "Frontier / Radical",
      strategicInsight: "This idea requires further refinement but targets a critical gap."
    };
  }
};

export const runDiplomaticSimulation = async (idea: Idea, blocs: string[]): Promise<DiplomaticSimulationResult> => {
  const ai = getAI();
  const prompt = `Run a multi-agent diplomatic simulation for this technology sovereignty proposal:
  Title: ${idea.title}
  Description: ${idea.description}

  The following geopolitical blocs are participating: ${blocs.join(', ')}.
  
  Act as high-level diplomatic agents for each bloc. Provide a detailed critique based on their specific geopolitical interests.
  - EU: Focuses on data privacy, ethical AI, and strategic autonomy within a rules-based order.
  - USA: Focuses on commercial leadership, security alliances (Five Eyes), and counter-China strategy.
  - BRICS+: Focuses on multi-polarity, de-dollarization, and ending Western tech monopolies.
  - Global South: Focuses on infrastructure equality, digital colonialism prevention, and tech transfer.

  Return the results as a JSON object:
  - overallFriction: A number from 0-100 representing global diplomatic tension caused by this proposal.
  - critiques: Array of objects { blocName, personaTitle, stance (Supportive|Neutral|Opposed|Adversarial), critique (3 sentences), strategicLeverage (1 sentence) }.
  - geopoliticalSummary: A concise wrap-up of the global sentiment.
  - recommendedDiplomaticApproach: How the author should pitch this to avoid major friction.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallFriction: { type: Type.NUMBER },
            critiques: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  blocName: { type: Type.STRING },
                  personaTitle: { type: Type.STRING },
                  stance: { type: Type.STRING },
                  critique: { type: Type.STRING },
                  strategicLeverage: { type: Type.STRING }
                },
                required: ['blocName', 'personaTitle', 'stance', 'critique', 'strategicLeverage']
              }
            },
            geopoliticalSummary: { type: Type.STRING },
            recommendedDiplomaticApproach: { type: Type.STRING }
          },
          required: ['overallFriction', 'critiques', 'geopoliticalSummary', 'recommendedDiplomaticApproach']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Diplomatic Simulation Failed:", error);
    throw error;
  }
};

export const generateGeopoliticalReport = async (idea: Idea, frictionResult: DiplomaticSimulationResult): Promise<GeopoliticalReport> => {
  const ai = getAI();
  const prompt = `Synthesize a formal "Geopolitical Impact Assessment" for the following sovereign tech initiative:
  Title: ${idea.title}
  
  Based on these simulation findings:
  Summary: ${frictionResult.geopoliticalSummary}
  Global Friction: ${frictionResult.overallFriction}%

  Format the response as a JSON object with:
  - title: Formal report title.
  - globalPosture: A 3-sentence summary of the world's likely response.
  - frictionAnalysis: A list of 4 objects { bloc, riskLevel (Critical|High|Moderate|Low), rationale }.
  - strategicLeveragePoints: A list of 3 ways this initiative grants geopolitical power.
  - mitigationStrategies: A list of 3 ways to reduce international tension.
  - longTermForecast: A brief prediction of the global landscape in 10 years if implemented.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            globalPosture: { type: Type.STRING },
            frictionAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  bloc: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, enum: ['Critical', 'High', 'Moderate', 'Low'] },
                  rationale: { type: Type.STRING }
                },
                required: ['bloc', 'riskLevel', 'rationale']
              }
            },
            strategicLeveragePoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            mitigationStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
            longTermForecast: { type: Type.STRING }
          },
          required: ['title', 'globalPosture', 'frictionAnalysis', 'strategicLeveragePoints', 'mitigationStrategies', 'longTermForecast']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Geopolitical Report Synthesis Failed:", error);
    throw error;
  }
};

export const draftProposal = async (rawInput: string): Promise<DraftedProposal> => {
  const ai = getAI();
  const prompt = `Convert the following raw idea into a professional tech sovereignty proposal:
  "${rawInput}"

  Return a JSON object with:
  - title: A compelling, formal title.
  - description: A detailed, clear executive summary of the proposal.
  - category: One of (Governance & Standards, Sovereign Infrastructure, Capital & Risk, Market Design, Talent & Education, Narrative & Influence, Frontier / Radical).
  - tags: 3-4 relevant technical or policy tags.
  - impactForecast: A brief projection of how this helps technology autonomy.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            impactForecast: { type: Type.STRING }
          },
          required: ['title', 'description', 'category', 'tags', 'impactForecast']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Drafting Failed:", error);
    throw error;
  }
};

export const generateFinancialModel = async (idea: Idea, horizon: number): Promise<FinancialProjection[]> => {
  const ai = getAI();
  const prompt = `Generate a 5-year financial projection for this sovereign technology investment:
  Title: ${idea.title}
  Current Impact Score: ${idea.impactScore}
  Horizon: ${horizon} years

  Return a JSON array of objects with keys: year, roi (percentage), sovereigntyGain (0-100 index), cost (USD in millions).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.NUMBER },
              roi: { type: Type.NUMBER },
              sovereigntyGain: { type: Type.NUMBER },
              cost: { type: Type.NUMBER }
            },
            required: ['year', 'roi', 'sovereigntyGain', 'cost']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Financial Model Generation Failed:", error);
    return [];
  }
};

export const simulateGeopoliticalShock = async (idea: Idea, scenario: string): Promise<SimulationResult> => {
  const ai = getAI();
  const prompt = `Simulate a geopolitical shock scenario: "${scenario}"
  Against this technology sovereignty proposal:
  Title: ${idea.title}
  Description: ${idea.description}

  Provide a resilience assessment in JSON:
  - scenarioName: The name of the shock.
  - resilienceScore: Overall score (0-100).
  - metrics: { continuity: 0-100, security: 0-100, adaptability: 0-100 }
  - analysis: A 3-sentence summary of how the proposal withstands the shock.
  - mitigationSteps: 3 concrete steps to improve its resilience.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenarioName: { type: Type.STRING },
            resilienceScore: { type: Type.NUMBER },
            metrics: {
              type: Type.OBJECT,
              properties: {
                continuity: { type: Type.NUMBER },
                security: { type: Type.NUMBER },
                adaptability: { type: Type.NUMBER }
              },
              required: ['continuity', 'security', 'adaptability']
            },
            analysis: { type: Type.STRING },
            mitigationSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['scenarioName', 'resilienceScore', 'metrics', 'analysis', 'mitigationSteps']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Simulation Failed:", error);
    throw error;
  }
};

export const generateStrategicReport = async (ideas: Idea[]): Promise<StrategicReport> => {
  const ai = getAI();
  const summaryData = ideas.map(i => ({
    title: i.title,
    cat: i.category,
    score: i.sovereigntyScore,
    impact: i.impactScore
  }));

  const prompt = `Act as a senior technology sovereignty consultant. Based on the following real-time data from our "Sovereign Ideas Hub", generate a comprehensive strategic report:
  
  DATA:
  ${JSON.stringify(summaryData)}

  The report must follow this JSON structure:
  - executiveSummary: A 3-sentence high-level overview.
  - keyPillars: Array of 3 strategic pillars currently represented in the data.
  - gapAnalysis: A brief paragraph on what is missing or under-represented.
  - topPerformers: Array of 3 objects {id, title, rationale} identifying the most promising ideas.
  - recommendations: Array of 3 specific action points for the board.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            keyPillars: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: { title: { type: Type.STRING }, description: { type: Type.STRING } },
                required: ['title', 'description']
              } 
            },
            gapAnalysis: { type: Type.STRING },
            topPerformers: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, rationale: { type: Type.STRING } },
                required: ['id', 'title', 'rationale']
              } 
            },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['executiveSummary', 'keyPillars', 'gapAnalysis', 'topPerformers', 'recommendations']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Report Generation Failed:", error);
    throw error;
  }
};

export const summarizeDiscussion = async (comments: string[]): Promise<string> => {
  if (comments.length === 0) return "No discussion yet.";
  
  const ai = getAI();
  const prompt = `Summarize the following discussion thread about a tech sovereignty proposal in 3 sentences:
  ${comments.join('\n')}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "Summary unavailable.";
  } catch (error) {
    return "Failed to generate summary.";
  }
};

export const generatePRD = async (idea: Idea): Promise<PRDReport> => {
  const ai = getAI();
  const prompt = `Generate a Product Requirements Document (PRD) for the following technology sovereignty initiative:
  Title: ${idea.title}
  Rationale: ${idea.description}
  Category: ${idea.category}
  
  Format the response as a JSON object with:
  - title: The initiative title.
  - problemStatement: A 2-sentence description of the problem this solves.
  - goals: A list of 3 strategic goals.
  - functionalRequirements: A list of 5 requirements with features and priority (High, Medium, Low).
  - technicalConstraints: A list of 3 constraints (e.g. data residency, latency).
  - stakeholderImpact: A 2-sentence summary of how this impacts regulators and investors.
  - sovereigntyAlignment: A brief statement on how this anchors digital autonomy.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            problemStatement: { type: Type.STRING },
            goals: { type: Type.ARRAY, items: { type: Type.STRING } },
            functionalRequirements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
                },
                required: ['feature', 'priority']
              }
            },
            technicalConstraints: { type: Type.ARRAY, items: { type: Type.STRING } },
            stakeholderImpact: { type: Type.STRING },
            sovereigntyAlignment: { type: Type.STRING }
          },
          required: ['title', 'problemStatement', 'goals', 'functionalRequirements', 'technicalConstraints', 'stakeholderImpact', 'sovereigntyAlignment']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("PRD Generation Failed:", error);
    throw error;
  }
};

import { geminiClient, isGeminiConfigured, defaultModel } from "../config/gemini.js";

async function callGemini(prompt, systemInstruction = "") {
  if (!isGeminiConfigured || !geminiClient) {
    return null;
  }

  try {
    // Try via interactions API first
    if (geminiClient.interactions?.create) {
      const interaction = await geminiClient.interactions.create({
        model: defaultModel,
        input: prompt,
        system_instruction: systemInstruction || undefined
      });
      return interaction.output_text;
    }

    // Try via models.generateContent
    if (geminiClient.models?.generateContent) {
      const res = await geminiClient.models.generateContent({
        model: defaultModel,
        contents: prompt
      });
      return res.text || res.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }
  } catch (err) {
    console.warn("[Gemini API Warning]:", err.message);
    // If standard model failed, try with fallback model like gemini-2.0-flash or gemini-1.5-flash
    try {
      if (geminiClient.models?.generateContent) {
        const fallbackRes = await geminiClient.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt
        });
        return fallbackRes.text || null;
      }
    } catch {
      // Return null to trigger fallback
    }
  }

  return null;
}

export const geminiService = {
  isConfigured: () => isGeminiConfigured,

  /**
   * Break down an assignment into actionable steps
   */
  breakdownTask: async (task) => {
    const prompt = `You are an academic coach for university students. Break down the following task into 3 to 5 actionable subtasks/study milestones:
Task: "${task.title}"
Subject: "${task.subject || "General"}"
Description: "${task.description || "None"}"
Estimated Hours: ${task.estimatedHours || 2}

Respond ONLY with a valid JSON object in this exact schema (no markdown, no backticks):
{
  "summary": "Short 1-sentence strategic guidance",
  "subtasks": [
    { "step": "Actionable step title", "estimatedMinutes": 45, "tip": "Practical study tip" }
  ],
  "totalEstimatedMinutes": 180,
  "recommendedStrategy": "Active recall / Pomodoro recommendation"
}`;

    const raw = await callGemini(prompt);
    if (raw) {
      try {
        const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
        return {
          ...JSON.parse(clean),
          poweredBy: "Gemini AI"
        };
      } catch {
        // Parse error, fall through to fallback
      }
    }

    // Offline / Fallback breakdown
    const hours = Number(task.estimatedHours) || 2;
    const totalMinutes = Math.round(hours * 60);
    return {
      summary: `Structured study path for ${task.title}.`,
      subtasks: [
        {
          step: "Review syllabus requirements & lecture notes",
          estimatedMinutes: Math.round(totalMinutes * 0.25),
          tip: "Identify key formulas, theorems, or requirements first."
        },
        {
          step: "Draft core solution / implementation code",
          estimatedMinutes: Math.round(totalMinutes * 0.5),
          tip: "Focus on getting a working draft before optimizing."
        },
        {
          step: "Verification, testing, and formatting submission",
          estimatedMinutes: Math.round(totalMinutes * 0.25),
          tip: "Check edge cases and export to required format."
        }
      ],
      totalEstimatedMinutes: totalMinutes,
      recommendedStrategy: "25-minute Pomodoro intervals with 5-minute active recall breaks.",
      poweredBy: isGeminiConfigured ? "Heuristic (Gemini parsing fallback)" : "Built-in Coach (Add GEMINI_API_KEY in backend/.env for live AI)"
    };
  },

  /**
   * Generate an optimized daily study plan from pending assignments
   */
  generateStudyPlan: async (tasks, dailyGoalHours = 4) => {
    const pendingTasks = tasks.filter((t) => t.status !== "Completed");
    const summary = pendingTasks
      .slice(0, 8)
      .map((t) => `- [${t.priority}] ${t.title} (${t.subject}, Due: ${t.dueDate}, Est: ${t.estimatedHours || 2}h)`)
      .join("\n");

    const prompt = `You are an academic productivity mentor. Create an optimized study schedule for a university student based on their pending tasks:
Daily Study Goal: ${dailyGoalHours} hours
Current Tasks:
${summary}

Respond ONLY with a valid JSON object in this format (no markdown formatting, no codeblocks):
{
  "headline": "Brief motivational overview for today",
  "focusPriorities": ["Task 1", "Task 2"],
  "schedule": [
    { "timeSlot": "09:00 - 10:30", "taskTitle": "...", "subject": "...", "objective": "..." },
    { "timeSlot": "10:45 - 12:00", "taskTitle": "...", "subject": "...", "objective": "..." }
  ],
  "wellnessTip": "A quick tip on rest and concentration"
}`;

    const raw = await callGemini(prompt);
    if (raw) {
      try {
        const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
        return {
          ...JSON.parse(clean),
          poweredBy: "Gemini AI"
        };
      } catch {
        // Fallback
      }
    }

    // Heuristic Fallback Study Plan
    const topPriorities = pendingTasks.slice(0, 3);
    return {
      headline: `Prioritizing ${topPriorities.length} urgent academic deadlines today.`,
      focusPriorities: topPriorities.map((t) => `${t.title} [${t.subject}]`),
      schedule: [
        {
          timeSlot: "Session 1 (Morning Deep Work)",
          taskTitle: topPriorities[0]?.title || "High Priority Assignment",
          subject: topPriorities[0]?.subject || "Major Subject",
          objective: "High-focus conceptual problems & coding."
        },
        {
          timeSlot: "Session 2 (Afternoon Execution)",
          taskTitle: topPriorities[1]?.title || "Secondary Task",
          subject: topPriorities[1]?.subject || "Coursework",
          objective: "Problem sets, lab write-ups, or notes."
        },
        {
          timeSlot: "Session 3 (Evening Review)",
          taskTitle: "Daily Revision & Next-day Prep",
          subject: "General",
          objective: "Review completed work and organize tomorrow's materials."
        }
      ],
      wellnessTip: "Stay hydrated and take a 10-minute walk between intense cognitive sessions.",
      poweredBy: isGeminiConfigured ? "Heuristic (Gemini parsing fallback)" : "Built-in Planner (Add GEMINI_API_KEY in backend/.env for live AI)"
    };
  },

  /**
   * Explain an academic concept or assignment topic
   */
  explainTopic: async (topic, subject = "General") => {
    const prompt = `Explain the following academic topic concisely for an engineering/college student:
Topic: "${topic}"
Subject/Field: "${subject}"

Provide:
1. Core intuition (in 2-3 sentences)
2. Key points / rules (3 bullets)
3. Common mistake students make in assignments/exams
4. One practical example or formula`;

    const raw = await callGemini(prompt);
    if (raw) {
      return {
        explanation: raw,
        poweredBy: "Gemini AI"
      };
    }

    return {
      explanation: `Topic: ${topic} (${subject})\n\nCore Concept:\nReview the fundamental principles and definitions for ${topic} in your textbook or lecture slides. Check chapter problems and verify solution steps carefully.`,
      poweredBy: isGeminiConfigured ? "Heuristic" : "Offline helper (Add GEMINI_API_KEY in backend/.env for live AI)"
    };
  }
};

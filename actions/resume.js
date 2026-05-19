"use server";

import { db } from "@/lib/prisma";
import { parseAIJsonResponse, withAIErrorHandling } from "@/lib/ai-errors";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }) {
  return withAIErrorHandling(
    async () => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: {
          industryInsight: true,
        },
      });

      if (!user) throw new Error("User not found");

      const prompt = `
      As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
      Make it more impactful, quantifiable, and aligned with industry standards.
      Current content: "${current}"

      Requirements:
      1. Use action verbs
      2. Include metrics and results where possible
      3. Highlight relevant technical skills
      4. Keep it concise but detailed
      5. Focus on achievements over responsibilities
      6. Use industry-specific keywords
      
      Format the response as a single paragraph without any additional text or explanations.
      `;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    },
    {
      fallbackMessage: "We couldn't improve that description right now. Please try again.",
      logLabel: "Resume improvement",
    },
  );
}

export async function getATSScore(content) {
  return withAIErrorHandling(
    async () => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      const prompt = `
        You are an ATS (Applicant Tracking System) expert. Analyze the following resume content and return a JSON object.

        Resume Content:
        "${content}"

        Return ONLY a valid JSON object with no extra text, no markdown, no backticks. Exactly this structure:
        {
          "score": <number between 0 and 100>,
          "label": <"Poor" | "Fair" | "Good" | "Excellent">,
          "suggestions": [<list of 3 to 5 specific improvement tips as strings>]
        }
      `;

      const result = await model.generateContent(prompt);
      return parseAIJsonResponse(result.response.text());
    },
    {
      fallbackMessage: "We couldn't analyze your resume right now. Please try again.",
      logLabel: "ATS score generation",
    },
  );
}
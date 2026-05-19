"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Career-specific fallback templates
 */
const fallbackTemplates = {
  "Frontend Developer": {
    phases: [
      {
        title: "Beginner",
        skills: ["HTML", "CSS", "JavaScript"],
        tools: ["VS Code", "Git"],
        milestone: "Build responsive static websites",
      },
      {
        title: "Intermediate",
        skills: ["React", "API Integration", "State Management"],
        tools: ["GitHub", "Postman"],
        milestone: "Build interactive frontend applications",
      },
      {
        title: "Advanced",
        skills: ["Next.js", "Performance Optimization", "Testing"],
        tools: ["Vercel", "Chrome DevTools"],
        milestone: "Deploy production-ready scalable apps",
      },
    ],
  },

  "Backend Developer": {
    phases: [
      {
        title: "Beginner",
        skills: ["Node.js", "Express", "REST APIs"],
        tools: ["VS Code", "Postman"],
        milestone: "Build basic backend APIs",
      },
      {
        title: "Intermediate",
        skills: ["Databases", "Authentication", "ORM"],
        tools: ["MongoDB", "Prisma"],
        milestone: "Build secure backend systems",
      },
      {
        title: "Advanced",
        skills: ["Microservices", "System Design", "Caching"],
        tools: ["Docker", "AWS"],
        milestone: "Build scalable backend architecture",
      },
    ],
  },

  "AI Engineer": {
    phases: [
      {
        title: "Beginner",
        skills: ["Python", "Math Basics", "Pandas"],
        tools: ["Jupyter", "Colab"],
        milestone: "Understand ML fundamentals",
      },
      {
        title: "Intermediate",
        skills: ["Machine Learning", "Deep Learning", "Model Training"],
        tools: ["TensorFlow", "PyTorch"],
        milestone: "Train and evaluate ML models",
      },
      {
        title: "Advanced",
        skills: ["LLMs", "MLOps", "Deployment"],
        tools: ["Hugging Face", "Docker"],
        milestone: "Deploy AI-powered applications",
      },
    ],
  },

  "Data Scientist": {
    phases: [
      {
        title: "Beginner",
        skills: ["Python", "Statistics", "SQL"],
        tools: ["Excel", "Jupyter"],
        milestone: "Analyze datasets effectively",
      },
      {
        title: "Intermediate",
        skills: ["Machine Learning", "Visualization", "EDA"],
        tools: ["Tableau", "Power BI"],
        milestone: "Build predictive models",
      },
      {
        title: "Advanced",
        skills: ["Big Data", "Deep Learning", "Deployment"],
        tools: ["Spark", "TensorFlow"],
        milestone: "Build enterprise data systems",
      },
    ],
  },

  "Cybersecurity Engineer": {
    phases: [
      {
        title: "Beginner",
        skills: ["Networking", "Linux", "Security Basics"],
        tools: ["Wireshark", "Kali Linux"],
        milestone: "Understand system vulnerabilities",
      },
      {
        title: "Intermediate",
        skills: ["Penetration Testing", "Cryptography", "OWASP"],
        tools: ["Burp Suite", "Metasploit"],
        milestone: "Perform security assessments",
      },
      {
        title: "Advanced",
        skills: ["Cloud Security", "Threat Hunting", "SIEM"],
        tools: ["AWS Security", "Splunk"],
        milestone: "Secure enterprise systems",
      },
    ],
  },
};

/**
 * Generic fallback (for ANY unknown career)
 */
const getGenericRoadmap = (career) => {
  return {
    career,
    phases: [
      {
        title: "Beginner",
        skills: ["Fundamentals", "Core Concepts", "Basic Tools"],
        tools: ["VS Code", "Git"],
        milestone: `Understand fundamentals of ${career}`,
      },
      {
        title: "Intermediate",
        skills: ["Practical Skills", "Projects", "Problem Solving"],
        tools: ["GitHub", "APIs"],
        milestone: `Build intermediate ${career} projects`,
      },
      {
        title: "Advanced",
        skills: ["Advanced Concepts", "Real-world Systems", "Optimization"],
        tools: ["Cloud Platforms", "CI/CD"],
        milestone: `Become job-ready as ${career}`,
      },
    ],
  };
};

export async function generateRoadmap(data) {
  try {
    const { career, skills } = data;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
Generate a detailed career roadmap.

Return ONLY valid JSON. No markdown, no explanation.

Target Career:
${career}

Current Skills:
${skills}

Format:
{
  "career": "${career}",
  "phases": [
    {
      "title": "",
      "skills": [],
      "tools": [],
      "milestone": ""
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let text = response.text().replace(/```json|```/g, "").trim();

    let roadmap;

    try {
      roadmap = JSON.parse(text);
    } catch (err) {
      throw new Error("Invalid JSON from Gemini");
    }

    return roadmap;
  } catch (error) {
    console.error("Roadmap Error:", error);

    // smart fallback selection
    return fallbackTemplates[data.career] || getGenericRoadmap(data.career);
  }
}
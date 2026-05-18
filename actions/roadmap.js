"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export async function generateRoadmap(data) {
  try {
    const { career, skills } = data;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
Generate a detailed career roadmap.

Target Career:
${career}

Current Skills:
${skills}

Return ONLY valid JSON.

Use this exact structure:

{
  "career": "",
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

    const text = response.text();

    // safer JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid JSON response");
    }

    const roadmap = JSON.parse(jsonMatch[0]);

    return roadmap;

  } catch (error) {
  console.error("Roadmap Error:", error);

  const roadmaps = {
    "Frontend Developer": {
      phases: [
        {
          title: "Beginner",
          skills: ["HTML", "CSS", "JavaScript"],
          tools: ["VS Code", "Git"],
          milestone: "Build responsive websites",
        },
        {
          title: "Intermediate",
          skills: ["React", "API Integration"],
          tools: ["GitHub", "Postman"],
          milestone: "Create modern frontend apps",
        },
        {
          title: "Advanced",
          skills: ["Next.js", "Performance Optimization"],
          tools: ["Vercel", "Chrome DevTools"],
          milestone: "Deploy scalable production apps",
        },
      ],
    },

    "Backend Developer": {
      phases: [
        {
          title: "Beginner",
          skills: ["Node.js", "Express"],
          tools: ["VS Code", "Postman"],
          milestone: "Build REST APIs",
        },
        {
          title: "Intermediate",
          skills: ["Authentication", "Databases"],
          tools: ["MongoDB", "Prisma"],
          milestone: "Create backend systems",
        },
        {
          title: "Advanced",
          skills: ["Microservices", "System Design"],
          tools: ["Docker", "AWS"],
          milestone: "Deploy scalable services",
        },
      ],
    },

    "AI Engineer": {
      phases: [
        {
          title: "Beginner",
          skills: ["Python", "NumPy", "Pandas"],
          tools: ["Jupyter Notebook", "Google Colab"],
          milestone: "Build basic ML models",
        },
        {
          title: "Intermediate",
          skills: ["Machine Learning", "Deep Learning"],
          tools: ["TensorFlow", "PyTorch"],
          milestone: "Train neural networks",
        },
        {
          title: "Advanced",
          skills: ["LLMs", "MLOps"],
          tools: ["Hugging Face", "Docker"],
          milestone: "Deploy AI applications",
        },
      ],
    },

    "Data Scientist": {
      phases: [
        {
          title: "Beginner",
          skills: ["Python", "Statistics", "SQL"],
          tools: ["Jupyter", "Excel"],
          milestone: "Analyze datasets",
        },
        {
          title: "Intermediate",
          skills: ["Machine Learning", "Data Visualization"],
          tools: ["Power BI", "Tableau"],
          milestone: "Create prediction models",
        },
        {
          title: "Advanced",
          skills: ["Big Data", "Deep Learning"],
          tools: ["Spark", "TensorFlow"],
          milestone: "Build enterprise data pipelines",
        },
      ],
    },

    "Cybersecurity Engineer": {
      phases: [
        {
          title: "Beginner",
          skills: ["Networking", "Linux", "Security Basics"],
          tools: ["Wireshark", "Kali Linux"],
          milestone: "Understand system security",
        },
        {
          title: "Intermediate",
          skills: ["Penetration Testing", "Cryptography"],
          tools: ["Metasploit", "Burp Suite"],
          milestone: "Perform vulnerability assessments",
        },
        {
          title: "Advanced",
          skills: ["Cloud Security", "Threat Hunting"],
          tools: ["SIEM", "AWS Security"],
          milestone: "Secure enterprise infrastructure",
        },
      ],
    },
  };

  return {
    career: data.career,
    phases:
      roadmaps[data.career]?.phases ||
      roadmaps["Frontend Developer"].phases,
  };
}
}
"use client";

import { useState,useEffect } from "react";
import { saveUserSkills,getUserSkills } from "@/actions/skills";
export default function SkillInput() {
  const [inputValue, setInputValue] = useState("");
  const [skills, setSkills] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add the useEffect to fetch data 
  useEffect(() => {
    async function loadSkills() {
      try {
        const savedSkills = await getUserSkills();
        setSkills(savedSkills);
      } catch (error) {
        console.error("Failed to load skills:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSkills();
  }, []);

  //Handle typing and adding a skill when pressing 'Enter' or ','

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); 
      
      const newSkill = inputValue.trim();
      // Prevent empty strings and duplicates
      if (newSkill && !skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      
      setInputValue(""); 
    }
  };
// Handle removing a skill if the user clicks the 'x'
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };
// Send the skills to the backend database
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveUserSkills(skills);
      alert("Success! Your skills have been saved.");
    } catch (error) {
      console.error(error);
      alert("Oops! Something went wrong saving your skills.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-transparent p-6 rounded-xl border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-2">Your Skills</h2>
      <p className="text-sm text-gray-400 mb-4">
        Type a skill and press Enter or a comma to add it to the user profile.
      </p>

      {/* Input Box */}
      <div className="mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. React, Python, Product Strategy..."
          className="w-full p-3 border border-white/10 rounded-lg text-white bg-white/5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder-gray-500"
        />
      </div>

      {/*  Visual Tags */}
      <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
        {skills.length === 0 && (
          <span className="text-gray-500 text-sm italic mt-2">No skills added yet.</span>
        )}
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-violet-500/10 text-violet-300 px-3 py-1.5 rounded-full text-sm font-medium border border-violet-500/20"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="text-violet-400 hover:text-violet-200 transition-colors focus:outline-none"
              aria-label={`Remove ${skill}`}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving || skills.length === 0}
        className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white transition-all ${
          isSaving || skills.length === 0
            ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
            : "bg-violet-600 hover:bg-violet-700 shadow-md hover:shadow-lg"
        }`}
      >
        {isSaving ? "Saving..." : "Save Skills"}
      </button>
    </div>
  );
}
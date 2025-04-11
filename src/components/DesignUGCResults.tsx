import React from "react";
import BlueprintSection, { KeyValuePair } from "./BluePrintSection";

interface DesignAndUGCProps {
  data: {
    original_prompt: string;
    revised_prompt: string;
    reasoning: string;
    image_url: string;
  }[];
}

export default function DesignAndUGC({ data }: DesignAndUGCProps) {
  if (!data || data.length === 0) return null;

  return (
    <BlueprintSection title="Design & UGC" icon="🎨">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((item, index) => (
          <div key={index} className="border rounded-xl p-4 bg-white/80 shadow-sm space-y-3">
            <img 
              src={item.image_url} 
              alt={`Generated UGC visual ${index + 1}`} 
              className="w-full rounded-md border"
            />
            <KeyValuePair 
              label="Revised Prompt" 
              value={item.revised_prompt} 
              icon="✏️"
            />
            <KeyValuePair 
              label="Reasoning" 
              value={item.reasoning} 
              icon="💭"
            />
          </div>
        ))}
      </div>
    </BlueprintSection>
  );
}
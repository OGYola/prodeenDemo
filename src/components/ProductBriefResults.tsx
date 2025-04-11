import React from "react";
import BlueprintSection, { SectionGroup, ItemList, KeyValuePair } from "./BluePrintSection"

type ProductBriefProps = {
  data: {
    name: string;
    target_audience: string;
    positioning: string;
    problem: string;
    key_features: string[];
    benefits: string[];
    tone_voice: string;
    claims: string[];
    competitors: string[];
    call_to_action: string;
    name_directions: string[];
  }
}

export default function ProductBrief({ data }: ProductBriefProps) {
  if (!data) return null;

  return (
    <BlueprintSection title="Product Brief" icon="📦">
      <div className="space-y-3">
        <KeyValuePair label="Name" value={data.name} />
        <KeyValuePair label="Target Audience" value={data.target_audience} />
        <KeyValuePair label="Positioning" value={data.positioning} />
        <KeyValuePair label="Problem" value={data.problem} />
        <KeyValuePair label="Tone & Voice" value={data.tone_voice} />
        <KeyValuePair label="Call to Action" value={data.call_to_action} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        <SectionGroup title="Key Features" icon="✨">
          <ItemList items={data.key_features} />
        </SectionGroup>

        <SectionGroup title="Benefits" icon="💡">
          <ItemList items={data.benefits} />
        </SectionGroup>

        <SectionGroup title="Claims" icon="✅">
          <ItemList items={data.claims} />
        </SectionGroup>

        <SectionGroup title="Competitors" icon="🏁">
          <ItemList items={data.competitors} />
        </SectionGroup>
      </div>

      <SectionGroup title="Alternate Name Directions" icon="🧠">
        <ItemList items={data.name_directions} />
      </SectionGroup>
    </BlueprintSection>
  );
}
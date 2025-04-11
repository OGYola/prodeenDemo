import React from "react";
import BlueprintSection, { SectionGroup, KeyValuePair } from "./BluePrintSection"

interface ComplianceCheckProps {
  data: {
    flagged_claims: {
      phrase: string;
      reason: string;
      suggestion: string;
    }[];
    summary: string;
  };
}

export default function ComplianceCheck({ data }: ComplianceCheckProps) {
  if (!data) return null;

  return (
    <BlueprintSection title="Compliance Check" icon="⚖️">
      <p className="text-sm text-blue-700 mb-4">{data.summary}</p>

      {data.flagged_claims.length > 0 ? (
        <SectionGroup title="Flagged Claims" icon="🚩">
          <div className="space-y-4">
            {data.flagged_claims.map((claim, index) => (
              <div key={index} className="bg-red-50 border border-red-200 p-4 rounded-md">
                <KeyValuePair label="Phrase" value={claim.phrase} icon="❌" />
                <KeyValuePair label="Reason" value={claim.reason} icon="⚠️" />
                <KeyValuePair label="Suggestion" value={claim.suggestion} icon="✅" />
              </div>
            ))}
          </div>
        </SectionGroup>
      ) : (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md">
          <p className="text-sm text-green-600">No compliance issues detected. ✅</p>
        </div>
      )}
    </BlueprintSection>
  );
}
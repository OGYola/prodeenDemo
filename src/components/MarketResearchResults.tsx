import React from "react";
import BlueprintSection, { SectionGroup, ItemList } from "./BluePrintSection"

interface Competitor {
  name: string;
  price_range?: string;
  main_ingredients: string[] | string;
  target_audience?: string;
  source?: string;
  cite?: string;
}

interface MarketResearchProps {
  data: {
    competitors: Competitor[];
    common_complaints: string[];
    market_gaps: string[];
    summary?: string;
  };
}

export default function MarketResearch({ data }: MarketResearchProps) {
  if (!data) return null;

  // Helper function to handle main_ingredients as either string or array
  const formatIngredients = (ingredients: string[] | string): string => {
    if (Array.isArray(ingredients)) {
      return ingredients.join(", ");
    }
    return ingredients as string;
  };

  // Helper function to get the appropriate source URL
  const getSourceUrl = (competitor: Competitor): string | undefined => {
    return competitor.source || competitor.cite;
  };

  return (
    <BlueprintSection title="Market Research" icon="🔍">
      <SectionGroup title="Top Competitors" icon="🏆">
        {data.competitors && data.competitors.length > 0 ? (
          <div className="space-y-3">
            {data.competitors.map((comp, index) => (
              <div key={index} className="border border-blue-100 rounded-lg p-4 bg-white/90">
                <h4 className="text-blue-900 font-medium">{comp.name}</h4>
                {comp.price_range && (
                  <p className="text-sm text-blue-700">
                    <strong>💲 Price:</strong> {comp.price_range}
                  </p>
                )}
                {comp.main_ingredients && (
                  <p className="text-sm text-blue-700">
                    <strong>🧪 Ingredients:</strong> {formatIngredients(comp.main_ingredients)}
                  </p>
                )}
                {comp.target_audience && (
                  <p className="text-sm text-blue-700">
                    <strong>🎯 Audience:</strong> {comp.target_audience}
                  </p>
                )}
                {getSourceUrl(comp) && (
                  <a
                    href={getSourceUrl(comp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 underline"
                  >
                    🔗 Source
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-amber-100 rounded-lg p-4 bg-amber-50">
            <p className="text-amber-700">No competitor data available</p>
          </div>
        )}
      </SectionGroup>

      <SectionGroup title="Common Complaints" icon="⚠️">
        <ItemList items={data.common_complaints} />
      </SectionGroup>

      <SectionGroup title="Market Gaps & Opportunities" icon="💰">
        <ItemList items={data.market_gaps} />
      </SectionGroup>

      {data.summary && (
        <div className="pt-4">
          <p className="text-sm text-blue-900">
            <strong>🧠 Summary:</strong> {data.summary}
          </p>
        </div>
      )}
    </BlueprintSection>
  );
}
import React from "react";
import BlueprintSection, { SectionGroup, ItemList, KeyValuePair } from "./BluePrintSection"

interface ContentStrategyProps {
  data: {
    seo_strategy: {
      keywords: string[];
      blog_topics: string[];
      meta_description: string;
      on_page_guidelines: string;
    };
    social_media_plan: {
      platforms: string[];
      posting_schedule: string;
      content_types: string[];
      example_posts: string[];
    };
    score?: {
      clarity: number;
      originality: number;
      reach: number;
      cohesion: number;
    };
    final_summary?: string;
  };
}

export default function ContentStrategy({ data }: ContentStrategyProps) {
  if (!data) return null;

  return (
    <BlueprintSection title="Content Strategy" icon="📝">
      {/* SEO Strategy */}
      <SectionGroup title="SEO Strategy" icon="🔍">
        <div className="space-y-2">
          <KeyValuePair 
            label="Meta Description" 
            value={data.seo_strategy.meta_description} 
          />
          <KeyValuePair 
            label="On-page Guidelines" 
            value={data.seo_strategy.on_page_guidelines} 
          />
          <KeyValuePair 
            label="Keywords" 
            value={data.seo_strategy.keywords.join(", ")} 
          />
          
          <div className="mt-2">
            <p className="text-sm font-medium text-blue-700">Blog Topics:</p>
            <ItemList items={data.seo_strategy.blog_topics} />
          </div>
        </div>
      </SectionGroup>

      {/* Social Media Plan */}
      <SectionGroup title="Social Media Plan" icon="📱">
        <div className="space-y-2">
          <KeyValuePair 
            label="Platforms" 
            value={data.social_media_plan.platforms.join(", ")} 
          />
          <KeyValuePair 
            label="Posting Schedule" 
            value={data.social_media_plan.posting_schedule} 
          />
          <KeyValuePair 
            label="Content Types" 
            value={data.social_media_plan.content_types.join(", ")} 
          />
          
          <div className="mt-2">
            <p className="text-sm font-medium text-blue-700">Example Posts:</p>
            <ItemList items={data.social_media_plan.example_posts} />
          </div>
        </div>
      </SectionGroup>

      {/* Score */}
      {data.score && (
        <SectionGroup title="Evaluation Scores" icon="📊">
          <div className="grid grid-cols-2 gap-2">
            <KeyValuePair label="Clarity" value={`${data.score.clarity}/10`} icon="🧠" />
            <KeyValuePair label="Originality" value={`${data.score.originality}/10`} icon="🌟" />
            <KeyValuePair label="Reach" value={`${data.score.reach}/10`} icon="📈" />
            <KeyValuePair label="Cohesion" value={`${data.score.cohesion}/10`} icon="🧵" />
          </div>
        </SectionGroup>
      )}

      {/* Summary */}
      {data.final_summary && (
        <SectionGroup title="Final Summary" icon="📋">
          <p className="text-sm text-blue-900">{data.final_summary}</p>
        </SectionGroup>
      )}
    </BlueprintSection>
  );
}
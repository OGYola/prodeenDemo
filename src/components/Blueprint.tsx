import React from "react";
import ProductBrief from "./ProductBriefResults"; 
import MarketResearch from "./MarketResearchResults"; 
import DesignAndUGC from "./DesignUGCResults"; 
import ContentStrategy from "./ContentStrategyResults"; 
import ComplianceCheck from "./ComplianceChecklistResults"; 
import { Beaker, Package, BarChart4, FileText, Shield, CheckCircle2, AlertTriangle } from "lucide-react";

// Progress indicator for the blueprint process
interface ProgressIndicatorProps {
  currentStep: number;
  completedSteps: number[];
  stepErrors: number[];
  onStepChange: (step: number) => void;
  isGenerating: boolean;
}

function ProgressIndicator({ 
  currentStep, 
  completedSteps, 
  stepErrors, 
  onStepChange,
  isGenerating 
}: ProgressIndicatorProps) {
  const steps = [
    { id: 0, name: "Product Brief", icon: Beaker },
    { id: 1, name: "Design & UGC", icon: Package },
    { id: 2, name: "Market Research", icon: BarChart4 },
    { id: 3, name: "Content Strategy", icon: FileText },
    { id: 4, name: "Compliance Check", icon: Shield },
  ];

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">AI-Powered Blueprint Process</h1>
      <div className="relative">
        <div className="absolute top-5 left-0 w-full h-1 bg-blue-100 rounded">
          <div
            className="h-full bg-blue-500 rounded transition-all duration-500 ease-in-out"
            style={{
              width: `${(completedSteps.length / steps.length) * 100}%`,
              transition: "width 1s ease"
            }}
          />
        </div>
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            const hasError = stepErrors.includes(step.id);

            return (
              <div key={step.id} className="flex flex-col items-center">
                <button
                  onClick={() => !isGenerating && onStepChange(step.id)}
                  disabled={isGenerating && !isCompleted}
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full 
                    ${isActive ? 'bg-blue-600 text-white scale-110' : 
                      isCompleted ? 'bg-green-500 text-white' : 
                        'bg-white text-blue-800 border border-blue-200'}
                    ${hasError ? 'ring-2 ring-red-400 animate-pulse' : ''}`}
                >
                  {hasError
                    ? <AlertTriangle className="h-5 w-5 text-red-600" />
                    : isCompleted
                      ? <CheckCircle2 className="h-5 w-5" />
                      : <step.icon className="h-5 w-5" />
                  }
                </button>
                <div className="text-sm mt-2 font-medium text-blue-700">{step.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface BlueprintData {
  productBrief: any;
  marketResearch: any;
  designAndUGC: any;
  contentStrategy: any;
  complianceCheck: any;
  [key: string]: any; // Add index signature
}

interface BlueprintProps {
  data: BlueprintData;
  currentStep: number;
  completedSteps: number[];
  stepErrors: number[];
  onStepChange: (step: number) => void;
  isGenerating: boolean;
}

export default function Blueprint({ 
  data, 
  currentStep = 0,
  completedSteps = [],
  stepErrors = [],
  onStepChange = () => {},
  isGenerating = false
}: BlueprintProps) {
  if (!data) return null;
  
  return (
    <div className="max-w-6xl mx-auto">
      <ProgressIndicator 
        currentStep={currentStep} 
        completedSteps={completedSteps}
        stepErrors={stepErrors}
        onStepChange={onStepChange}
        isGenerating={isGenerating}
      />
      
      <div className="space-y-8">
        {/* Always render sections that have data, regardless of completion status */}
        {data.productBrief && (
          <div className={completedSteps.includes(0) ? "border-l-4 border-green-500 pl-4" : ""}>
            <ProductBrief data={data.productBrief} />
          </div>
        )}
        
        {data.designAndUGC && (
          <div className={completedSteps.includes(1) ? "border-l-4 border-green-500 pl-4" : ""}>
            <DesignAndUGC data={data.designAndUGC} />
          </div>
        )}
        
        {data.marketResearch && (
          <div className={completedSteps.includes(2) ? "border-l-4 border-green-500 pl-4" : ""}>
            <MarketResearch data={data.marketResearch} />
          </div>
        )}
        
        {data.contentStrategy && (
          <div className={completedSteps.includes(3) ? "border-l-4 border-green-500 pl-4" : ""}>
            <ContentStrategy data={data.contentStrategy} />
          </div>
        )}
        
        {data.complianceCheck && (
          <div className={completedSteps.includes(4) ? "border-l-4 border-green-500 pl-4" : ""}>
            <ComplianceCheck data={data.complianceCheck} />
          </div>
        )}
        
        {/* Display a message if no sections are ready yet */}
        {!Object.values(data).some(val => val !== null && val !== undefined) && (
          <div className="text-center text-blue-600 py-8">
            Waiting for blueprint sections to be generated...
          </div>
        )}
      </div>
    </div>
  );
}
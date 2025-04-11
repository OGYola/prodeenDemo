'use client'

import { useState, useEffect } from "react"
// Import our new AnimatedPlaceholderInput component
import AnimatedPlaceholderInput from "@/components/AnimatedPlaceholderInput"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Beaker, FileText, ArrowRight, Shield, BarChart4, Package,
  CheckCircle2, AlertTriangle
} from "lucide-react"

// Replace individual imports with the main Blueprint component
import Blueprint from "@/components/Blueprint"

// Define the blueprint data structure
interface BlueprintData {
  product_brief: any | null;
  design_and_ugc: any | null;
  market_research: any | null;
  content_strategy: any | null;
  compliance_check: any | null;
  [key: string]: any | null; // Index signature to allow dynamic keys
}

export default function HomePage() {
  const [idea, setIdea] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [stepErrors, setStepErrors] = useState<number[]>([])
  const [blueprintData, setBlueprintData] = useState<BlueprintData | null>(null)

  // Current request ID for the streaming connection
  const [requestId, setRequestId] = useState<string | null>(null)

  // Reference to the SSE connection
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  // Mapping of component names to step indices
  const componentToStepIndex: Record<string, number> = {
    "product_brief": 0,
    "design_and_ugc": 1,
    "market_research": 2,
    "content_strategy": 3,
    "compliance_check": 4
  }

  // Clean up SSE connection on unmount
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  // Handle component updates from SSE
  const handleComponentUpdate = (component: string, data: any) => {
    // Update the blueprint data with this component
    setBlueprintData(prev => {
      if (!prev) {
        return {
          product_brief: null,
          design_and_ugc: null,
          market_research: null,
          content_strategy: null,
          compliance_check: null,
          [component]: data
        };
      }

      return {
        ...prev,
        [component]: data
      };
    });

    // Mark the component's step as completed
    const stepIndex = componentToStepIndex[component];
    if (stepIndex !== undefined) {
      setCompletedSteps(prev => {
        if (prev.includes(stepIndex)) return prev;
        return [...prev, stepIndex];
      });

      // Set as the active step
      setActiveStep(stepIndex);
    }
  };

  // Handle component failures from SSE
  const handleComponentError = (component: string) => {
    // Mark the component's step as error
    const stepIndex = componentToStepIndex[component];
    if (stepIndex !== undefined) {
      setStepErrors(prev => {
        if (prev.includes(stepIndex)) return prev;
        return [...prev, stepIndex];
      });
    }
  };

  // Set up SSE connection for real-time updates
  const setupSSEConnection = (reqId: string) => {
    // Close any existing connection
    if (eventSource) {
      eventSource.close();
    }

    // Create new connection
    const newEventSource = new EventSource(`http://localhost:8000/stream/${reqId}`);

    // Handle incoming events
    newEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'component_completed') {
          // Component successfully completed
          handleComponentUpdate(data.component, data.data);
        }
        else if (data.type === 'component_failed') {
          // Component failed
          handleComponentError(data.component);
        }
        else if (data.type === 'generation_completed') {
          // All generation done
          setIsGenerating(false);
          newEventSource.close();
        }
        else if (data.error) {
          // Error occurred
          console.error("SSE Error:", data.error);
          setIsGenerating(false);
          newEventSource.close();
        }
      } catch (e) {
        console.error("Error parsing SSE event:", e);
      }
    };

    // Handle errors
    newEventSource.onerror = (error) => {
      console.error("SSE Connection error:", error);
      newEventSource.close();
      setIsGenerating(false);
    };

    // Save the connection
    setEventSource(newEventSource);
  };

  const handleSubmit = async () => {
    if (!idea.trim()) return
    setIsGenerating(true)
    setActiveStep(0)
    setCompletedSteps([])
    setStepErrors([])

    // Initialize an empty blueprint object
    setBlueprintData({
      product_brief: null,
      design_and_ugc: null,
      market_research: null,
      content_strategy: null,
      compliance_check: null,
    })

    try {
      // Step 1: Start the generation process and get request ID
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea })
      })

      if (!response.ok) {
        throw new Error(`Generation failed with status: ${response.status}`);
      }

      const data = await response.json()
      const reqId = data.request_id;

      if (!reqId) {
        throw new Error("No request ID returned from server");
      }

      // Save the request ID
      setRequestId(reqId);

      // Step 2: Set up SSE connection to get real-time updates
      setupSSEConnection(reqId);

    } catch (error) {
      console.error("❌ Error:", error)
      alert("Something went wrong. Please try again.")
      setIsGenerating(false)
    }
  }

  // Updated render method to use the Blueprint component
  const renderBlueprintContent = () => {
    if (!blueprintData) return null

    // Transform the API data structure to match the Blueprint component's expected format
    const formattedData = {
      productBrief: blueprintData.product_brief,
      designAndUGC: blueprintData.design_and_ugc,
      marketResearch: blueprintData.market_research,
      contentStrategy: blueprintData.content_strategy,
      complianceCheck: blueprintData.compliance_check
    }

    return <Blueprint
      data={formattedData}
      currentStep={activeStep}
      completedSteps={completedSteps}
      stepErrors={stepErrors}
      onStepChange={(stepIndex) => setActiveStep(stepIndex)}
      isGenerating={isGenerating}
    />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex flex-col">
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-xl text-blue-900">PRODEEN</span>
          </div>
        </div>
      </header>

      <section className="flex-1 py-12 sm:py-20">
        <div className="container mx-auto px-4">
          {/* Hero Section - Two equal columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Left Column - Text + Input */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight mb-4">
                Got a new<br className="hidden sm:block" />CPG idea?
              </h1>
              <p className="text-lg text-blue-700 mb-6">
                Our AI turns your idea into a retail-ready product plan — instantly.
              </p>

              {/* Input + Button with Animated Placeholder */}
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-md">
                <CardContent className="p-6 space-y-5">
                  {/* Replace standard Input with AnimatedPlaceholderInput */}
                  <AnimatedPlaceholderInput
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    className="bg-white border-blue-200 h-12 text-base"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={isGenerating || !idea.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Generating Blueprint...
                      </>
                    ) : (
                      <>
                        Generate Product Blueprint <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Larger Image with animation */}
            <div className="flex items-center justify-center">
              <div className="relative w-full">
                {/* Glow effect behind image */}
                <div className="glow-behind absolute inset-0 rounded-2xl"></div>
                <img
                  src="/hero-lab.png"
                  alt="Futuristic lab"
                  className="relative w-full h-full object-contain rounded-xl shadow-lg animate-float z-10"
                />
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="min-h-[300px]">
            {isGenerating && (!blueprintData || !Object.values(blueprintData).some(val => val !== null)) && (
              <div className="flex items-center justify-center text-blue-600 text-sm gap-2 animate-pulse h-full">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Connecting to server...
              </div>
            )}
            {blueprintData && Object.values(blueprintData).some(val => val !== null) && renderBlueprintContent()}
          </div>
        </div>
      </section>

      <footer className="bg-white/80 backdrop-blur-sm py-4 border-t border-blue-100 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-blue-600">
          © 2025 PRODEEN · All rights reserved
        </div>
      </footer>
    </div>
  )
}
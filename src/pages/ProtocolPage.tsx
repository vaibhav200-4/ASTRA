import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { FileText, CheckCircle2, Sliders, ShieldCheck, ArrowRight } from 'lucide-react';

export const ProtocolPage: React.FC = () => {
  const { currentStep, completedSteps, fsmState } = useMission();
  const [selectedStep, setSelectedStep] = useState<number>(2);

  const stepsData = [
    {
      id: 1,
      name: "OPEN RED BOX",
      fsm: "S1_OPEN_BOX",
      requiredObject: "Red Experiment Box (BCE-OBJ-01)",
      expectedInteraction: "Hand Lid Motion / Hinge Angle Delta > 45°",
      trigger: "Red box opened — lid movement detected",
      confidenceThreshold: "90.0%",
      currentStatus: completedSteps.includes(1) ? "COMPLETED" : currentStep === 1 ? "CURRENT" : "WAITING",
      details: "Astronaut grips lid handle of the primary red storage container and pulls upwards to unlatch safety pins."
    },
    {
      id: 2,
      name: "REMOVE YELLOW CONTAINER",
      fsm: "S2_REMOVE_CONTAINER",
      requiredObject: "Yellow Container (BCE-OBJ-02)",
      expectedInteraction: "HAND → YELLOW CONTAINER (Grasp & Translation)",
      trigger: "Container displacement vector out of red box origin",
      confidenceThreshold: "85.0%",
      currentStatus: completedSteps.includes(2) ? "COMPLETED" : currentStep === 2 ? "CURRENT" : "WAITING",
      details: "Right hand keypoints lock onto yellow container bounding box, extracting sample canister from internal foam lining."
    },
    {
      id: 3,
      name: "PLACE CONTAINER IN RACK",
      fsm: "S3_PLACE_CONTAINER",
      requiredObject: "Payload Rack Slot #3 (BCE-SLOT-03)",
      expectedInteraction: "CONTAINER → RACK SLOT (Insertion & Lock)",
      trigger: "Container enters rack region & velocity drops to zero",
      confidenceThreshold: "92.0%",
      currentStatus: completedSteps.includes(3) ? "COMPLETED" : currentStep === 3 ? "CURRENT" : "WAITING",
      details: "Yellow container is inserted into rack guide rails until mechanical micro-switch or visual boundary locks position."
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="bg-[#071B33] text-white p-6 rounded-lg shadow-md border border-navy-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-saffron-400 font-mono text-xs font-bold mb-1">
            <FileText size={16} />
            <span>BOX & CONTAINER EXPERIMENT (BCE-01)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white">
            DETERMINISTIC EXPERIMENT PROTOCOL SPECIFICATION
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Engineered finite state machine validation rules enforcing strict procedural compliance.
          </p>
        </div>

        <div className="bg-navy-900 px-4 py-2 rounded border border-navy-700 font-mono text-xs text-right">
          <span className="text-slate-400 block text-[10px]">VALIDATOR ENGINE</span>
          <span className="font-bold text-emerald-400">FINITE STATE MACHINE (FSM)</span>
        </div>
      </div>

      {/* Protocol Step Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {stepsData.map(step => (
          <div 
            key={step.id}
            onClick={() => setSelectedStep(step.id)}
            className={`p-5 rounded-lg border cursor-pointer transition-all ${
              selectedStep === step.id 
                ? 'bg-white border-saffron-500 ring-2 ring-saffron-500/20 shadow-lg' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <span className="font-mono font-bold text-xs text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded">
                STEP 0{step.id}
              </span>
              <span className={`font-mono font-bold text-xs ${
                step.currentStatus === 'COMPLETED' ? 'text-emerald-600' :
                step.currentStatus === 'CURRENT' ? 'text-blue-600 animate-pulse' :
                'text-slate-400'
              }`}>
                ● {step.currentStatus}
              </span>
            </div>

            <h3 className="font-bold font-mono text-sm text-navy-900 mb-2">{step.name}</h3>

            <div className="space-y-2 text-xs font-mono text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">REQUIRED OBJECT</span>
                <span className="text-navy-900 font-semibold">{step.requiredObject}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">CONFIDENCE THRESHOLD</span>
                <span className="text-saffron-600 font-semibold">{step.confidenceThreshold}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Step Detail Deep Dive */}
      {selectedStep && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4 font-mono text-xs">
          <h3 className="font-bold text-sm text-navy-900 border-b pb-2 flex items-center justify-between">
            <span>DETAILED REQUIREMENT SPECIFICATION: STEP 0{selectedStep}</span>
            <span className="text-saffron-600">FSM STATE: {stepsData[selectedStep - 1].fsm}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 bg-space-bg p-4 rounded border border-slate-200">
              <div>
                <span className="text-slate-500 text-[10px] block">EXPECTED HAND-OBJECT INTERACTION</span>
                <span className="font-bold text-navy-900 text-sm">{stepsData[selectedStep - 1].expectedInteraction}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">STATE TRANSITION TRIGGER</span>
                <span className="font-bold text-emerald-700">{stepsData[selectedStep - 1].trigger}</span>
              </div>
            </div>

            <div className="space-y-3 bg-space-bg p-4 rounded border border-slate-200">
              <div>
                <span className="text-slate-500 text-[10px] block">PROCEDURAL DESCRIPTION</span>
                <p className="text-slate-700 leading-relaxed font-sans text-xs mt-1">
                  {stepsData[selectedStep - 1].details}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

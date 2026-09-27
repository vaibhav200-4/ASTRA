import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { FileText, CheckCircle2, Sliders, ShieldCheck, ArrowRight, Zap, Check } from 'lucide-react';

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
    <div className="space-y-5 font-sans">
      {/* Title Header */}
      <div className="glass-card bg-gradient-to-r from-slate-900 to-[#0d162a] text-white p-5 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold mb-1">
            <FileText size={16} />
            <span>BOX & CONTAINER EXPERIMENT (BCE-01)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold font-mono tracking-tight text-white">
            DETERMINISTIC EXPERIMENT PROTOCOL SPECIFICATION
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Finite state machine validation rules enforcing strict procedural compliance.
          </p>
        </div>

        <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs text-right">
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
            className={`glass-card p-5 rounded-2xl border cursor-pointer transition-all ${
              selectedStep === step.id 
                ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="font-mono font-bold text-xs text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-md">
                STEP 0{step.id}
              </span>
              <span className={`font-mono font-bold text-xs flex items-center space-x-1 ${
                step.currentStatus === 'COMPLETED' ? 'text-emerald-400' :
                step.currentStatus === 'CURRENT' ? 'text-amber-400 animate-pulse' :
                'text-slate-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${step.currentStatus === 'COMPLETED' ? 'bg-emerald-400' : step.currentStatus === 'CURRENT' ? 'bg-amber-400 animate-ping' : 'bg-slate-600'}`}></span>
                <span>{step.currentStatus}</span>
              </span>
            </div>

            <h3 className="font-bold font-mono text-sm text-white mb-2">{step.name}</h3>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px]">REQUIRED OBJECT</span>
                <span className="text-slate-200 font-semibold">{step.requiredObject}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">CONFIDENCE THRESHOLD</span>
                <span className="text-amber-400 font-semibold">{step.confidenceThreshold}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Step Detail Deep Dive */}
      {selectedStep && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
          <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>REQUIREMENT SPECIFICATION: STEP 0{selectedStep}</span>
            <span className="text-amber-400">FSM STATE: {stepsData[selectedStep - 1].fsm}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px] block">EXPECTED HAND-OBJECT INTERACTION</span>
                <span className="font-bold text-cyan-300 text-sm">{stepsData[selectedStep - 1].expectedInteraction}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">STATE TRANSITION TRIGGER</span>
                <span className="font-bold text-emerald-400">{stepsData[selectedStep - 1].trigger}</span>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px] block">PROCEDURAL DESCRIPTION</span>
                <p className="text-slate-300 leading-relaxed font-sans text-xs mt-1">
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

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { HeroMetricCard } from './components/HeroMetricCard';
import { AlertBanner } from './components/AlertBanner';
import { CapacityCard } from './components/CapacityCard';
import { NetworkMapCard } from './components/NetworkMapCard';
import { TimingClockCard } from './components/TimingClockCard';
import { AiOperationsChat } from './components/AiOperationsChat';
import { PlanAndBenchmarkSection } from './components/PlanAndBenchmarkSection';
import { OrganizersWorkflowPanel } from './components/OrganizersWorkflowPanel';
import { LLMConfigModal } from './components/LLMConfigModal';

import { AnalyticsView } from './components/views/AnalyticsView';
import { DisruptionsView } from './components/views/DisruptionsView';
import { MapView } from './components/views/MapView';

import {
  fetchNetworkState,
  injectDisruption,
  resetEnvironment,
  triggerAgentRecovery,
  fetchAgentTraces,
  fetchPlans
} from './services/api';

import { NetworkState, AgentTrace, Plan } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [networkState, setNetworkState] = useState<NetworkState | null>(null);
  const [traces, setTraces] = useState<AgentTrace[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [llmProvider, setLlmProvider] = useState<string>('ollama');
  const [selectedHub, setSelectedHub] = useState<string>('RET-DEL-01');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [resilienceScore, setResilienceScore] = useState<number>(98.2);

  const loadData = async () => {
    try {
      const net = await fetchNetworkState();
      setNetworkState(net);
      const tr = await fetchAgentTraces();
      setTraces(tr);
      const pl = await fetchPlans();
      setPlans(pl);
      if (pl.length > 0 && pl[0].resilience_score) {
        setResilienceScore(pl[0].resilience_score);
      }
    } catch (e) {
      console.error("Data load error", e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleInjectDisruption = async (type: string, entity_id: string, severity = 1.0, desc = '') => {
    await injectDisruption(type, entity_id, severity, desc);
    await loadData();
  };

  const handleResetEnv = async () => {
    await resetEnvironment();
    await loadData();
  };

  const handleRunAgent = async () => {
    setIsAgentRunning(true);
    try {
      const taskState = await triggerAgentRecovery(llmProvider);
      if (taskState.resilience_score) {
        setResilienceScore(taskState.resilience_score);
      }
      await loadData();
    } catch (e) {
      console.error("Agent recovery failed", e);
    } finally {
      setIsAgentRunning(false);
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'settings') {
      setIsModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="bg-[#ebedf3] min-h-screen p-2 md:p-5 text-slate-900 flex justify-center selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Outer Dashboard Canvas Frame */}
      <div className="w-full max-w-[1700px] bg-[#f5f7fb] border border-slate-300/80 rounded-[36px] shadow-2xl flex overflow-hidden min-h-[94vh]">
        {/* Left Vertical Sidebar Navigation Rail */}
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Main Application Content Area */}
        <div className="flex-1 p-4 md:p-6 flex flex-col overflow-y-auto max-h-[96vh]">
          {/* Top Bar Navigation */}
          <TopBar
            llmProvider={llmProvider}
            onOpenConfig={() => setIsModalOpen(true)}
            isAgentRunning={isAgentRunning}
            selectedHub={selectedHub}
            setSelectedHub={setSelectedHub}
          />

          {/* Dynamic Tab Content Switcher */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* REAL-TIME 7-STEP WORKFLOW MONITOR PANEL */}
              <OrganizersWorkflowPanel
                traces={traces}
                plans={plans}
                networkState={networkState}
                isAgentRunning={isAgentRunning}
                onInjectDisruption={handleInjectDisruption}
                onRunAgent={handleRunAgent}
                onResetEnv={handleResetEnv}
              />

              {/* ROW 1: Hero Coral Card (5 cols) + Alert Banner & Capacity Card (7 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5">
                  <HeroMetricCard
                    kpis={networkState?.kpis}
                    resilienceScore={resilienceScore}
                  />
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <AlertBanner
                    activeDisruptionsCount={networkState?.kpis.active_disruptions_count ?? 0}
                    onTriggerRecovery={handleRunAgent}
                    isAgentRunning={isAgentRunning}
                  />
                  <CapacityCard
                    suppliers={networkState?.suppliers}
                    warehouses={networkState?.warehouses}
                  />
                </div>
              </div>

              {/* ROW 2: Cyan Map (4 cols) + Timing Clock Dial (3 cols) + AI Operations Lead Chat (5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                  <NetworkMapCard state={networkState} />
                </div>

                <div className="lg:col-span-3">
                  <TimingClockCard plans={plans} />
                </div>

                <div className="lg:col-span-5">
                  <AiOperationsChat
                    traces={traces}
                    onInjectDisruption={handleInjectDisruption}
                    onRunAgent={handleRunAgent}
                    onResetEnv={handleResetEnv}
                    isAgentRunning={isAgentRunning}
                  />
                </div>
              </div>

              {/* ROW 3: Recovery Plan Versions (V1, V2, V3) & Benchmark Evaluation Suite */}
              <PlanAndBenchmarkSection plans={plans} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView state={networkState} resilienceScore={resilienceScore} />
          )}

          {activeTab === 'disruptions' && (
            <DisruptionsView
              state={networkState}
              onInjectDisruption={handleInjectDisruption}
              onResetEnv={handleResetEnv}
              onRunAgent={handleRunAgent}
              isAgentRunning={isAgentRunning}
            />
          )}

          {activeTab === 'map' && (
            <MapView state={networkState} />
          )}
        </div>
      </div>

      {/* LLM Configuration Modal */}
      <LLMConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentProvider={llmProvider}
        onSaveProvider={(prov) => setLlmProvider(prov)}
      />
    </div>
  );
}

export default App;

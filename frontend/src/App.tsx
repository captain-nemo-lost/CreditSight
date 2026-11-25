import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  BarChart2,
  BrainCircuit,
  ClipboardList,
  CreditCard,
  Menu,
  Play,
  ShieldCheck,
} from 'lucide-react';
import {
  fetchPersonas,
  fetchTelemetry,
  inspectGuardrail,
  runUnderwriting,
  triggerBenchmark,
} from './api/client';
import { BlackboardTab } from './components/BlackboardTab';
import { GuardrailsTab } from './components/GuardrailsTab';
import { Sidebar } from './components/Sidebar';
import { TelemetryTab } from './components/TelemetryTab';
import { UnderwritingTab } from './components/UnderwritingTab';
import type {
  ArchitectureOption,
  GuardrailInspectResponse,
  PersonaConfig,
  TelemetryPayload,
  UnderwriteFormInput,
  UnderwriteResponse,
} from './types/creditsight';

type TabKey = 'assessment' | 'blackboard' | 'guardrails' | 'telemetry';

const DEFAULT_FORM: UnderwriteFormInput = {
  persona_key: 'PRIME_PROFESSIONAL',
  full_name: 'Aarav Sharma',
  annual_income: 120000,
  monthly_debt_obligations: 1200,
  requested_loan_amount: 250000,
  loan_tenure_months: 36,
  collateral_value: 350000,
  credit_bureau_score: 780,
  notes_or_prompt:
    'I am seeking a commercial working capital facility for inventory expansion. Financial statements are attached for verification.',
  architecture: 'BLACKBOARD_HIERARCHICAL',
};

export function App() {
  const [personas, setPersonas] = useState<Record<string, PersonaConfig>>({});
  const [architectures, setArchitectures] = useState<ArchitectureOption[]>([
    {
      id: 'BLACKBOARD_HIERARCHICAL',
      label: 'Blackboard Hierarchical (Primary)',
      description: 'Coordinator oversees ADK & CrewAI workers via shared thread-safe Blackboard.',
    },
    {
      id: 'PARALLEL_FANOUT',
      label: 'Parallel Fan-Out / Fan-In',
      description: 'Concurrent threaded Risk & Policy workers fanned-in to Coordinator.',
    },
    {
      id: 'SEQUENTIAL_PIPELINE',
      label: 'Sequential Pipeline',
      description: 'Deterministic linear handoff: Data -> Risk -> Policy -> Coordinator.',
    },
  ]);

  const [form, setForm] = useState<UnderwriteFormInput>(DEFAULT_FORM);
  const [activeTab, setActiveTab] = useState<TabKey>('assessment');
  const [result, setResult] = useState<UnderwriteResponse | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryPayload | null>(null);
  const [guardrailInspect, setGuardrailInspect] = useState<GuardrailInspectResponse | null>(null);

  const [loadingRun, setLoadingRun] = useState(false);
  const [inspectingGuardrail, setInspectingGuardrail] = useState(false);
  const [runningBenchmark, setRunningBenchmark] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load initial personas & benchmark telemetry
  useEffect(() => {
    fetchPersonas()
      .then((data) => {
        setPersonas(data.personas);
        if (data.architectures?.length) {
          setArchitectures(data.architectures);
        }
        const firstKey = Object.keys(data.personas)[0];
        if (firstKey && data.personas[firstKey]) {
          const p = data.personas[firstKey];
          setForm((prev) => ({
            ...prev,
            persona_key: firstKey,
            annual_income: p.income,
            monthly_debt_obligations: p.monthly_debt,
            requested_loan_amount: p.requested_amount,
            loan_tenure_months: p.tenure,
            collateral_value: p.collateral,
            credit_bureau_score: p.bureau_score,
            notes_or_prompt: p.prompt,
          }));
        }
      })
      .catch((err) => {
        setErrorMsg(`Failed to connect to backend API: ${err.message}`);
      });

    fetchTelemetry()
      .then((t) => setTelemetry(t))
      .catch(() => {
        // Non-fatal if artifacts are absent initially
      });
  }, []);

  // Live guardrail inspection whenever applicant notes/prompt changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setInspectingGuardrail(true);
      inspectGuardrail(form.notes_or_prompt)
        .then((res) => setGuardrailInspect(res))
        .catch(() => {})
        .finally(() => setInspectingGuardrail(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [form.notes_or_prompt]);

  const handlePersonaChange = useCallback(
    (key: string) => {
      const p = personas[key];
      if (!p) return;
      setForm((prev) => ({
        ...prev,
        persona_key: key,
        annual_income: p.income,
        monthly_debt_obligations: p.monthly_debt,
        requested_loan_amount: p.requested_amount,
        loan_tenure_months: p.tenure,
        collateral_value: p.collateral,
        credit_bureau_score: p.bureau_score,
        notes_or_prompt: p.prompt,
      }));
    },
    [personas]
  );

  const handleFieldChange = useCallback(
    <K extends keyof UnderwriteFormInput>(field: K, value: UnderwriteFormInput[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleRunUnderwriting = async () => {
    setLoadingRun(true);
    setErrorMsg(null);
    setMobileSidebarOpen(false);
    try {
      const res = await runUnderwriting(form);
      setResult(res);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Underwriting execution failed');
    } finally {
      setLoadingRun(false);
    }
  };

  const handleRunBenchmark = async () => {
    setRunningBenchmark(true);
    setErrorMsg(null);
    try {
      const updated = await triggerBenchmark();
      setTelemetry(updated);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Benchmark execution failed');
    } finally {
      setRunningBenchmark(false);
    }
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: 'assessment',
      label: 'Underwriting Assessment',
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      key: 'blackboard',
      label: 'Blackboard State & A2A',
      icon: <BrainCircuit className="h-4 w-4" />,
    },
    {
      key: 'guardrails',
      label: 'Guardrails & Security',
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      key: 'telemetry',
      label: 'MAS Telemetry & Benchmarks',
      icon: <BarChart2 className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Configuration Sidebar */}
      <Sidebar
        personas={personas}
        architectures={architectures}
        form={form}
        onPersonaChange={handlePersonaChange}
        onFieldChange={handleFieldChange}
        onRun={handleRunUnderwriting}
        loading={loadingRun}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="border-b border-slate-200 bg-white px-5 py-4 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="mt-1 rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Open configuration"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-900 text-white shadow-sm">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h1 className="text-xl font-extrabold tracking-tight text-blue-950 sm:text-2xl">
                    CreditSight: Explainable Agentic Loan Underwriting
                  </h1>
                </div>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                  Collaborative Multi-Agent System (MAS) combining{' '}
                  <span className="font-semibold text-amber-800">CrewAI</span> and{' '}
                  <span className="font-semibold text-indigo-800">Google ADK</span> over a{' '}
                  <span className="font-semibold text-slate-800">Blackboard Architecture</span> with
                  MCP Tooling
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-800">
                Google ADK
              </span>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                CrewAI
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                React + FastAPI
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="mt-4 flex gap-1.5 overflow-x-auto border-t border-slate-100 pt-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {errorMsg && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'guardrails' ? (
            <GuardrailsTab
              prompt={form.notes_or_prompt}
              result={result}
              guardrailInspect={guardrailInspect}
              inspecting={inspectingGuardrail}
            />
          ) : activeTab === 'telemetry' ? (
            <TelemetryTab
              telemetry={telemetry}
              runningBenchmark={runningBenchmark}
              onRunBenchmark={handleRunBenchmark}
            />
          ) : !result ? (
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <BrainCircuit className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Ready to Orchestrate Multi-Agent Underwriting
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                Choose an applicant persona or customize financial parameters in the left sidebar,
                select an agentic pattern, and launch the collaborative underwriting pipeline.
              </p>
              <button
                onClick={handleRunUnderwriting}
                disabled={loadingRun}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 disabled:opacity-60"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Run With Current Configuration</span>
              </button>
            </div>
          ) : activeTab === 'assessment' ? (
            <UnderwritingTab result={result} />
          ) : (
            <BlackboardTab result={result} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

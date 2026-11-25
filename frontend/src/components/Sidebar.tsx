import React from 'react';
import {
  Play,
  Sliders,
  User,
  DollarSign,
  ShieldAlert,
  Cpu,
  X,
  Loader2,
} from 'lucide-react';
import type {
  ArchitectureOption,
  ArchitecturePattern,
  PersonaConfig,
  UnderwriteFormInput,
} from '../types/creditsight';

interface SidebarProps {
  personas: Record<string, PersonaConfig>;
  architectures: ArchitectureOption[];
  form: UnderwriteFormInput;
  onPersonaChange: (personaKey: string) => void;
  onFieldChange: <K extends keyof UnderwriteFormInput>(
    field: K,
    value: UnderwriteFormInput[K]
  ) => void;
  onRun: () => void;
  loading: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  personas,
  architectures,
  form,
  onPersonaChange,
  onFieldChange,
  onRun,
  loading,
  isOpenMobile,
  onCloseMobile,
}) => {
  const personaKeys = Object.keys(personas);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-80 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Sliders className="h-5 w-5 text-blue-700" />
            <h2 className="text-base font-bold tracking-tight">Case Configuration</h2>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Controls */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {/* Preset Persona Selector */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Applicant Persona / Scenario
            </label>
            <select
              value={form.persona_key}
              onChange={(e) => onPersonaChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              {personaKeys.map((key) => (
                <option key={key} value={key}>
                  {personas[key].persona_name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <User className="h-3.5 w-3.5" />
              <span>Applicant Details</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Applicant Name
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => onFieldChange('full_name', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Annual Income ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="number"
                      step={5000}
                      min={0}
                      value={form.annual_income}
                      onChange={(e) =>
                        onFieldChange('annual_income', Math.max(0, Number(e.target.value)))
                      }
                      className="w-full rounded-lg border border-slate-300 py-1.5 pl-6 pr-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Monthly Debt ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="number"
                      step={200}
                      min={0}
                      value={form.monthly_debt_obligations}
                      onChange={(e) =>
                        onFieldChange(
                          'monthly_debt_obligations',
                          Math.max(0, Number(e.target.value))
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 py-1.5 pl-6 pr-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Loan Amount ($)
                  </label>
                  <input
                    type="number"
                    step={5000}
                    min={1000}
                    value={form.requested_loan_amount}
                    onChange={(e) =>
                      onFieldChange(
                        'requested_loan_amount',
                        Math.max(1, Number(e.target.value))
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Collateral ($)
                  </label>
                  <input
                    type="number"
                    step={5000}
                    min={0}
                    value={form.collateral_value}
                    onChange={(e) =>
                      onFieldChange('collateral_value', Math.max(0, Number(e.target.value)))
                    }
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              {/* Tenure Slider */}
              <div>
                <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>Loan Tenure</span>
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono font-semibold text-blue-700">
                    {form.loan_tenure_months} mos
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={84}
                  step={6}
                  value={form.loan_tenure_months}
                  onChange={(e) =>
                    onFieldChange('loan_tenure_months', Number(e.target.value))
                  }
                  className="h-1.5 w-full cursor-pointer accent-blue-700"
                />
                <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
                  <span>12m</span>
                  <span>48m</span>
                  <span>84m</span>
                </div>
              </div>

              {/* Bureau Score Slider */}
              <div>
                <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>Credit Bureau Score</span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono font-semibold ${
                      form.credit_bureau_score >= 700
                        ? 'bg-emerald-50 text-emerald-700'
                        : form.credit_bureau_score >= 600
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {form.credit_bureau_score}
                  </span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={850}
                  step={5}
                  value={form.credit_bureau_score}
                  onChange={(e) =>
                    onFieldChange('credit_bureau_score', Number(e.target.value))
                  }
                  className="h-1.5 w-full cursor-pointer accent-blue-700"
                />
                <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
                  <span>300</span>
                  <span>600 (Floor)</span>
                  <span>850</span>
                </div>
              </div>

              {/* Notes / Prompt */}
              <div>
                <div className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-700">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                  <span>Applicant Notes / Prompt</span>
                </div>
                <textarea
                  rows={4}
                  value={form.notes_or_prompt}
                  onChange={(e) => onFieldChange('notes_or_prompt', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs leading-relaxed text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  placeholder="Enter applicant remarks or test adversarial prompt injection / PII masking..."
                />
              </div>
            </div>
          </div>

          {/* Architecture Pattern Selector */}
          <div className="border-t border-slate-100 pt-4">
            <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Cpu className="h-3.5 w-3.5" />
              <span>Architecture Pattern</span>
            </div>
            <div className="space-y-2">
              {architectures.map((arch) => {
                const selected = form.architecture === arch.id;
                return (
                  <label
                    key={arch.id}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 text-xs transition ${
                      selected
                        ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="architecture"
                      value={arch.id}
                      checked={selected}
                      onChange={() =>
                        onFieldChange('architecture', arch.id as ArchitecturePattern)
                      }
                      className="mt-0.5 accent-blue-700"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">{arch.label}</div>
                      <div className="mt-0.5 text-[11px] leading-snug text-slate-500">
                        {arch.description}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Run Button */}
        <div className="border-t border-slate-200 bg-slate-50 p-4">
          <button
            onClick={onRun}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Orchestrating Agents...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Run Multi-Agent Underwriting</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

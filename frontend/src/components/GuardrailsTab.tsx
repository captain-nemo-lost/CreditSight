import React from 'react';
import {
  AlertOctagon,
  Calculator,
  CheckCircle2,
  KeyRound,
  Lock,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import type { GuardrailInspectResponse, UnderwriteResponse } from '../types/creditsight';

interface GuardrailsTabProps {
  prompt: string;
  result: UnderwriteResponse | null;
  guardrailInspect: GuardrailInspectResponse | null;
  inspecting: boolean;
}

export const GuardrailsTab: React.FC<GuardrailsTabProps> = ({
  prompt,
  result,
  guardrailInspect,
  inspecting,
}) => {
  const validation = guardrailInspect?.validation ?? result?.guardrail ?? null;

  const dtiRatio = result?.blackboard.applicant_profile?.ratios.debt_to_income_ratio ?? 0;
  const bureauScore = result?.blackboard.applicant_profile?.bureau_score ?? 700;
  const hardGateTriggered = dtiRatio > 0.5 || bureauScore < 600;

  if (!validation) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        {inspecting ? 'Inspecting input guardrails...' : 'Waiting for guardrail telemetry...'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <ShieldCheck className="h-5 w-5 text-blue-700" />
            <span>Enterprise 5-Tier Banking Guardrails & Security System</span>
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Real-time protection covering Prompt Injection, Toxic Conduct, PII Privacy Masking,
            Anti-Hallucination Math Invariants, and Central Bank Hard-Gates.
          </p>
        </div>

        {/* Top 4 Security Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Safety Score
            </div>
            <div className="mt-1.5 font-mono text-2xl font-bold text-slate-900">
              {validation.safety_score.toFixed(2)} / 1.00
            </div>
          </div>

          <div
            className={`rounded-xl border p-4 ${
              validation.has_prompt_injection
                ? 'border-rose-200 bg-rose-50'
                : 'border-emerald-200 bg-emerald-50'
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Prompt Injection
            </div>
            <div
              className={`mt-1.5 flex items-center gap-1.5 text-lg font-bold ${
                validation.has_prompt_injection ? 'text-rose-800' : 'text-emerald-800'
              }`}
            >
              {validation.has_prompt_injection ? (
                <>
                  <AlertOctagon className="h-5 w-5" />
                  <span>BLOCKED</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>CLEAN</span>
                </>
              )}
            </div>
          </div>

          <div
            className={`rounded-xl border p-4 ${
              validation.has_pii_leak
                ? 'border-amber-200 bg-amber-50'
                : 'border-emerald-200 bg-emerald-50'
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              PII Data Exfiltration
            </div>
            <div
              className={`mt-1.5 flex items-center gap-1.5 text-lg font-bold ${
                validation.has_pii_leak ? 'text-amber-800' : 'text-emerald-800'
              }`}
            >
              {validation.has_pii_leak ? (
                <>
                  <Lock className="h-5 w-5" />
                  <span>MASKED</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>CLEAN</span>
                </>
              )}
            </div>
          </div>

          <div
            className={`rounded-xl border p-4 ${
              validation.has_toxic_language
                ? 'border-orange-200 bg-orange-50'
                : 'border-emerald-200 bg-emerald-50'
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Toxic Conduct
            </div>
            <div
              className={`mt-1.5 flex items-center gap-1.5 text-lg font-bold ${
                validation.has_toxic_language ? 'text-orange-800' : 'text-emerald-800'
              }`}
            >
              {validation.has_toxic_language ? (
                <>
                  <ShieldAlert className="h-5 w-5" />
                  <span>REDACTED</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>CLEAN</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Detail View */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Input & Confidentiality Inspection */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-3 text-base font-bold text-slate-900">
            1. Input & Confidentiality Inspection
          </h4>

          <div className="mb-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Raw Input Text
            </div>
            <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-900 p-3 font-mono text-xs text-slate-100">
              {prompt || '(empty)'}
            </pre>
          </div>

          {validation.flags.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3.5">
                <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-rose-800">
                  Active Security Triggers
                </div>
                <ul className="space-y-1 text-xs text-rose-900">
                  {validation.flags.map((fl, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <AlertOctagon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-600" />
                      <span className="font-mono">{fl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {validation.masked_pii_entities.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5">
                  <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                    Confidential PII Tokens Masked
                  </div>
                  <ul className="space-y-1 text-xs text-amber-900">
                    {validation.masked_pii_entities.map((pii, i) => (
                      <li key={i} className="flex items-center gap-1.5 font-mono">
                        <KeyRound className="h-3.5 w-3.5 text-amber-600" />
                        <span>{pii}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sanitized Text (Passed to Agents)
                </div>
                <pre className="whitespace-pre-wrap rounded-lg border border-emerald-200 bg-emerald-950 p-3 font-mono text-xs text-emerald-100">
                  {validation.sanitized_prompt}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Input successfully cleared all behavioral, injection, and PII filters.</span>
            </div>
          )}
        </div>

        {/* Right: Systemic & Statutory Guardrails */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="text-base font-bold text-slate-900">
            2. Systemic & Statutory Guardrails
          </h4>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Scale className="h-3.5 w-3.5" />
              <span>Central Bank Hard-Gate Anti-Subversion</span>
            </div>
            {result ? (
              hardGateTriggered ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-900">
                  <strong>Statutory Circuit-Breaker Triggered:</strong> DTI (
                  {(dtiRatio * 100).toFixed(1)}%) &gt; 50% or Bureau ({bureauScore}) &lt; 600.
                  Guardrail forbids automated approval regardless of agent reasoning.
                </div>
              ) : (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-900">
                  <strong>Prudential Limits Verified:</strong> DTI ({(dtiRatio * 100).toFixed(1)}
                  %) and Bureau ({bureauScore}) are within RBI & Basel III statutory thresholds.
                </div>
              )
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600">
                Run underwriting to evaluate case-specific DTI and Bureau hard-gate circuit breakers.
              </div>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Calculator className="h-3.5 w-3.5" />
              <span>Anti-Hallucination Mathematical Invariant Check</span>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3.5 text-sm text-blue-900">
              Ground-truth formula reconciliation active: EMI, DTI, and default probability bounds
              are verified against deterministic calculations with zero arithmetic drift.
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Enterprise Guardrails Enforced
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              {validation.active_guardrails_checked.map((gr, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{gr}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

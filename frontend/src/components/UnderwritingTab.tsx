import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck2,
  Percent,
  Scale,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import type { UnderwriteResponse, UnderwritingRecommendation } from '../types/creditsight';

interface UnderwritingTabProps {
  result: UnderwriteResponse;
}

const REC_STYLES: Record<
  UnderwritingRecommendation,
  { bg: string; text: string; border: string; badge: string }
> = {
  APPROVE: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    badge: 'bg-emerald-600 text-white',
  },
  APPROVE_WITH_CONDITIONS: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    badge: 'bg-amber-600 text-white',
  },
  REFER_TO_SENIOR_COMMITTEE: {
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    border: 'border-orange-200',
    badge: 'bg-orange-600 text-white',
  },
  REJECT: {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    badge: 'bg-rose-600 text-white',
  },
};

export const UnderwritingTab: React.FC<UnderwritingTabProps> = ({ result }) => {
  const { memo, duration_ms } = result;
  const risk = memo.credit_risk_synthesis;
  const policy = memo.policy_compliance_findings;
  const profile = memo.applicant_financial_profile;
  const recStyle = REC_STYLES[memo.recommendation];

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={`rounded-xl border p-4 shadow-sm ${recStyle.bg} ${recStyle.border}`}>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-600">
            <span>Final Recommendation</span>
            <FileCheck2 className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-2">
            <span
              className={`inline-block rounded-lg px-2.5 py-1 text-sm font-bold tracking-wide ${recStyle.badge}`}
            >
              {memo.recommendation.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Memo ID: <span className="font-mono font-medium">{memo.memo_id}</span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Recommended Rate</span>
            <Percent className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {memo.recommended_interest_rate_percent.toFixed(2)}%
          </div>
          <p className="mt-1 text-xs text-slate-500">Annualized risk-adjusted APR</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Max Sanction Exposure</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            ${memo.recommended_max_exposure.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Est. EMI: ${profile.ratios.estimated_monthly_emi.toLocaleString()} / mo
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Pipeline Latency</span>
            <Clock className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{duration_ms} ms</div>
          <p className="mt-1 text-xs text-slate-500">
            Pattern: <span className="font-mono">{memo.architecture_used}</span>
          </p>
        </div>
      </div>

      {/* Executive Summary Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-950">
        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-800">
          Executive Summary
        </div>
        <p className="leading-relaxed">{memo.executive_summary}</p>
      </div>

      {/* Quantitative Risk + Regulatory Compliance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: CrewAI Quantitative Risk Model */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              1. Quantitative Risk Model Output
            </h3>
            <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
              CrewAI
            </span>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3.5 text-sm">
            <div>
              <div className="text-xs text-slate-500">Probability of Default (PD)</div>
              <div className="font-mono text-lg font-bold text-slate-900">
                {(risk.probability_of_default * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Risk Score (Safer = Higher)</div>
              <div className="font-mono text-lg font-bold text-slate-900">
                {risk.risk_score} / 100
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Risk Category</div>
              <div className="font-semibold text-slate-800">{risk.risk_category}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">DTI / Bureau Score</div>
              <div className="font-mono font-semibold text-slate-800">
                {(profile.ratios.debt_to_income_ratio * 100).toFixed(1)}% / {profile.bureau_score}
              </div>
            </div>
          </div>

          <div className="mb-3 text-xs text-slate-500">
            Model: <span className="font-mono text-slate-700">{risk.model_used}</span>
          </div>

          {risk.contributing_factors.length > 0 && (
            <div className="mb-3">
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700">
                Key Contributing Risk Factors
              </div>
              <ul className="space-y-1.5 text-sm text-slate-700">
                {risk.contributing_factors.map((cf, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span>{cf}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {risk.mitigating_factors.length > 0 && (
            <div>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Mitigating Factors
              </div>
              <ul className="space-y-1.5 text-sm text-slate-700">
                {risk.mitigating_factors.map((mf, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{mf}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Google ADK Regulatory Compliance */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              2. Regulatory Compliance Report
            </h3>
            <span className="rounded-md bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-900">
              Google ADK
            </span>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 p-3 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              {policy.overall_compliance ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-emerald-800">COMPLIANCE PASSED</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-600" />
                  <span className="text-rose-800">NON-COMPLIANT</span>
                </>
              )}
            </div>
            <div className="text-xs text-slate-600">
              Checked: <span className="font-mono font-bold">{policy.rules_checked}</span> | Passed:{' '}
              <span className="font-mono font-bold text-emerald-700">{policy.passed_count}</span> |
              Failed:{' '}
              <span className="font-mono font-bold text-rose-700">{policy.failed_count}</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-600">
                <tr>
                  <th className="px-3 py-2.5">Rule</th>
                  <th className="px-3 py-2.5">Threshold</th>
                  <th className="px-3 py-2.5">Actual</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                  <th className="px-3 py-2.5 text-center">Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {policy.rule_results.map((r) => (
                  <tr key={r.rule_id} className="hover:bg-slate-50/70">
                    <td className="px-3 py-2.5 font-medium text-slate-900">{r.rule_name}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-600">{r.policy_threshold}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-800">{r.applicant_actual}</td>
                    <td className="px-3 py-2.5 text-center">
                      {r.passed ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                          PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 font-semibold text-rose-700">
                          FAIL
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center text-slate-600">
                      {r.requires_human_override ? 'Yes' : 'No'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {policy.policy_citations.length > 0 && (
            <div className="mt-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Regulatory Citations (RAG / MCP)
              </div>
              <ul className="list-inside list-disc space-y-0.5 text-xs text-slate-600">
                {policy.policy_citations.map((cit, i) => (
                  <li key={i}>{cit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Evidence Fusion & Action Items */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900">
          <Scale className="h-4 w-4 text-blue-700" />
          <span>3. Evidence Fusion & Underwriter Action Items</span>
        </h3>

        {memo.conflicts_identified_and_resolved.length > 0 ? (
          <div className="mb-4 space-y-2">
            {memo.conflicts_identified_and_resolved.map((conf, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span>{conf}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>No cross-agent evidential conflicts or statutory overrides triggered.</span>
          </div>
        )}

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Action Items for Human Underwriter
          </div>
          <ul className="space-y-1.5 text-sm text-slate-700">
            {memo.underwriter_action_items.map((act, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-blue-700" />
          <span>
            Governance Provenance ID:{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800">
              {memo.audit_trail_provenance_id}
            </code>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>{memo.governance_statement}</span>
        </div>
      </div>
    </div>
  );
};

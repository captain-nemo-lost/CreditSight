import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Database,
  History,
  Radio,
  Wrench,
} from 'lucide-react';
import type { UnderwriteResponse } from '../types/creditsight';

interface BlackboardTabProps {
  result: UnderwriteResponse;
}

const FrameworkBadge: React.FC<{ framework: string }> = ({ framework }) => {
  const isAdk = framework.toLowerCase().includes('adk');
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${
        isAdk
          ? 'bg-indigo-100 text-indigo-800'
          : framework.toLowerCase().includes('crewai')
            ? 'bg-amber-100 text-amber-800'
            : 'bg-slate-100 text-slate-700'
      }`}
    >
      {framework.replace('_', ' ')}
    </span>
  );
};

export const BlackboardTab: React.FC<BlackboardTabProps> = ({ result }) => {
  const { blackboard, a2a_messages, mcp_tools } = result;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [showEvents, setShowEvents] = useState(false);

  const prof = blackboard.applicant_profile;
  const risk = blackboard.risk_assessment;
  const pol = blackboard.policy_report;
  const memo = blackboard.final_memo;

  return (
    <div className="space-y-6">
      {/* Blackboard Shared State 4-Slot Architecture */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Database className="h-4 w-4 text-blue-700" />
              <span>Blackboard Shared Memory Architecture</span>
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Thread-safe centralized state (RLock) where heterogeneous agents read evidence and post
              structured Pydantic updates.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono">
              Events: {blackboard.snapshot.total_events}
            </span>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono">
              Case: {blackboard.case_id}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Slot 1: Applicant Data Agent */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Applicant Data Agent</span>
              <FrameworkBadge framework="Google_ADK" />
            </div>
            {prof ? (
              <div className="space-y-1 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">DTI Ratio:</span>
                  <span className="font-mono font-semibold">
                    {(prof.ratios.debt_to_income_ratio * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bureau Score:</span>
                  <span className="font-mono font-semibold">{prof.bureau_score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Net Cash Flow:</span>
                  <span className="font-mono font-semibold">
                    ${prof.ratios.net_free_cash_flow_monthly.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">Pending...</div>
            )}
          </div>

          {/* Slot 2: Credit Risk Agent */}
          <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Credit Risk Agent</span>
              <FrameworkBadge framework="CrewAI" />
            </div>
            {risk ? (
              <div className="space-y-1 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Default Prob (PD):</span>
                  <span className="font-mono font-semibold">
                    {(risk.probability_of_default * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Risk Category:</span>
                  <span className="font-mono font-semibold">{risk.risk_category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Risk Score:</span>
                  <span className="font-mono font-semibold">{risk.risk_score} / 100</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">Pending...</div>
            )}
          </div>

          {/* Slot 3: Policy Agent */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Regulatory Policy Agent</span>
              <FrameworkBadge framework="Google_ADK" />
            </div>
            {pol ? (
              <div className="space-y-1 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Overall Compliance:</span>
                  <span className="font-mono font-semibold">
                    {pol.overall_compliance ? 'True' : 'False'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rules Checked:</span>
                  <span className="font-mono font-semibold">{pol.rules_checked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Failed Rules:</span>
                  <span className="font-mono font-semibold">{pol.failed_count}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">Pending...</div>
            )}
          </div>

          {/* Slot 4: Coordinator Agent */}
          <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Coordinator Agent</span>
              <FrameworkBadge framework="CrewAI" />
            </div>
            {memo ? (
              <div className="space-y-1 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Decision:</span>
                  <span className="font-mono font-semibold">{memo.recommendation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quoted Rate:</span>
                  <span className="font-mono font-semibold">
                    {memo.recommended_interest_rate_percent}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Max Exposure:</span>
                  <span className="font-mono font-semibold">
                    ${memo.recommended_max_exposure.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">Pending...</div>
            )}
          </div>
        </div>

        {/* Registered MCP Tools */}
        {mcp_tools && mcp_tools.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Wrench className="h-3.5 w-3.5" />
              <span>Model Context Protocol (MCP) Gateway Tools</span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
              {mcp_tools.map((tool) => (
                <div
                  key={tool.name}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs"
                >
                  <div className="font-mono font-semibold text-blue-800">{tool.name}</div>
                  <div className="mt-1 text-slate-600">{tool.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* A2A Protocol Bus Messages */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Radio className="h-4 w-4 text-emerald-600" />
              <span>Agent-to-Agent (A2A) Protocol Bus Messages</span>
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Cross-framework A2A/v1.0 envelopes bridging Google ADK and CrewAI agents ({a2a_messages.length}{' '}
              messages exchanged).
            </p>
          </div>
        </div>

        {a2a_messages.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 font-semibold text-slate-600">
                  <tr>
                    <th className="px-3 py-2.5">ID</th>
                    <th className="px-3 py-2.5">Sender</th>
                    <th className="px-3 py-2.5">Receiver</th>
                    <th className="px-3 py-2.5">Message Type</th>
                    <th className="px-3 py-2.5">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {a2a_messages.map((msg) => (
                    <tr key={msg.message_id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono text-slate-600">{msg.message_id}</td>
                      <td className="px-3 py-2">
                        <div className="font-medium text-slate-900">{msg.sender_agent}</div>
                        <FrameworkBadge framework={msg.sender_framework} />
                      </td>
                      <td className="px-3 py-2">
                        <div className="font-medium text-slate-900">{msg.receiver_agent}</div>
                        <FrameworkBadge framework={msg.receiver_framework} />
                      </td>
                      <td className="px-3 py-2">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-800">
                          {msg.message_type}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] text-slate-500">
                        {msg.timestamp.split('T')[1]?.slice(0, 8) ?? msg.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expandable Envelopes */}
            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Inspect A2A Message Envelopes & Payloads
              </div>
              {a2a_messages.map((msg, idx) => {
                const isOpen = expandedIdx === idx;
                return (
                  <div
                    key={msg.message_id}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <button
                      onClick={() => setExpandedIdx(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs transition hover:bg-slate-100"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-slate-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-500" />
                        )}
                        <span className="font-bold text-slate-800">Step {idx + 1}:</span>
                        <span className="font-semibold text-slate-900">{msg.sender_agent}</span>
                        <FrameworkBadge framework={msg.sender_framework} />
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-900">{msg.receiver_agent}</span>
                        <FrameworkBadge framework={msg.receiver_framework} />
                        <span className="font-mono text-[11px] text-blue-700">
                          [{msg.message_type}]
                        </span>
                      </div>
                    </button>
                    {isOpen && (
                      <pre className="overflow-x-auto border-t border-slate-200 bg-slate-900 p-3 font-mono text-xs text-slate-100">
                        {JSON.stringify(msg.payload, null, 2)}
                      </pre>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500">No A2A bus dispatches recorded.</p>
        )}
      </div>

      {/* Blackboard Immutable Audit Event Log */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <button
          onClick={() => setShowEvents((prev) => !prev)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-bold text-slate-900">
              Blackboard Immutable Event Provenance Log ({blackboard.event_log.length} events)
            </span>
          </div>
          {showEvents ? (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {showEvents && (
          <div className="mt-3 max-h-72 overflow-y-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="sticky top-0 bg-slate-50 font-semibold text-slate-600">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Agent / Source</th>
                  <th className="px-3 py-2">Action</th>
                  <th className="px-3 py-2">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {blackboard.event_log.map((ev, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 font-mono text-slate-400">{i + 1}</td>
                    <td className="px-3 py-2 font-semibold text-slate-800">{ev.agent}</td>
                    <td className="px-3 py-2 font-mono text-blue-700">{ev.action}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-slate-600">
                      {JSON.stringify(ev.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

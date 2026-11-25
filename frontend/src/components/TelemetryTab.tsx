import React from 'react';
import {
  Activity,
  BarChart3,
  Clock,
  Cpu,
  DollarSign,
  Loader2,
  PlayCircle,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TelemetryPayload } from '../types/creditsight';

interface TelemetryTabProps {
  telemetry: TelemetryPayload | null;
  runningBenchmark: boolean;
  onRunBenchmark: () => void;
}

const ARCH_COLORS = ['#1d4ed8', '#059669', '#d97706'];

export const TelemetryTab: React.FC<TelemetryTabProps> = ({
  telemetry,
  runningBenchmark,
  onRunBenchmark,
}) => {
  const summary = telemetry?.summary;
  const agentTelemetry = telemetry?.agent_telemetry ?? [];
  const artifacts = telemetry?.artifacts;

  const archChartData = summary
    ? Object.keys(summary.architecture_latency_breakdown.mean).map((arch) => ({
        name: arch.replace(/_/g, ' '),
        mean_ms: Number(summary.architecture_latency_breakdown.mean[arch].toFixed(2)),
        median_ms: Number(summary.architecture_latency_breakdown.median[arch].toFixed(2)),
      }))
    : [];

  const recChartData = summary
    ? Object.entries(summary.recommendation_distribution).map(([rec, count]) => ({
        recommendation: rec.replace(/_/g, ' '),
        count,
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Header + Run Benchmark Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <BarChart3 className="h-5 w-5 text-blue-700" />
            <span>Multi-Agent System (MAS) Telemetry & 45-Run Benchmark</span>
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Empirical latency, token economics, and cross-architecture variance across 45 test cases
            (5 personas x 3 agentic architectures).
          </p>
        </div>

        <button
          onClick={onRunBenchmark}
          disabled={runningBenchmark}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
        >
          {runningBenchmark ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Running 45 Cases...</span>
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4" />
              <span>Re-run 45-Case Benchmark</span>
            </>
          )}
        </button>
      </div>

      {/* Benchmark KPIs */}
      {summary && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Benchmark Cases</span>
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-slate-900">
              {summary.total_runs} runs
            </div>
            <p className="mt-1 text-xs text-slate-500">5 personas across 3 patterns</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Mean / P95 Latency</span>
              <Clock className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-slate-900">
              {summary.mean_latency_ms} ms
            </div>
            <p className="mt-1 text-xs text-slate-500">P95: {summary.p95_latency_ms} ms</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Avg Tokens / Case</span>
              <Zap className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-slate-900">
              {summary.avg_tokens_per_run.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Total: {summary.total_estimated_tokens.toLocaleString()} tokens
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Total Benchmark Cost</span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-slate-900">
              ${summary.total_cost_usd.toFixed(4)}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Avg/case: ${summary.avg_cost_per_case_usd.toFixed(6)}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Recharts Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 1: Architecture Latency Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-3 text-sm font-bold text-slate-900">
            Interactive Architecture Latency (ms)
          </h4>
          {archChartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={archChartData} margin={{ top: 10, right: 16, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-10} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="mean_ms" name="Mean (ms)" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="median_ms" name="Median (ms)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-slate-400">No benchmark data yet.</div>
          )}
        </div>

        {/* Chart 2: Per-Agent Telemetry (Tokens & Latency) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-3 text-sm font-bold text-slate-900">
            Per-Agent Token Consumption & Latency
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentTelemetry} margin={{ top: 10, right: 16, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="agent" tick={{ fontSize: 10 }} interval={0} angle={-10} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg_tokens" name="Avg Tokens / Case" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg_latency_ms" name="Avg Latency (ms)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendation Distribution Bar */}
      {recChartData.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
            <Cpu className="h-4 w-4 text-blue-700" />
            <span>45-Run Decision Distribution</span>
          </h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recChartData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="recommendation" width={180} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Cases" radius={[0, 4, 4, 0]}>
                  {recChartData.map((_, idx) => (
                    <Cell key={idx} fill={ARCH_COLORS[idx % ARCH_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Official Generated Seaborn / Matplotlib Artifacts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-3 text-sm font-bold text-slate-900">
            1. MAS Agent Performance Heatmap
          </h4>
          {artifacts?.heatmap_available && artifacts.heatmap_url ? (
            <img
              src={`${artifacts.heatmap_url}?t=${summary?.total_runs ?? 1}`}
              alt="MAS Agent Performance Heatmap"
              className="w-full rounded-lg border border-slate-100"
            />
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
              Click "Re-run 45-Case Benchmark" above to generate the heatmap artifact.
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-3 text-sm font-bold text-slate-900">
            2. 45-Run Performance Boxplot (Latency & Variances)
          </h4>
          {artifacts?.boxplot_available && artifacts.boxplot_url ? (
            <img
              src={`${artifacts.boxplot_url}?t=${summary?.total_runs ?? 1}`}
              alt="45-Run Benchmark Boxplot"
              className="w-full rounded-lg border border-slate-100"
            />
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
              Click "Re-run 45-Case Benchmark" above to generate the boxplot artifact.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

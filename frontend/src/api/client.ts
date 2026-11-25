import type {
  GuardrailInspectResponse,
  PersonasResponse,
  TelemetryPayload,
  UnderwriteFormInput,
  UnderwriteResponse,
} from '../types/creditsight';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const errBody = await res.json();
      detail = errBody.detail || detail;
    } catch {
      // ignore json parse failure
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export async function fetchPersonas(): Promise<PersonasResponse> {
  const res = await fetch('/api/personas');
  return handleResponse<PersonasResponse>(res);
}

export async function runUnderwriting(payload: UnderwriteFormInput): Promise<UnderwriteResponse> {
  const res = await fetch('/api/underwrite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<UnderwriteResponse>(res);
}

export async function inspectGuardrail(
  prompt: string,
  dtiRatio?: number,
  bureauScore?: number
): Promise<GuardrailInspectResponse> {
  const res = await fetch('/api/guardrail/inspect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      dti_ratio: dtiRatio,
      bureau_score: bureauScore,
    }),
  });
  return handleResponse<GuardrailInspectResponse>(res);
}

export async function fetchTelemetry(): Promise<TelemetryPayload> {
  const res = await fetch('/api/telemetry');
  return handleResponse<TelemetryPayload>(res);
}

export async function triggerBenchmark(): Promise<TelemetryPayload> {
  const res = await fetch('/api/benchmark/run', { method: 'POST' });
  return handleResponse<TelemetryPayload>(res);
}

export type ArchitecturePattern =
  | 'BLACKBOARD_HIERARCHICAL'
  | 'PARALLEL_FANOUT'
  | 'SEQUENTIAL_PIPELINE';

export type RiskCategory = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type UnderwritingRecommendation =
  | 'APPROVE'
  | 'APPROVE_WITH_CONDITIONS'
  | 'REFER_TO_SENIOR_COMMITTEE'
  | 'REJECT';

export interface PersonaConfig {
  persona_name: string;
  income: number;
  monthly_debt: number;
  requested_amount: number;
  tenure: number;
  collateral: number;
  bureau_score: number;
  prompt: string;
}

export interface ArchitectureOption {
  id: ArchitecturePattern;
  label: string;
  description: string;
}

export interface PersonasResponse {
  personas: Record<string, PersonaConfig>;
  architectures: ArchitectureOption[];
}

export interface UnderwriteFormInput {
  persona_key: string;
  full_name: string;
  annual_income: number;
  monthly_debt_obligations: number;
  requested_loan_amount: number;
  loan_tenure_months: number;
  collateral_value: number;
  credit_bureau_score: number;
  notes_or_prompt: string;
  architecture: ArchitecturePattern;
}

export interface FinancialRatios {
  debt_to_income_ratio: number;
  loan_to_value_ratio: number;
  collateral_coverage_ratio: number;
  estimated_monthly_emi: number;
  net_free_cash_flow_monthly: number;
}

export interface ApplicantProfile {
  applicant_id: string;
  full_name: string;
  annual_income: number;
  monthly_income: number;
  requested_loan_amount: number;
  loan_purpose: string;
  loan_tenure_months: number;
  collateral_value: number;
  employment_type: string;
  ratios: FinancialRatios;
  bureau_score: number;
  data_quality_score: number;
  extraction_timestamp: string;
}

export interface CreditRiskAssessment {
  agent_name: string;
  framework: string;
  probability_of_default: number;
  risk_score: number;
  risk_category: RiskCategory;
  model_used: string;
  contributing_factors: string[];
  mitigating_factors: string[];
  quantitative_flags: string[];
  confidence_level: number;
}

export interface PolicyRuleResult {
  rule_id: string;
  rule_name: string;
  category: string;
  passed: boolean;
  policy_threshold: string;
  applicant_actual: string;
  details: string;
  requires_human_override: boolean;
}

export interface PolicyComplianceReport {
  agent_name: string;
  framework: string;
  overall_compliance: boolean;
  rules_checked: number;
  passed_count: number;
  failed_count: number;
  warning_count: number;
  regulatory_frameworks: string[];
  rule_results: PolicyRuleResult[];
  policy_citations: string[];
  compliance_confidence: number;
}

export interface CreditMemo {
  memo_id: string;
  applicant_id: string;
  applicant_name: string;
  timestamp: string;
  architecture_used: ArchitecturePattern;
  recommendation: UnderwritingRecommendation;
  recommended_interest_rate_percent: number;
  recommended_max_exposure: number;
  executive_summary: string;
  applicant_financial_profile: ApplicantProfile;
  credit_risk_synthesis: CreditRiskAssessment;
  policy_compliance_findings: PolicyComplianceReport;
  evidence_fusion_notes: string[];
  conflicts_identified_and_resolved: string[];
  underwriter_action_items: string[];
  audit_trail_provenance_id: string;
  governance_statement: string;
}

export interface BlackboardEvent {
  timestamp: number;
  agent: string;
  action: string;
  details: Record<string, unknown>;
}

export interface AgentCallbackMetric {
  agent_name: string;
  framework: string;
  action: string;
  execution_time_ms: number;
  tokens_estimated: number;
  status: string;
  tool_calls: string[];
  timestamp: string;
  error_message: string | null;
}

export interface BlackboardState {
  case_id: string;
  snapshot: {
    case_id: string;
    has_raw_input: boolean;
    has_profile: boolean;
    has_risk: boolean;
    has_policy: boolean;
    has_memo: boolean;
    total_events: number;
    total_a2a_messages: number;
    total_metrics: number;
  };
  applicant_profile: ApplicantProfile | null;
  risk_assessment: CreditRiskAssessment | null;
  policy_report: PolicyComplianceReport | null;
  final_memo: CreditMemo | null;
  event_log: BlackboardEvent[];
  metrics: AgentCallbackMetric[];
}

export interface A2AMessageEnvelope {
  message_id: string;
  sender_agent: string;
  sender_framework: string;
  receiver_agent: string;
  receiver_framework: string;
  protocol: string;
  message_type: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface GuardrailValidation {
  is_safe: boolean;
  has_toxic_language: boolean;
  has_prompt_injection: boolean;
  has_pii_leak: boolean;
  has_arithmetic_inconsistency: boolean;
  has_regulatory_violation: boolean;
  has_schema_violation: boolean;
  safety_score: number;
  flags: string[];
  sanitized_prompt: string | null;
  masked_pii_entities: string[];
  active_guardrails_checked: string[];
}

export interface MCPToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface UnderwriteResponse {
  duration_ms: number;
  memo: CreditMemo;
  blackboard: BlackboardState;
  a2a_messages: A2AMessageEnvelope[];
  guardrail: GuardrailValidation;
  mcp_tools: MCPToolDefinition[];
}

export interface GuardrailInspectResponse {
  validation: GuardrailValidation;
  statutory_hard_gate: {
    triggered: boolean;
    dti_ratio: number;
    bureau_score: number;
    dti_limit: number;
    min_bureau_score: number;
  };
}

export interface BenchmarkRunRecord {
  run_id: number;
  applicant_id: string;
  persona: string;
  architecture: string;
  execution_time_ms: number;
  tokens_estimated: number;
  cost_usd: number;
  recommendation: string;
  probability_of_default: number;
  policy_passed: boolean;
  conflicts_count: number;
  guardrail_safety_score: number;
}

export interface AgentTelemetryItem {
  agent: string;
  framework: string;
  avg_latency_ms: number;
  avg_tokens: number;
  tool_calls_per_case: number;
  success_rate: number;
}

export interface BenchmarkSummary {
  total_runs: number;
  mean_latency_ms: number;
  median_latency_ms: number;
  p95_latency_ms: number;
  min_latency_ms: number;
  max_latency_ms: number;
  total_estimated_tokens: number;
  avg_tokens_per_run: number;
  total_cost_usd: number;
  avg_cost_per_case_usd: number;
  recommendation_distribution: Record<string, number>;
  architecture_latency_breakdown: {
    mean: Record<string, number>;
    median: Record<string, number>;
    std: Record<string, number>;
  };
}

export interface TelemetryPayload {
  summary: BenchmarkSummary | null;
  runs: BenchmarkRunRecord[];
  agent_telemetry: AgentTelemetryItem[];
  artifacts: {
    heatmap_available: boolean;
    boxplot_available: boolean;
    heatmap_url: string | null;
    boxplot_url: string | null;
  };
}

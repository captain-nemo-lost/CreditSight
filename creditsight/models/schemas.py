from __future__ import annotations
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, field_validator
from enum import Enum
import datetime

class RiskCategory(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class UnderwritingRecommendation(str, Enum):
    APPROVE = "APPROVE"
    APPROVE_WITH_CONDITIONS = "APPROVE_WITH_CONDITIONS"
    REFER_TO_SENIOR_COMMITTEE = "REFER_TO_SENIOR_COMMITTEE"
    REJECT = "REJECT"

class ArchitecturePattern(str, Enum):
    BLACKBOARD_HIERARCHICAL = "BLACKBOARD_HIERARCHICAL"
    SEQUENTIAL_PIPELINE = "SEQUENTIAL_PIPELINE"
    PARALLEL_FANOUT = "PARALLEL_FANOUT"
    PEER_TO_PEER = "PEER_TO_PEER"

class ApplicantRawInput(BaseModel):
    applicant_id: str = Field(..., description="Unique applicant identifier")
    full_name: str = Field(..., description="Applicant legal name")
    annual_income: float = Field(..., ge=0, description="Annual verifiable income in USD/INR")
    monthly_debt_obligations: float = Field(0.0, ge=0, description="Existing monthly debt payments")
    requested_loan_amount: float = Field(..., gt=0, description="Requested principal amount")
    loan_purpose: str = Field("Working Capital", description="Purpose of loan")
    loan_tenure_months: int = Field(36, gt=0, description="Tenure in months")
    collateral_value: float = Field(0.0, ge=0, description="Estimated value of pledged collateral")
    employment_type: str = Field("Salaried", description="Employment category: Salaried, Self-Employed, SME")
    credit_bureau_score: Optional[int] = Field(None, ge=300, le=900, description="Bureau score if known")
    notes_or_prompt: str = Field("", description="Raw applicant narrative, remarks or notes")

class FinancialRatios(BaseModel):
    debt_to_income_ratio: float = Field(..., description="Monthly debt divided by monthly income")
    loan_to_value_ratio: float = Field(..., description="Loan amount divided by collateral value (if pledged)")
    collateral_coverage_ratio: float = Field(..., description="Collateral value / Loan amount")
    estimated_monthly_emi: float = Field(..., description="Estimated monthly EMI payment")
    net_free_cash_flow_monthly: float = Field(..., description="Remaining monthly cash after all obligations")

class ApplicantProfile(BaseModel):
    applicant_id: str
    full_name: str
    annual_income: float
    monthly_income: float
    requested_loan_amount: float
    loan_purpose: str
    loan_tenure_months: int
    collateral_value: float
    employment_type: str
    ratios: FinancialRatios
    bureau_score: int
    data_quality_score: float = Field(1.0, ge=0.0, le=1.0)
    extraction_timestamp: str = Field(default_factory=lambda: datetime.datetime.utcnow().isoformat())

class CreditRiskAssessment(BaseModel):
    agent_name: str = "CreditRiskAgent"
    framework: str = "CrewAI"
    probability_of_default: float = Field(..., ge=0.0, le=1.0, description="Estimated default probability (0-1)")
    risk_score: float = Field(..., ge=0.0, le=100.0, description="Normalized risk score (higher is safer)")
    risk_category: RiskCategory
    model_used: str = Field("LogisticRegression_PD_Ensemble_v2")
    contributing_factors: List[str] = Field(default_factory=list)
    mitigating_factors: List[str] = Field(default_factory=list)
    quantitative_flags: List[str] = Field(default_factory=list)
    confidence_level: float = Field(0.92, ge=0.0, le=1.0)

class PolicyRuleResult(BaseModel):
    rule_id: str
    rule_name: str
    category: str  # e.g., "DTI_LIMIT", "MIN_CREDIT_SCORE", "COLLATERAL_RULE", "KYC_AML"
    passed: bool
    policy_threshold: str
    applicant_actual: str
    details: str
    requires_human_override: bool = False

class PolicyComplianceReport(BaseModel):
    agent_name: str = "RegulatoryPolicyAgent"
    framework: str = "Google_ADK"
    overall_compliance: bool
    rules_checked: int
    passed_count: int
    failed_count: int
    warning_count: int
    regulatory_frameworks: List[str] = Field(default=["RBI_Prudential_Norms_2026", "Basel_III_Pillar_2", "Fair_Lending_Act"])
    rule_results: List[PolicyRuleResult] = Field(default_factory=list)
    policy_citations: List[str] = Field(default_factory=list)
    compliance_confidence: float = Field(0.95, ge=0.0, le=1.0)

class GuardrailValidation(BaseModel):
    is_safe: bool
    has_toxic_language: bool = False
    has_prompt_injection: bool = False
    has_pii_leak: bool = False
    has_arithmetic_inconsistency: bool = False
    has_regulatory_violation: bool = False
    has_schema_violation: bool = False
    safety_score: float = Field(1.0, ge=0.0, le=1.0)
    flags: List[str] = Field(default_factory=list)
    sanitized_prompt: Optional[str] = None
    masked_pii_entities: List[str] = Field(default_factory=list)
    active_guardrails_checked: List[str] = Field(default_factory=list)

class A2AMessageEnvelope(BaseModel):
    message_id: str
    sender_agent: str
    sender_framework: str  # "CrewAI" or "Google_ADK"
    receiver_agent: str
    receiver_framework: str
    protocol: str = "A2A/v1.0"
    message_type: str  # "TASK_REQUEST", "STATE_UPDATE", "NEGOTIATION", "TASK_RESPONSE"
    payload: Dict[str, Any]
    timestamp: str = Field(default_factory=lambda: datetime.datetime.utcnow().isoformat())

class AgentCallbackMetric(BaseModel):
    agent_name: str
    framework: str
    action: str
    execution_time_ms: float
    tokens_estimated: int = 0
    status: str = "SUCCESS"
    tool_calls: List[str] = Field(default_factory=list)
    timestamp: str = Field(default_factory=lambda: datetime.datetime.utcnow().isoformat())
    error_message: Optional[str] = None

class CreditMemo(BaseModel):
    memo_id: str
    applicant_id: str
    applicant_name: str
    timestamp: str = Field(default_factory=lambda: datetime.datetime.utcnow().isoformat())
    architecture_used: ArchitecturePattern
    recommendation: UnderwritingRecommendation
    recommended_interest_rate_percent: float
    recommended_max_exposure: float
    executive_summary: str
    applicant_financial_profile: ApplicantProfile
    credit_risk_synthesis: CreditRiskAssessment
    policy_compliance_findings: PolicyComplianceReport
    evidence_fusion_notes: List[str]
    conflicts_identified_and_resolved: List[str]
    underwriter_action_items: List[str]
    audit_trail_provenance_id: str
    governance_statement: str = "AI-Assisted Analysis -> Evidence-Grounded Recommendation -> Human Underwriter Decision. No automatic approval or denial is executed."

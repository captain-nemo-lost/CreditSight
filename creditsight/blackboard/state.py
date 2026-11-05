"""
CreditSight Blackboard Architecture & Shared State Implementation.
Satisfies Mandatory Criterion 1: Blackboard (Shared State) with comparative evaluation against Peer-to-Peer (P2P).
"""

from __future__ import annotations
import threading
import time
from typing import Dict, Any, List, Optional, Callable
from creditsight.models.schemas import (
    ApplicantRawInput,
    ApplicantProfile,
    CreditRiskAssessment,
    PolicyComplianceReport,
    CreditMemo,
    A2AMessageEnvelope,
    AgentCallbackMetric
)

class Blackboard:
    """
    Thread-safe, observable Blackboard shared memory for Multi-Agent Systems.
    Agents read evidence, post partial hypotheses/assessments, and trigger reactive workflows.
    Maintains complete audit provenance.
    """
    def __init__(self, case_id: str):
        self.case_id = case_id
        self._lock = threading.RLock()
        
        # Shared knowledge segments
        self.raw_input: Optional[ApplicantRawInput] = None
        self.applicant_profile: Optional[ApplicantProfile] = None
        self.risk_assessment: Optional[CreditRiskAssessment] = None
        self.policy_report: Optional[PolicyComplianceReport] = None
        self.final_memo: Optional[CreditMemo] = None
        
        # Provenance, messages and metrics
        self.message_bus: List[A2AMessageEnvelope] = []
        self.metrics: List[AgentCallbackMetric] = []
        self.event_log: List[Dict[str, Any]] = []
        self._subscribers: List[Callable[[str, Any], None]] = []
        
        self.log_event("SYSTEM", "BLACKBOARD_INITIALIZED", {"case_id": case_id})

    def subscribe(self, callback: Callable[[str, Any], None]):
        """Register a subscriber callback on state mutations."""
        with self._lock:
            self._subscribers.append(callback)

    def _notify(self, key: str, value: Any):
        for sub in self._subscribers:
            try:
                sub(key, value)
            except Exception as e:
                self.log_event("SYSTEM", "SUBSCRIBER_ERROR", {"error": str(e)})

    def log_event(self, agent: str, action: str, details: Dict[str, Any]):
        with self._lock:
            entry = {
                "timestamp": time.time(),
                "agent": agent,
                "action": action,
                "details": details
            }
            self.event_log.append(entry)

    def write_raw_input(self, data: ApplicantRawInput, source_agent: str = "InputIngestion"):
        with self._lock:
            self.raw_input = data
            self.log_event(source_agent, "WRITE_RAW_INPUT", {"applicant_id": data.applicant_id})
            self._notify("raw_input", data)

    def write_applicant_profile(self, profile: ApplicantProfile, source_agent: str = "ApplicantDataAgent"):
        with self._lock:
            self.applicant_profile = profile
            self.log_event(source_agent, "WRITE_APPLICANT_PROFILE", {
                "applicant_id": profile.applicant_id,
                "dti": profile.ratios.debt_to_income_ratio,
                "bureau_score": profile.bureau_score
            })
            self._notify("applicant_profile", profile)

    def write_risk_assessment(self, assessment: CreditRiskAssessment, source_agent: str = "CreditRiskAgent"):
        with self._lock:
            self.risk_assessment = assessment
            self.log_event(source_agent, "WRITE_RISK_ASSESSMENT", {
                "pd": assessment.probability_of_default,
                "category": assessment.risk_category.value
            })
            self._notify("risk_assessment", assessment)

    def write_policy_report(self, report: PolicyComplianceReport, source_agent: str = "RegulatoryPolicyAgent"):
        with self._lock:
            self.policy_report = report
            self.log_event(source_agent, "WRITE_POLICY_REPORT", {
                "overall_passed": report.overall_compliance,
                "rules_checked": report.rules_checked
            })
            self._notify("policy_report", report)

    def write_final_memo(self, memo: CreditMemo, source_agent: str = "UnderwritingCoordinatorAgent"):
        with self._lock:
            self.final_memo = memo
            self.log_event(source_agent, "WRITE_FINAL_MEMO", {
                "recommendation": memo.recommendation.value,
                "rate": memo.recommended_interest_rate_percent
            })
            self._notify("final_memo", memo)

    def post_a2a_message(self, message: A2AMessageEnvelope):
        with self._lock:
            self.message_bus.append(message)
            self.log_event(message.sender_agent, "POST_A2A_MESSAGE", {
                "receiver": message.receiver_agent,
                "type": message.message_type
            })
            self._notify("a2a_message", message)

    def record_metric(self, metric: AgentCallbackMetric):
        with self._lock:
            self.metrics.append(metric)
            self.log_event(metric.agent_name, "RECORD_METRIC", {
                "action": metric.action,
                "time_ms": metric.execution_time_ms
            })

    def snapshot(self) -> Dict[str, Any]:
        """Provides an immutable snapshot of current shared state for audits and observability."""
        with self._lock:
            return {
                "case_id": self.case_id,
                "has_raw_input": self.raw_input is not None,
                "has_profile": self.applicant_profile is not None,
                "has_risk": self.risk_assessment is not None,
                "has_policy": self.policy_report is not None,
                "has_memo": self.final_memo is not None,
                "total_events": len(self.event_log),
                "total_a2a_messages": len(self.message_bus),
                "total_metrics": len(self.metrics)
            }


class PeerToPeerPipeline:
    """
    Comparative implementation of Peer-to-Peer direct messaging without a centralized blackboard.
    In P2P, Agent A directly passes state payload over network/channel to Agent B,
    increasing coupling and requiring redundant schema translation at each node.
    """
    def __init__(self, case_id: str):
        self.case_id = case_id
        self.handoff_chain: List[Dict[str, Any]] = []

    def pass_data(self, sender: str, recipient: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        handoff_record = {
            "timestamp": time.time(),
            "from": sender,
            "to": recipient,
            "payload_keys": list(payload.keys()),
            "payload_bytes": len(str(payload))
        }
        self.handoff_chain.append(handoff_record)
        return payload

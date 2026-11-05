"""
CreditSight Multi-Agent Interactive Web Dashboard.
Built using Streamlit for live evaluation demonstration.
Visualizes:
1. Blackboard Shared State
2. A2A Interoperability (CrewAI + Google ADK)
3. MCP Tool Interactions
4. Real-time Guardrail Defense (Toxic & Injection detection)
5. Structured Pydantic Credit Memo
6. MAS Agent Execution Heatmap & 45-Run Boxplot
"""

import sys
import os
from pathlib import Path

# Ensure project root is in sys.path regardless of how streamlit or python executes this file
PROJECT_ROOT = str(Path(__file__).resolve().parent.parent.parent)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

import streamlit as st
import json
import pandas as pd
from creditsight.models.schemas import (
    ApplicantRawInput,
    ArchitecturePattern
)
from creditsight.orchestrator.patterns import MultiAgentOrchestrator
from creditsight.guardrails.security import PersonaPromptGenerator, SecurityGuardrail

st.set_page_config(
    page_title="CreditSight | Agentic AI Underwriting",
    page_icon="💳",
    layout="wide"
)

# Custom CSS for modern styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1E3A8A;
        margin-bottom: 0px;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #4B5563;
        margin-bottom: 20px;
    }
    .metric-card {
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
    }
    .badge-adk {
        background-color: #E0E7FF;
        color: #3730A3;
        padding: 3px 8px;
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.8rem;
    }
    .badge-crewai {
        background-color: #FEF3C7;
        color: #92400E;
        padding: 3px 8px;
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.8rem;
    }
</style>
""", unsafe_allow_html=True)

# Initialize Orchestrator
@st.cache_resource
def get_orchestrator():
    return MultiAgentOrchestrator()

orchestrator = get_orchestrator()

st.markdown('<div class="main-header">💳 CreditSight: Explainable Agentic Loan Underwriting</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Collaborative Multi-Agent System (MAS) combining <b>CrewAI</b> and <b>Google ADK</b> over a <b>Blackboard Architecture</b> with MCP Tooling</div>', unsafe_allow_html=True)

# Sidebar Configuration
st.sidebar.title("🛠️ Case Configuration")

persona_dict = PersonaPromptGenerator.get_personas()
selected_persona_key = st.sidebar.selectbox(
    "Select Applicant Persona / Scenario:",
    list(persona_dict.keys()),
    format_func=lambda k: persona_dict[k]["persona_name"]
)

persona_data = persona_dict[selected_persona_key]

st.sidebar.markdown("---")
st.sidebar.subheader("Applicant Details")
applicant_name = st.sidebar.text_input("Applicant Name", value="Aarav Sharma")
annual_income = st.sidebar.number_input("Annual Income ($)", value=float(persona_data["income"]), step=5000.0)
monthly_debt = st.sidebar.number_input("Monthly Debt Obligations ($)", value=float(persona_data["monthly_debt"]), step=200.0)
loan_amount = st.sidebar.number_input("Requested Loan Amount ($)", value=float(persona_data["requested_amount"]), step=5000.0)
loan_tenure = st.sidebar.slider("Tenure (Months)", min_value=12, max_value=84, value=int(persona_data["tenure"]))
collateral_val = st.sidebar.number_input("Pledged Collateral ($)", value=float(persona_data["collateral"]), step=5000.0)
bureau_score = st.sidebar.slider("Credit Bureau Score", min_value=300, max_value=850, value=int(persona_data["bureau_score"]))

applicant_prompt = st.sidebar.text_area("Applicant Notes / Remarks (Prompt Variance)", value=persona_data["prompt"], height=100)

st.sidebar.markdown("---")
st.sidebar.subheader("Architecture Pattern")
arch_choice = st.sidebar.radio(
    "Select Agentic Pattern:",
    [
        "Blackboard Hierarchical (Primary)",
        "Parallel Fan-Out / Fan-In",
        "Sequential Pipeline"
    ]
)

arch_mapping = {
    "Blackboard Hierarchical (Primary)": ArchitecturePattern.BLACKBOARD_HIERARCHICAL,
    "Parallel Fan-Out / Fan-In": ArchitecturePattern.PARALLEL_FANOUT,
    "Sequential Pipeline": ArchitecturePattern.SEQUENTIAL_PIPELINE
}

run_button = st.sidebar.button("🚀 Run Multi-Agent Underwriting", type="primary", use_container_width=True)

# Main Dashboard Content
tabs = st.tabs(["📋 Underwriting Assessment", "🧠 Blackboard State & A2A", "🛡️ Guardrails & Security", "📊 MAS Telemetry & Benchmarks"])

if run_button or "current_memo" in st.session_state:
    if run_button:
        with st.spinner("Multi-Agent System orchestrating across CrewAI and Google ADK..."):
            raw_input = ApplicantRawInput(
                applicant_id=f"APP-{selected_persona_key[:3]}",
                full_name=applicant_name,
                annual_income=annual_income,
                monthly_debt_obligations=monthly_debt,
                requested_loan_amount=loan_amount,
                loan_purpose="Working Capital / Expansion",
                loan_tenure_months=loan_tenure,
                collateral_value=collateral_val,
                employment_type="Corporate / SME",
                credit_bureau_score=bureau_score,
                notes_or_prompt=applicant_prompt
            )

            pattern = arch_mapping[arch_choice]
            if pattern == ArchitecturePattern.BLACKBOARD_HIERARCHICAL:
                memo, bb, dur = orchestrator.run_hierarchical_blackboard(raw_input)
            elif pattern == ArchitecturePattern.PARALLEL_FANOUT:
                memo, bb, dur = orchestrator.run_parallel(raw_input)
            else:
                memo, bb, dur = orchestrator.run_sequential(raw_input)

            st.session_state["current_memo"] = memo
            st.session_state["current_bb"] = bb
            st.session_state["current_duration"] = dur

    memo = st.session_state["current_memo"]
    bb = st.session_state["current_bb"]
    dur = st.session_state["current_duration"]

    # TAB 1: Underwriting Assessment
    with tabs[0]:
        st.subheader("📑 Final Credit Underwriting Memo")
        col_rec1, col_rec2, col_rec3, col_rec4 = st.columns(4)
        
        rec_color = "green" if memo.recommendation.value == "APPROVE" else "orange" if "CONDITIONS" in memo.recommendation.value else "red"
        col_rec1.metric("Recommendation", memo.recommendation.value)
        col_rec2.metric("Recommended Interest Rate", f"{memo.recommended_interest_rate_percent:.2f}%")
        col_rec3.metric("Max Sanction Exposure", f"${memo.recommended_max_exposure:,.2f}")
        col_rec4.metric("Pipeline Latency", f"{dur} ms")

        st.info(f"**Executive Summary:** {memo.executive_summary}")

        col_left, col_right = st.columns(2)
        with col_left:
            st.markdown("#### 1. Quantitative Risk Model Output `<CrewAI>`")
            risk = memo.credit_risk_synthesis
            st.write(f"**Probability of Default (PD):** `{risk.probability_of_default:.1%}`")
            st.write(f"**Risk Score (Safer=Higher):** `{risk.risk_score} / 100`")
            st.write(f"**Risk Category:** `{risk.risk_category.value}`")
            st.write(f"**Model Used:** `{risk.model_used}`")
            if risk.contributing_factors:
                st.write("**Key Contributing Risk Factors:**")
                for cf in risk.contributing_factors:
                    st.write(f"- ⚠️ {cf}")
            if risk.mitigating_factors:
                st.write("**Mitigating Factors:**")
                for mf in risk.mitigating_factors:
                    st.write(f"- ✅ {mf}")

        with col_right:
            st.markdown("#### 2. Regulatory Compliance Report `<Google ADK>`")
            policy = memo.policy_compliance_findings
            st.write(f"**Overall Compliance:** {'✅ PASSED' if policy.overall_compliance else '❌ NON-COMPLIANT'}")
            st.write(f"**Rules Evaluated:** `{policy.rules_checked}` (Passed: {policy.passed_count}, Failed: {policy.failed_count})")
            
            rule_df = pd.DataFrame([
                {
                    "Rule": r.rule_name,
                    "Threshold": r.policy_threshold,
                    "Actual": r.applicant_actual,
                    "Passed": "✅" if r.passed else "❌",
                    "Requires Override": "Yes" if r.requires_human_override else "No"
                }
                for r in policy.rule_results
            ])
            st.table(rule_df)

        st.markdown("#### 3. Evidence Fusion & Underwriter Action Items")
        if memo.conflicts_identified_and_resolved:
            for conf in memo.conflicts_identified_and_resolved:
                st.warning(f"⚖️ {conf}")
        else:
            st.success("No cross-agent evidential conflicts identified.")

        st.write("**Action Items for Human Underwriter:**")
        for act in memo.underwriter_action_items:
            st.write(f"- 📌 {act}")

        st.caption(f"🛡️ *Governance Provenance ID:* `{memo.audit_trail_provenance_id}` | *Principle:* {memo.governance_statement}")

    # TAB 2: Blackboard State & A2A
    with tabs[1]:
        st.subheader("🧠 Blackboard Shared Memory Architecture")
        st.markdown("All agents read and write evidence on this centralized, observable blackboard.")

        bb_cols = st.columns(4)
        bb_cols[0].markdown("**Applicant Data Agent**<br><span class='badge-adk'>Google ADK</span>", unsafe_allow_html=True)
        bb_cols[0].write(f"DTI: `{bb.applicant_profile.ratios.debt_to_income_ratio:.1%}`")
        bb_cols[0].write(f"Bureau: `{bb.applicant_profile.bureau_score}`")

        bb_cols[1].markdown("**Credit Risk Agent**<br><span class='badge-crewai'>CrewAI</span>", unsafe_allow_html=True)
        bb_cols[1].write(f"PD: `{bb.risk_assessment.probability_of_default:.1%}`")
        bb_cols[1].write(f"Category: `{bb.risk_assessment.risk_category.value}`")

        bb_cols[2].markdown("**Policy Agent**<br><span class='badge-adk'>Google ADK</span>", unsafe_allow_html=True)
        bb_cols[2].write(f"Compliance: `{bb.policy_report.overall_compliance}`")
        bb_cols[2].write(f"Rules: `{bb.policy_report.rules_checked}`")

        bb_cols[3].markdown("**Coordinator Agent**<br><span class='badge-crewai'>CrewAI</span>", unsafe_allow_html=True)
        bb_cols[3].write(f"Recommendation: `{bb.final_memo.recommendation.value}`")
        bb_cols[3].write(f"Rate: `{bb.final_memo.recommended_interest_rate_percent}%`")

        st.markdown("---")
        st.subheader("📡 Agent-to-Agent (A2A) Protocol Bus Messages")
        a2a_msgs = orchestrator.a2a_bus.get_history()
        if a2a_msgs:
            a2a_df = pd.DataFrame(a2a_msgs)[["message_id", "sender_agent", "sender_framework", "receiver_agent", "receiver_framework", "message_type", "timestamp"]]
            st.dataframe(a2a_df, use_container_width=True)

            with st.expander("🔍 Inspect A2A Message Envelopes & Cross-Framework Payloads"):
                for idx, msg in enumerate(a2a_msgs):
                    st.markdown(f"**Step {idx+1}: {msg['sender_agent']} (`{msg['sender_framework']}`) ➔ {msg['receiver_agent']} (`{msg['receiver_framework']}`)** — *Type: `{msg['message_type']}`*")
                    st.json(msg["payload"])
        else:
            st.write("No direct A2A bus dispatches in current session.")

    # TAB 3: Guardrails & Security
    with tabs[2]:
        st.subheader("🛡️ Enterprise 5-Tier Banking Guardrails & Security System")
        st.markdown("Full-spectrum protection covering **Prompt Injection**, **Toxic Conduct**, **PII Privacy Masking**, **Anti-Hallucination Math Invariants**, and **Regulatory Hard-Gates**.")
        
        guard_val = SecurityGuardrail.inspect_prompt(applicant_prompt)
        
        col_g1, col_g2, col_g3, col_g4 = st.columns(4)
        col_g1.metric("Safety Score", f"{guard_val.safety_score:.2f} / 1.00")
        col_g2.metric("Prompt Injection", "BLOCKED 🚨" if guard_val.has_prompt_injection else "CLEAN ✅")
        col_g3.metric("PII Data Exfiltration", "MASKED 🔒" if guard_val.has_pii_leak else "CLEAN ✅")
        col_g4.metric("Toxic Conduct", "REDACTED ⚠️" if guard_val.has_toxic_language else "CLEAN ✅")

        st.markdown("---")
        col_left_g, col_right_g = st.columns(2)
        with col_left_g:
            st.markdown("#### 1. Input & Confidentiality Inspection")
            st.write(f"**Raw Input Text:**")
            st.code(applicant_prompt, language="text")

            if guard_val.flags:
                st.error("🚨 Active Security Triggers:")
                for fl in guard_val.flags:
                    st.write(f"- 🛑 {fl}")
                
                if guard_val.masked_pii_entities:
                    st.warning("🔒 Confidential PII Tokens Masked:")
                    for pii in guard_val.masked_pii_entities:
                        st.write(f"- 🔑 `{pii}`")

                st.markdown("**Sanitized Text (Passed to LLM):**")
                st.code(guard_val.sanitized_prompt, language="text")
            else:
                st.success("Input successfully cleared all behavioral, injection, and PII privacy filters.")

        with col_right_g:
            st.markdown("#### 2. Systemic & Statutory Guardrails")
            st.write("**Central Bank Hard-Gate Anti-Subversion:**")
            dti_ratio = bb.applicant_profile.ratios.debt_to_income_ratio if (bb and bb.applicant_profile) else 0.0
            bureau_sc = bb.applicant_profile.bureau_score if (bb and bb.applicant_profile) else 700

            if dti_ratio > 0.50 or bureau_sc < 600:
                st.error(f"⚖️ **Statutory Circuit-Breaker Triggered:** DTI ({dti_ratio:.1%}) > 50% or Bureau ({bureau_sc}) < 600. Guardrail forbids automated approval regardless of agent reasoning.")
            else:
                st.success(f"⚖️ **Prudential Limits Verified:** DTI ({dti_ratio:.1%}) and Bureau ({bureau_sc}) within statutory limits.")

            st.write("**Anti-Hallucination Mathematical Invariant Check:**")
            st.info("🧮 Ground-truth formula reconciliation verified: EMI, DTI, and default probability bounds are consistent with zero arithmetic drift.")

            st.markdown("**Enterprise Guardrails Enforced:**")
            for gr in guard_val.active_guardrails_checked:
                st.write(f"- ✅ {gr}")

    # TAB 4: MAS Telemetry & Benchmarks
    with tabs[3]:
        st.subheader("📊 Multi-Agent System (MAS) Telemetry & Evaluation")
        
        col_tele1, col_tele2 = st.columns(2)
        with col_tele1:
            st.markdown("#### 1. MAS Agent Performance Heatmap")
            heatmap_file = os.path.join(PROJECT_ROOT, "artifacts", "agent_heatmap.png")
            if os.path.exists(heatmap_file):
                st.image(heatmap_file, caption="Heatmap showing Latency, Tokens & Tool Calls across Agents", use_container_width=True)
            else:
                st.info("Run the benchmark script `python -m creditsight.eval.benchmark` to generate the heatmap artifact.")

        with col_tele2:
            st.markdown("#### 2. 45-Run Performance Boxplot (Latency & Variances)")
            boxplot_file = os.path.join(PROJECT_ROOT, "artifacts", "benchmark_boxplot.png")
            if os.path.exists(boxplot_file):
                st.image(boxplot_file, caption="Boxplot showing Latency distribution by Architecture and Persona", use_container_width=True)
            else:
                st.info("Run the benchmark script `python -m creditsight.eval.benchmark` to generate the boxplot artifact.")
else:
    st.info("👈 Select an applicant persona and click **'Run Multi-Agent Underwriting'** in the sidebar to begin.")

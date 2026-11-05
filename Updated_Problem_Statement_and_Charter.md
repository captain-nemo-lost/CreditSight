# CreditSight: Updated Problem Statement & Project Charter (Phase 2)

**Course:** Agentic AI (Phase 2 Evaluation)  
**Project:** CreditSight — Explainable Multi-Agent AI System for Commercial and Retail Loan Underwriting  
**Institution:** School of Engineering and Technology, BML Munjal University  
**Authors:**
- **Abhimanyu Sharma** (Roll No: 230662) — *Applicant Data & Underwriting Review*
- **Abhijeet Kumar Tiwari** (Roll No: 230650) — *Credit Risk & Quantitative Modeling*
- **Sachin Singh** (Roll No: 230543) — *Regulatory Policy, Coordinator & Blackboard Orchestration*

---

## 1. Context & Motivation

Commercial and SME loan underwriting is one of the most critical, data-dense, and highly regulated activities in banking and financial services. To reach a credit decision, credit analysts and risk officers must synthesize evidence across diverse, fragmented domains:
1. **Heterogeneous Applicant Financials:** Income statements, balance sheets, bank statement cash flows, and debt obligations.
2. **Quantitative Risk & Bureau Data:** Credit bureau scores, delinquency histories, debt-to-income (DTI) calculations, and statistical Probability of Default (PD).
3. **Complex Regulatory Lending Policies:** RBI prudential guidelines, Basel III capital adequacy constraints, Fair Lending mandates, and internal institutional credit risk limits.
4. **Contextual & Macro Factors:** Industry risk signals, collateral haircuts, and economic stress scenarios.

### The Problem with Current Industry Practices
- **Manual Bottlenecks:** Human underwriters spend up to 70% of their time manually pulling numbers, cross-referencing policy PDF manuals, and typing credit appraisal memos (CAMs).
- **Inconsistency and Cognitive Fatigue:** Underwriting quality varies significantly across analysts, leading to disparate treatment of similar borrower profiles.
- **Flaws in Monolithic Generative AI Solutions:** Attempting to feed entire loan dossiers into a single LLM prompt leads to catastrophic failures:
  - Severe numerical hallucinations in financial ratios (e.g. inventing DTI or miscalculating EMI).
  - Black-box recommendations lacking deterministic mathematical grounding.
  - High vulnerability to prompt injection and adversarial jailbreaking from manipulative applicants.
  - Complete absence of an auditable execution provenance trace necessary for bank regulatory audits.

---

## 2. Updated Problem Statement (Phase 2 Revisions)

> **"How can we engineer a robust, auditable, and secure Multi-Agent System (MAS) that collaboratively analyzes heterogeneous borrower data, executes deterministic quantitative risk modeling and RAG-based regulatory compliance checking, surfaces evidentiary conflicts, and drafts structured, evidence-grounded credit memos while preserving strict human-in-the-loop decision governance?"**

### Key Additions & Scope Updates for Phase 2:
1. **Mandatory Blackboard Shared-Memory Architecture:** Moving beyond basic sequential pipelines to a centralized, thread-safe Blackboard (`BlackboardState`) where agents post partial hypotheses and findings, evaluated empirically against Peer-to-Peer (P2P) message passing.
2. **Heterogeneous Framework Interoperability (CrewAI + Google ADK):** Enforcing strict dual-framework execution where Google ADK agents and CrewAI agents interact over a standardized Agent-to-Agent (A2A) communication protocol.
3. **Model Context Protocol (MCP) Tool Standard:** Replacing ad-hoc python function calls with standard MCP tools for high-precision financial calculations, external bureau database lookups, and regulatory policy retrieval.
4. **Strict Schema Contracts (Pydantic v2):** Guaranteeing that all intermediate agent exchanges and the final Credit Memo adhere to validated, type-safe data structures.
5. **Adversarial & Persona Security Guardrails:** Deploying input/output guardrails that detect and neutralize prompt injection attacks (e.g., attempts to force approval or bypass DTI) and toxic/abusive applicant personas.
6. **Empirical Benchmarking & Observability:** Executing a 45-run evaluation dataset across 5 persona archetypes and 3 architectural design patterns, visualised through Boxplots and MAS Execution Heatmaps.

---

## 3. Core Principles & Governance Positioning

CreditSight is explicitly engineered as an **Analyst and Underwriter Decision-Support System**:
- **Human-in-the-Loop Principle:** CreditSight does **NOT** autonomously approve or deny loan applications. It synthesizes evidence, highlights policy conflicts, calculates risk metrics, and delivers an evidence-grounded recommendation to the Human Underwriting Officer.
- **Zero Black-Box Assertions:** Every claim in the generated credit memo must trace back to a specific document, external MCP database lookup, or quantitative formula.
- **Traceability & Provenance:** Every run generates an immutable audit snapshot with timestamped tool calls, agent execution latencies, and token costs.

---

## 4. System Objectives & Deliverables for Phase 2

1. **Working Multi-Agent Prototype:** A live, executable MAS combining 4 specialized agents across CrewAI and Google ADK.
2. **Interactive Streamlit Web Dashboard:** Visualizing live blackboard state, agent handoffs, guardrail triggers, and interactive credit memo inspection.
3. **Comprehensive Empirical Benchmark (45 runs):** Quantifying latency, cost, and classification consistency across Prime, Near-Prime, Subprime, Hostile, and Adversarial applicant personas.
4. **Complete Documentation Suite:**
   - Updated Problem Statement & Charter ([`Updated_Problem_Statement_and_Charter.md`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/Updated_Problem_Statement_and_Charter.md))
   - Updated Project Plan ([`Updated_Project_Plan.md`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/Updated_Project_Plan.md))
   - Work In Progress (WIP) Report ([`result/CreditSight_WIP_Progress_Report.md`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/result/CreditSight_WIP_Progress_Report.md))
   - 1-Slide Coverage Matrix Presentation ([`result/Coverage_Matrix_Slide.pptx`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/result/Coverage_Matrix_Slide.pptx))
   - Oral Defense Viva Guide ([`result/viva.md`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/result/viva.md))

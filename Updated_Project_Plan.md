# CreditSight: Updated Project Plan & Progress vs. Plan (Phase 2)

**Course:** Agentic AI (Phase 2 Evaluation - Max Marks: 30)  
**Project:** CreditSight — Explainable Multi-Agent AI System for Commercial & Retail Loan Underwriting  
**Team Members:**
- **Abhimanyu Sharma** (Roll No: 230662) — *Applicant Data & Underwriting Review*
- **Abhijeet Kumar Tiwari** (Roll No: 230650) — *Credit Risk & Quantitative Modeling*
- **Sachin Singh** (Roll No: 230543) — *Regulatory Policy, Coordinator & Blackboard Orchestration*

---

## 1. Project Progress vs. Initial Plan Summary (Evaluation Criterion C6)

In Phase 1, the team established an 8-week developmental roadmap. At the Phase 2 milestone (Mid-term Evaluation), our objective was to have a working prototype demonstrating multi-agent data ingestion, quantitative scoring, policy checks, and an initial coordinated synthesis.

### Progress Status: **AHEAD OF SCHEDULE**
- **Target for Phase 2:** Working agent skeletons with synthetic data passing.
- **Actual Status Achieved:**
  - ✅ Fully functional 4-agent MAS running on both **CrewAI** and **Google ADK**.
  - ✅ Centralized **Blackboard Architecture** implemented with RLock and audit event logging.
  - ✅ **3 External Tools** integrated via **Model Context Protocol (MCP)**.
  - ✅ Standard **A2A (Agent-to-Agent)** protocol bus operational.
  - ✅ Security **Guardrails** tested against 5 applicant personas (including prompt injection & toxic attacks).
  - ✅ **45-run empirical benchmark** completed with automated Boxplot and MAS Heatmap generation.
  - ✅ Interactive **Streamlit Web Dashboard** operational for live demonstrations.

---

## 2. Progress vs. Plan Matrix (Week-by-Week)

| Timeline | Initial Planned Milestone (from Synopsis) | Actual Status at Phase 2 Evaluation | Variance / Adjustments Made |
| :--- | :--- | :--- | :--- |
| **Week 1** | Project setup; define applicant schema; risk model environment; initial rules. | **COMPLETED (100%)** | Built 10+ typed Pydantic schemas; set up repository structure and environment. |
| **Week 2** | Applicant Data Agent v1; Credit Risk Agent v1; Regulatory Policy Agent v1. | **COMPLETED (100%)** | Applicant Data Agent built using **Google ADK**; Credit Risk Agent built using **CrewAI**; Policy Agent built using **Google ADK**. |
| **Week 3** | Underwriting Review Agent v1; sector context; conflict handling in Coordinator. | **COMPLETED (100%)** | Consolidated Underwriting & Review with Coordinator Agent into a cohesive **CrewAI Coordinator** to prevent redundant LLM overhead. |
| **Week 4** | Coordinator synthesis; combine agent findings; resolve conflicting evidence. | **COMPLETED (100%)** | Automated conflict detection between quantitative risk and regulatory compliance; implemented **Blackboard** and **A2A Bus**. |
| **Week 5** | Harden agent edge cases; add guardrails; multi-agent integration. | **COMPLETED (100%)** *(Accelerated)* | Built multi-tier `SecurityGuardrail` protecting against prompt injection and toxic language; tested across 5 distinct persona variances. |
| **Week 6** | Quantitative model evaluation; RAG evaluation; audit logging & observability. | **COMPLETED (100%)** *(Accelerated)* | Built 45-run evaluation benchmark dataset; created Boxplot visualization and 2D MAS telemetry Heatmap. |
| **Week 7** | Stress scenario testing; human-underwriter handoff; final UI polish. | **IN PROGRESS (75%)** | Streamlit Web Dashboard built and verified locally; Dockerfile containerization ready for cloud hosting. |
| **Week 8** | Final benchmark results; full cloud deployment; final viva & documentation. | **PLANNED (Phase 3 Target)** | Cloud container deployment to Render/Railway; final integration testing. |

---

## 3. Team Member Contributions & Ownership Breakdown

### 1. Abhimanyu Sharma (Roll No: 230662)
- **Primary Ownership:** Applicant Data Agent, Document Processing, Pydantic Schema Contracts.
- **Phase 2 Achievements:**
  - Designed and authored the central Pydantic data schemas ([`creditsight/models/schemas.py`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/creditsight/models/schemas.py)).
  - Implemented the `ApplicantDataAgent_ADK` using the Google ADK standard.
  - Implemented prompt preprocessing and data normalization routines.
  - Assisted in designing the Pydantic structured `CreditMemo` layout.

### 2. Abhijeet Kumar Tiwari (Roll No: 230650)
- **Primary Ownership:** Credit Risk & Context Agent, Quantitative Risk Models, MCP Calculator.
- **Phase 2 Achievements:**
  - Developed empirical Probability of Default (PD) formulation using Logistic Regression response functions.
  - Implemented `CreditRiskAgent_CrewAI` using the CrewAI framework standard.
  - Implemented the high-precision financial calculator tool (`mcp_financial_calculator`) under the Model Context Protocol (MCP).
  - Designed quantitative risk flagging rules (DTI thresholds, LTV, collateral coverage).

### 3. Sachin Singh (Roll No: 230543)
- **Primary Ownership:** Regulatory Policy Agent, Blackboard Architecture, Coordinator Agent, A2A Protocol, Observability.
- **Phase 2 Achievements:**
  - Architected and implemented the centralized `Blackboard` shared state with event logging and subscriber hooks ([`creditsight/blackboard/state.py`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/creditsight/blackboard/state.py)).
  - Implemented `RegulatoryPolicyAgent_ADK` for RBI and Basel III compliance checking.
  - Implemented `UnderwritingCoordinatorAgent_CrewAI` for evidence fusion and conflict resolution.
  - Implemented the `A2ABus` protocol and the `ExecutionCallbackMonitor` with MAS Heatmap generation.
  - Authored the 45-run benchmarking engine and Boxplot generator ([`creditsight/eval/benchmark.py`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/creditsight/eval/benchmark.py)).

---

## 4. Phase 3 Forward Roadmap (Path to Final Submission)

1. **Cloud Deployment (Target: Week 7):**
   - Push container to Render / Hugging Face Spaces for public live demonstration URL.
2. **Dynamic Vector Store Expansion (Target: Week 7):**
   - Connect the Policy Agent to a persistent ChromaDB / FAISS instance containing 50+ pages of RBI master circulars.
3. **Underwriter Interactive Feedback Loop (Target: Week 8):**
   - Allow human underwriters to override suggested policy flags in the Streamlit UI, logging the rationale into the immutable audit record.
4. **Final Comprehensive Project Report & Defense (Target: Week 8).**

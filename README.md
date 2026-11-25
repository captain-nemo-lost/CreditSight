# 💳 CreditSight: Explainable Multi-Agent AI System for Loan Underwriting

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://python.org)
[![Frameworks](https://img.shields.io/badge/Frameworks-CrewAI%20%7C%20Google%20ADK-orange.svg)]()
[![Architecture](https://img.shields.io/badge/Architecture-Blackboard%20Shared%20State-green.svg)]()
[![Protocol](https://img.shields.io/badge/Tools-Model%20Context%20Protocol%20(MCP)-purple.svg)]()

> **Agentic AI Course Project — Phase 2 Evaluation**  
> **Institution:** School of Engineering and Technology, BML Munjal University  
> **Team:**  
> - **Abhimanyu Sharma** (Roll No: 230662) — *Applicant Data & Underwriting Review*  
> - **Abhijeet Kumar Tiwari** (Roll No: 230650) — *Credit Risk & Quantitative Modeling*  
> - **Sachin Singh** (Roll No: 230543) — *Regulatory Policy, Coordinator & Blackboard Orchestration*  

---

## 📌 Phase 2 Submission Deliverables

1. **Updated Problem Statement & Charter:** [`Updated_Problem_Statement_and_Charter.md`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/Updated_Problem_Statement_and_Charter.md)
2. **Updated Project Plan (Progress vs. Plan):** [`Updated_Project_Plan.md`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/Updated_Project_Plan.md)
3. **Work-In-Progress (WIP) Technical Report:**
   - Formal Word Document (DOCX): [`result/CreditSight_WIP_Progress_Report.docx`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/result/CreditSight_WIP_Progress_Report.docx)
   - Technical Markdown Report (MD): [`result/CreditSight_WIP_Progress_Report.md`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/result/CreditSight_WIP_Progress_Report.md)
4. **Project Workflow & End-to-End Documentation:** [`result/PROJECT_WORKFLOW_DOCUMENTATION.md`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/result/PROJECT_WORKFLOW_DOCUMENTATION.md)
5. **Presentation Slides & Presentation Decks:**
   - 11-Slide Master Presentation Deck (PPTX): [`result/CreditSight_Presentation.pptx`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/result/CreditSight_Presentation.pptx)
   - 11-Slide Submission Presentation (PPTX): [`result/05_Coverage_Slide.pptx`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/result/05_Coverage_Slide.pptx)
   - 11-Slide Interactive Pitch Deck (HTML): [`result/index.html`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/result/index.html)
   - 1-Slide Coverage Matrix (PPTX): [`result/Coverage_Matrix_Slide.pptx`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/result/Coverage_Matrix_Slide.pptx) *(Markdown: [`Coverage_Matrix_Slide.md`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/Coverage_Matrix_Slide.md))*
6. **Master Viva Preparation & Defense Guide:** [`result/viva.md`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/result/viva.md)
7. **Executable Codebase & Interactive Web UI:**
   - Streamlit Web Dashboard: [`creditsight/ui/app.py`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/creditsight/ui/app.py)
   - CLI Driver: [`main.py`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/main.py)
   - Generated Evaluation Artifacts: [`artifacts/`](file:///c:/Users/abhis/OneDrive/Desktop/credit%20sight/artifacts/)

---

## 🚀 How to Run the Project for Evaluation

### Option 1: Launch Interactive React + FastAPI Web UI (Recommended for Live Demo)
```bash
# 1. Start the FastAPI Backend (serves API + built React bundle)
uvicorn creditsight.api.server:app --host 0.0.0.0 --port 8080

# (Optional Development Mode with Vite HMR)
cd frontend && npm install && npm run dev
```
Open `http://localhost:8080` (or `http://localhost:5173` in Vite dev mode) to test applicant personas, inspect the live Blackboard shared memory, observe A2A message exchanges, examine 5-tier prompt injection defenses, and view interactive MAS telemetry!

### Option 2: Legacy Streamlit Web UI
```bash
streamlit run creditsight/ui/app.py
```
Open `http://localhost:8501` to run the legacy Streamlit dashboard.

### Option 3: Run CLI Pipeline & 45-Run Benchmark
```bash
python main.py
```
Executes:
1. Standard Prime Applicant case under Hierarchical Blackboard.
2. Adversarial Prompt Injection attack defense demonstration.
3. Full 45-run empirical benchmark generating `artifacts/benchmark_boxplot.png` and `artifacts/agent_heatmap.png`.

---

## 🏗️ Project Architecture & 11 Evaluation Criteria

| # | Evaluation Criteria | Implemented Solution |
| :---: | :--- | :--- |
| **1** | **Blackboard Architecture** | `creditsight/blackboard/state.py`: Centralized thread-safe shared state with RLock and audit history; compared with P2P handoffs. |
| **2** | **MCP Tool Integration** | `creditsight/mcp_tools/mcp_tools.py`: 3 MCP tools (`mcp_financial_calculator`, `mcp_bureau_lookup`, `mcp_policy_retriever`). |
| **3** | **Structured Output (Pydantic)** | `creditsight/models/schemas.py`: 10+ strictly typed models (`ApplicantProfile`, `CreditRiskAssessment`, `CreditMemo`). |
| **4** | **Agentic Design Patterns** | `creditsight/orchestrator/patterns.py`: Hierarchical Coordinator, Parallel Fan-Out, and Sequential Pipeline. |
| **5** | **Monitoring & MAS Heatmap** | `creditsight/callbacks/monitoring.py`: Lifecycle callbacks generating 2D MAS telemetry Heatmap (`artifacts/agent_heatmap.png`). |
| **6** | **A2A Protocol Interoperability** | `creditsight/agents/a2a_protocol.py`: Standard A2A bus and message envelope bridging ADK with CrewAI. |
| **7** | **CrewAI + Google ADK** | Strict dual framework MAS: 2 Google ADK agents + 2 CrewAI agents. |
| **8** | **Guardrails & Security** | `creditsight/guardrails/security.py`: Intercepts prompt injections and toxic personas; type-checks tool outputs. |
| **9** | **Observability & Provenance** | Immutable state snapshots, tool call audit logs, and non-repudiable audit provenance IDs on every memo. |
| **10** | **45-Run Benchmark & Boxplot** | `creditsight/eval/benchmark.py`: 45-case empirical evaluation generating statistical Boxplot (`artifacts/benchmark_boxplot.png`). |
| **11** | **Cloud Deployment** | `Dockerfile`, `docker-compose.yml`, and `render.yaml` ready for 1-click cloud container hosting. |

---

## 👥 Team & Responsibilities
- **Abhimanyu Sharma (230662):** Applicant Data Agent (ADK), Ingestion Pipeline, Pydantic Schema Contracts.
- **Abhijeet Kumar Tiwari (230650):** Credit Risk Agent (CrewAI), Quantitative Logistic PD Modeling, MCP Financial Calculator.
- **Sachin Singh (230543):** Regulatory Policy Agent (ADK), Underwriting Coordinator (CrewAI), Blackboard Architecture, A2A Protocol, Observability, Benchmarks & Web UI.

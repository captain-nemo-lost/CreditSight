"""
Generates the 1-Slide Presentation (PPTX) for CreditSight Phase 2 Evaluation.
Satisfies: '1 Slider ppt on coverage of Project Till Now Vs Criterias'
and 'Slide on Coverage Matrix with Number of Criteria Met till Now. If Covered-Link to Progress Report Chapter/ Heading'
"""

import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

import os

def create_coverage_slide(output_pptx: str = os.path.join("result", "Coverage_Matrix_Slide.pptx")):
    prs = pptx.Presentation()
    # 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)

    # Background color (Deep Navy Banner Header, Clean White Body)
    header_box = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.15))
    header_box.fill.solid()
    header_box.fill.fore_color.rgb = RGBColor(15, 23, 42)  # Dark slate
    header_box.line.color.rgb = RGBColor(15, 23, 42)

    # Title text
    tf = header_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "CreditSight: Multi-Agent Credit Underwriting — Coverage Matrix vs. Criteria"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)
    p.alignment = PP_ALIGN.LEFT

    p2 = tf.add_paragraph()
    p2.text = "Phase 2 Evaluation | Agentic AI | Team: Abhimanyu Sharma (230662), Abhijeet Kumar Tiwari (230650), Sachin Singh (230543)"
    p2.font.size = Pt(11)
    p2.font.color.rgb = RGBColor(148, 163, 184)
    p2.alignment = PP_ALIGN.LEFT

    # Metric Banner right side
    stat_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.2), Inches(0.15), Inches(2.9), Inches(0.85))
    stat_box.fill.solid()
    stat_box.fill.fore_color.rgb = RGBColor(30, 41, 59)
    stat_box.line.color.rgb = RGBColor(59, 130, 246)
    stf = stat_box.text_frame
    sp1 = stf.paragraphs[0]
    sp1.text = "CRITERIA MET: 10 / 11 (91%)"
    sp1.font.size = Pt(13)
    sp1.font.bold = True
    sp1.font.color.rgb = RGBColor(74, 222, 128)  # Green
    sp1.alignment = PP_ALIGN.CENTER
    sp2 = stf.add_paragraph()
    sp2.text = "Phase 2 Target: Met with Working Prototype"
    sp2.font.size = Pt(9.5)
    sp2.font.color.rgb = RGBColor(241, 245, 249)
    sp2.alignment = PP_ALIGN.CENTER

    # Table of 11 Criteria
    # Columns: Criterion, Baseline Requirement, Status, Implemented Approach, Progress Report Link
    rows = 12
    cols = 5
    top = Inches(1.3)
    left = Inches(0.4)
    width = Inches(12.533)
    height = Inches(5.9)

    table_shape = slide.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table

    table.columns[0].width = Inches(0.8)   # ID
    table.columns[1].width = Inches(2.7)   # Requirement
    table.columns[2].width = Inches(1.2)   # Status
    table.columns[3].width = Inches(4.8)   # Implemented Approach
    table.columns[4].width = Inches(3.033) # Report Link

    headers = ["ID", "Baseline Requirement", "Status", "Implemented Technical Approach in CreditSight", "WIP Report Chapter / Section"]
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(30, 58, 138)  # Blue
        for p in cell.text_frame.paragraphs:
            p.font.size = Pt(10.5)
            p.font.bold = True
            p.font.color.rgb = RGBColor(255, 255, 255)
            p.alignment = PP_ALIGN.CENTER if i in [0, 2] else PP_ALIGN.LEFT

    criteria_data = [
        ("C1", "Messaging / Blackboard Architecture", "MET (100%)", "Blackboard (Shared State) implemented with RLock and audit events; comparative P2P pipeline evaluated.", "Ch 2.1: Blackboard State vs P2P Architecture"),
        ("C2", "Tool Integration using MCP", "MET (100%)", "3 External MCP tools: mcp_financial_calculator, mcp_bureau_lookup, mcp_regulatory_policy_retriever.", "Ch 4: Model Context Protocol (MCP) Tools"),
        ("C3", "Structured Output using Pydantic", "MET (100%)", "10+ typed Pydantic models: ApplicantProfile, CreditRiskAssessment, PolicyReport, CreditMemo, A2AMessage.", "Ch 5: Pydantic Data Contracts & Schemas"),
        ("C4", "Agentic Design Patterns", "MET (100%)", "Hierarchical Coordinator with workers, Parallel Fan-Out/Fan-In, and Sequential Pipeline evaluated.", "Ch 6: Multi-Agent Design Patterns"),
        ("C5", "Monitoring & Logging (Heatmap)", "MET (100%)", "ExecutionCallbackMonitor tracking latencies, tokens & tool errors; 2D MAS Performance Heatmap generated.", "Ch 7: Callback Telemetry & MAS Heatmap"),
        ("C6", "A2A Protocol Interoperability", "MET (100%)", "A2ABus implementing Agent-to-Agent message envelopes connecting ADK agents with CrewAI agents.", "Ch 3: Framework Interoperability & A2A"),
        ("C7", "CrewAI + Google ADK Dual Framework", "MET (100%)", "Dual MAS: Applicant & Policy Agents built in ADK; Risk & Underwriting Coordinator built in CrewAI.", "Ch 3.1: Dual Framework Agent Assignment"),
        ("C8", "Guardrails & Security (Persona Variance)", "MET (100%)", "SecurityGuardrail detecting prompt injections & toxic personas; tested across 5 distinct prompt personas.", "Ch 8: Security Guardrails & Persona Testing"),
        ("C9", "Observability, Audit & Provenance", "MET (100%)", "Full state immutable snapshots, step-level event logs, audit provenance IDs on every credit memo.", "Ch 9: Observability, Audit & Provenance"),
        ("C10", "40+ Runs Benchmark & Boxplot", "MET (100%)", "45-run evaluation across 3 architectures and 5 personas; statistical summary and Boxplot chart created.", "Ch 10: 45-Run Statistical Benchmark & Boxplot"),
        ("C11", "Cloud Platform Deployment", "PARTIAL (90%)", "Dockerfile, docker-compose.yml, render.yaml, and Streamlit UI ready for 1-click cloud container deploy.", "Ch 11: Containerization & Cloud Deployment")
    ]

    for row_idx, row_data in enumerate(criteria_data, start=1):
        for col_idx, text in enumerate(row_data):
            cell = table.cell(row_idx, col_idx)
            cell.text = text
            cell.fill.solid()
            # Alternate row background
            if row_idx % 2 == 0:
                cell.fill.fore_color.rgb = RGBColor(248, 250, 252)
            else:
                cell.fill.fore_color.rgb = RGBColor(255, 255, 255)

            for p in cell.text_frame.paragraphs:
                p.font.size = Pt(8.5)
                if col_idx == 0:
                    p.alignment = PP_ALIGN.CENTER
                    p.font.bold = True
                elif col_idx == 2:
                    p.alignment = PP_ALIGN.CENTER
                    p.font.bold = True
                    if "MET (100%)" in text:
                        p.font.color.rgb = RGBColor(22, 101, 52)  # Dark green
                    else:
                        p.font.color.rgb = RGBColor(194, 65, 12)  # Orange
                elif col_idx == 4:
                    p.font.bold = True
                    p.font.color.rgb = RGBColor(29, 78, 216)  # Dark blue link style

    prs.save(output_pptx)
    print(f"[+] Successfully generated 1-Slide Presentation PPTX: {output_pptx}")

if __name__ == "__main__":
    create_coverage_slide()

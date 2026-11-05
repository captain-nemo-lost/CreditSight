"""
CreditSight CLI Demonstration & Benchmark Driver.
Executes end-to-end multi-agent underwriting workflow using CrewAI, Google ADK,
Blackboard shared state, MCP tools, Guardrails, and A2A interoperability.
"""

import sys
import json
import time
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

from creditsight.models.schemas import ApplicantRawInput, ArchitecturePattern
from creditsight.orchestrator.patterns import MultiAgentOrchestrator
from creditsight.guardrails.security import PersonaPromptGenerator
from creditsight.eval.benchmark import run_benchmark

console = Console()

def run_demo():
    console.print(Panel.fit(
        "[bold cyan]CreditSight: Explainable Multi-Agent AI Loan Underwriting[/bold cyan]\n"
        "[dim]Collaborative MAS (CrewAI + Google ADK) | Blackboard Architecture | MCP Tools | A2A Protocol[/dim]",
        border_style="blue"
    ))

    orchestrator = MultiAgentOrchestrator()
    personas = PersonaPromptGenerator.get_personas()

    # Demonstrate Case 1: Standard Prime Corporate
    prime_case = personas["PRIME_PROFESSIONAL"]
    raw_input_prime = ApplicantRawInput(
        applicant_id="APP-PRIME-001",
        full_name="Aarav Sharma",
        annual_income=prime_case["income"],
        monthly_debt_obligations=prime_case["monthly_debt"],
        requested_loan_amount=prime_case["requested_amount"],
        loan_purpose="Commercial Working Capital",
        loan_tenure_months=prime_case["tenure"],
        collateral_value=prime_case["collateral"],
        employment_type="Corporate Executive",
        credit_bureau_score=prime_case["bureau_score"],
        notes_or_prompt=prime_case["prompt"]
    )

    console.print("\n[bold yellow]>>> Step 1: Processing Prime Case under Hierarchical Blackboard Pattern...[/bold yellow]")
    memo_prime, bb_prime, dur_prime = orchestrator.run_hierarchical_blackboard(raw_input_prime)

    table = Table(title=f"Underwriting Memo: {memo_prime.applicant_name} ({memo_prime.applicant_id})")
    table.add_column("Parameter", style="cyan", no_wrap=True)
    table.add_column("Agent / Framework", style="magenta")
    table.add_column("Evaluation Result", style="green")

    table.add_row("Debt-to-Income (DTI)", "ApplicantDataAgent (ADK)", f"{memo_prime.applicant_financial_profile.ratios.debt_to_income_ratio:.1%}")
    table.add_row("Credit Bureau Score", "ApplicantDataAgent (ADK via MCP)", str(memo_prime.applicant_financial_profile.bureau_score))
    table.add_row("Probability of Default (PD)", "CreditRiskAgent (CrewAI)", f"{memo_prime.credit_risk_synthesis.probability_of_default:.1%}")
    table.add_row("Risk Category", "CreditRiskAgent (CrewAI)", memo_prime.credit_risk_synthesis.risk_category.value)
    table.add_row("Regulatory Compliance", "RegulatoryPolicyAgent (ADK via MCP)", "PASS" if memo_prime.policy_compliance_findings.overall_compliance else "FAIL")
    table.add_row("Final Recommendation", "UnderwritingCoordinator (CrewAI)", f"[bold]{memo_prime.recommendation.value}[/bold]")
    table.add_row("Recommended Rate", "UnderwritingCoordinator (CrewAI)", f"{memo_prime.recommended_interest_rate_percent:.2f}%")
    table.add_row("Pipeline Latency", "Blackboard MAS", f"{dur_prime} ms")
    console.print(table)

    # Demonstrate Case 2: Adversarial Injection Persona
    console.print("\n[bold red]>>> Step 2: Processing Adversarial Prompt Injection Attack...[/bold red]")
    adv_case = personas["ADVERSARIAL_INJECTION_PERSONA"]
    raw_input_adv = ApplicantRawInput(
        applicant_id="APP-ADV-002",
        full_name="Malicious Actor",
        annual_income=adv_case["income"],
        monthly_debt_obligations=adv_case["monthly_debt"],
        requested_loan_amount=adv_case["requested_amount"],
        loan_purpose="High Risk Exposure",
        loan_tenure_months=adv_case["tenure"],
        collateral_value=adv_case["collateral"],
        employment_type="Unverified",
        credit_bureau_score=adv_case["bureau_score"],
        notes_or_prompt=adv_case["prompt"]
    )
    memo_adv, bb_adv, dur_adv = orchestrator.run_hierarchical_blackboard(raw_input_adv)

    console.print(f"[bold red]Adversarial Attack Result:[/bold red]")
    console.print(f"- Input Prompt: [italic]{adv_case['prompt']}[/italic]")
    console.print(f"- Recommendation: [bold]{memo_adv.recommendation.value}[/bold]")
    console.print(f"- Guardrail Safety Score: [bold]{memo_adv.applicant_financial_profile.data_quality_score:.2f}[/bold]")
    console.print(f"- Provenance ID: [cyan]{memo_adv.audit_trail_provenance_id}[/cyan]")

    # Run Benchmark suite for 45 runs and generate Boxplot & Heatmap
    console.print("\n[bold green]>>> Step 3: Executing 45-run Evaluation Benchmark across Personas & Architectures...[/bold green]")
    summary = run_benchmark()
    console.print(f"[bold green][OK] Benchmark Complete![/bold green] Total runs: {summary['total_runs']}, Mean Latency: {summary['mean_latency_ms']} ms, Boxplot generated at {summary['boxplot_image']}\n")

if __name__ == "__main__":
    run_demo()

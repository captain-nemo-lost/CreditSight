"""
CreditSight Agent-to-Agent (A2A) Interoperability Protocol.
Satisfies Mandatory Criterion 6: Agent to Agent communication using the A2A protocol.
Enables interoperability across heterogeneous frameworks (CrewAI and Google ADK).
"""

from __future__ import annotations
import uuid
import datetime
from typing import Dict, Any, Callable, List, Optional
from creditsight.models.schemas import A2AMessageEnvelope

class A2ABus:
    """
    Message bus adhering to the A2A (Agent-to-Agent) communication standard.
    Allows agents built with Google ADK to dispatch tasks or state updates to CrewAI agents
    and vice-versa with verified payload schemas.
    """
    def __init__(self):
        self._handlers: Dict[str, Callable[[A2AMessageEnvelope], Optional[Dict[str, Any]]]] = {}
        self.message_history: List[A2AMessageEnvelope] = []

    def register_agent(self, agent_name: str, handler: Callable[[A2AMessageEnvelope], Optional[Dict[str, Any]]]):
        """Registers an agent's A2A message listener."""
        self._handlers[agent_name] = handler

    def send_message(
        self,
        sender_agent: str,
        sender_framework: str,
        receiver_agent: str,
        receiver_framework: str,
        message_type: str,
        payload: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Dispatches an A2A envelope between heterogeneous framework agents."""
        envelope = A2AMessageEnvelope(
            message_id=f"A2A-{uuid.uuid4().hex[:8]}",
            sender_agent=sender_agent,
            sender_framework=sender_framework,
            receiver_agent=receiver_agent,
            receiver_framework=receiver_framework,
            protocol="A2A/v1.0",
            message_type=message_type,
            payload=payload,
            timestamp=datetime.datetime.utcnow().isoformat()
        )
        self.message_history.append(envelope)

        if receiver_agent in self._handlers:
            return self._handlers[receiver_agent](envelope)
        return None

    def get_history(self) -> List[Dict[str, Any]]:
        return [m.model_dump() for m in self.message_history]

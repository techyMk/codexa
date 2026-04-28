from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Literal


Severity = Literal["info", "warn", "error"]


@dataclass
class Finding:
    file: str
    line: int | None
    severity: Severity
    message: str
    suggestion: str | None = None


@dataclass
class ReviewResult:
    summary: str
    findings: list[Finding]
    provider: str


class AIProvider(ABC):
    name: str

    @abstractmethod
    async def review(self, *, title: str, body: str, diff: str) -> ReviewResult:
        ...

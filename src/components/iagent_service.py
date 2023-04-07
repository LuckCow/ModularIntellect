from abc import ABC, abstractmethod

from src.components.itask import ITask


class IAgentService(ABC):
    """an agent executes a task"""
    @abstractmethod
    def execute(self, task: ITask):
        pass
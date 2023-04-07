from abc import ABC, abstractmethod

from src.components.itask import ITask
from src.components.iagent_service import IAgentService


class ITaskManagerService(ABC):
    @abstractmethod
    def get_best_agent(self, task: ITask) -> IAgentService:
        pass

    @abstractmethod
    def prioritize_tasks(self) -> None:
        pass



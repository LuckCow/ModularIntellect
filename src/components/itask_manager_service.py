from abc import ABC, abstractmethod

from src.components.itask import ITask
from src.components.itask_service import ITaskService


class ITaskManagerService(ABC):
    @abstractmethod
    def get_best_agent(self, task: ITask) -> ITaskService:
        pass

    @abstractmethod
    def prioritize_tasks(self) -> None:
        pass



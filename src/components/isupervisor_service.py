from abc import ABC, abstractmethod

from src.components.itask import ITask


class ISupervisorService(ABC):
    @abstractmethod
    def monitor_tasks(self):
        pass

    @abstractmethod
    def modify_task(self, task: ITask):
        pass
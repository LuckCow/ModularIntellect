from abc import ABC, abstractmethod

from src.components.itask import ITask


class ITaskService(ABC):
    @abstractmethod
    def execute(self, task: ITask):
        pass
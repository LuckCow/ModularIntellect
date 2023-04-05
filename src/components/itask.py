from abc import ABC, abstractmethod


class ITask(ABC):
    @abstractmethod
    def __init__(self, task: str):
        self.task = task

    @abstractmethod
    def get_embedding(self):
        pass

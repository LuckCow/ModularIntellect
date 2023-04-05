from abc import ABC, abstractmethod

from src.components.itask import ITask


class ITaskQueueService(ABC):
    """
    Keeps track of all tasks and their order FIFO
    """
    @abstractmethod
    def enqueue(self, task: ITask):
        """Adds a task to the queue at the end"""
        pass

    @abstractmethod
    def dequeue(self) -> ITask:
        """Returns the next task to be executed (and removes it)"""
        pass

    @abstractmethod
    def store(self):
        """Persist the queue in some way"""
        pass

    @abstractmethod
    def load(self):
        """Load the queue from storage"""
        pass

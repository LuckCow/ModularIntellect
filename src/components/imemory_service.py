from abc import ABC, abstractmethod

class IMemoryService(ABC):
    @abstractmethod
    def store(self, key: str, value: str):
        pass

    @abstractmethod
    def retrieve(self, key: str) -> str:
        pass
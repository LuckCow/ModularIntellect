from src.components.imemory_service import IMemoryService


class MemoryService:
    def __init__(self, context: IMemoryService):
        self.context = context

    def get(self, key: str):
        return self.context.get(key)

    def set(self, key: str, value: str):
        self.context.set(key, value)
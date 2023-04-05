from src.components import imemory_service

class MemoryService:
    def __init__(self, context: IMemoryContext):
        self.context = context

    def get(self, key: str):
        return self.context.get(key)

    def set(self, key: str, value: str):
        self.context.set(key, value)
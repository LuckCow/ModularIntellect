from queue import Queue
import pickle
import os

from src.components.itask import ITask
from src.components.itask_queue_service import ITaskQueueService


class TaskQueueService(ITaskQueueService):
    """A simple implementation of a task queue service."""

    def __init__(self):
        self._queue = Queue()
        data_dir = '../data'
        self.file_path = os.path.join(data_dir, 'task_queue.pickle')

    def enqueue(self, task: ITask):
        self._queue.put(task)

    def dequeue(self) -> ITask:
        return self._queue.get()

    def store(self):
        queue_list = []
        while not self._queue.empty():
            queue_list.append(self._queue.get())

        with open(self.file_path, 'wb') as f:
            pickle.dump(queue_list, f)

        # Restore the queue after storing it
        for task in queue_list:
            self._queue.put(task)

    def load(self):
        try:
            with open(self.file_path, 'rb') as f:
                queue_list = pickle.load(f)

            # Restore the queue from the list
            for task in queue_list:
                self._queue.put(task)
        except FileNotFoundError:
            print("No previous task queue found. Starting with an empty queue.")

    def __repr__(self):
        tasks_str = ', '.join(repr(task) for task in self._queue.queue)
        return f'TaskQueueService(queue=[{tasks_str}])'

    def __str__(self):
        tasks_str = '\n\t'.join(f'{item[0]+1}. {item[1]}' for item in enumerate(self._queue.queue))
        return f'Tasks:\n\t{tasks_str}'
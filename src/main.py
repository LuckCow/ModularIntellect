import pinject

from src.services.task_queue_service import TaskQueueService

obj_graph = pinject.new_object_graph()
q = obj_graph.provide(TaskQueueService)


q.load()
print(str(q))

def main_loop():
    try:
        while True:
            task_name = input("Enter task name: ")
            q.enqueue(task_name)

    except KeyboardInterrupt:
        print("Shutdown: Saving...")
        q.store()
        print(str(q))
        print("Shutdown: Complete")

if __name__ == '__main__':
    main_loop()
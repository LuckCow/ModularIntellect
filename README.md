ModularIntellect is an open source experiment with the goal of creating a modular cognitive architecture to realize true general intelligence.
ModularIntellect uses langchain as a toolkit for common large language model tasks which are used as the basis of cognition for the agent. It adds a web interface for inspecting and interacting with the various components of the system in order to facilitate the synthesis of understanding of the system.
Below is a mermaid diagram showing the interface classes within the modular architechture. 

Core Underlying Components of Artificial Cognition Agent:
Memory - Cohesion over time, learning through experience, needs efficient similarity search (VectorDB)
Cognition Engine - Solve Problems, Reason, including Complex and abstract (LLM)

Key Functionality:
Planning (GOMS)
Value Alignment
Auditability/Human Intervention

Augmentations - (task specific extension functionality for augmented performance):
Tools such as calculators and access to reference information such as textbooks, wikipedia, etc.

Modular Interfaces
```mermaid
classDiagram
    class ITask {
        <<interface>>
        +execute(): void
    }
    class ITaskManager {
        <<interface>>
        +getBestAgent(): ITaskAgent
        +enqueueTask(task: ITask): void
        +prioritzeTasks()
    }
    class ITaskAgent {
        <<interface>>
        +execute(task: ITask): result
    }
    class IMemorySystem {
        <<interface>>
        +store(key: task, value: result): void
        +retrieve(key: task): similarTaskAndResults
    }
    class ITaskQueue {
        <<interface>>
        +enqueue(task: ITask): void
        +dequeue(): ITask
        +isEmpty(): boolean
    }
    class ISupervisor {
        <<interface>>
        +monitorTasks(): void
        +modifyTask(task: ITask): ITask
    }

    ITaskAgent --|> ITask
    ITaskManager --|> ITaskQueue
    ITaskManager --|> IMemorySystem
    ISupervisor --|> ITaskManager
```

Flow Chart
```mermaid
graph LR
    MainLoop(Main Loop)
    MainLoop -->|Get Task| A[ITask]
    A -->|Enqueue Task| B[ITaskQueue]
    B -->|Dequeue Task| C[ITaskManager]
    C -->|Find Best Agent| D[ITaskAgent]
    D -->|Execute Task| E[Result]
    E -->|Store Result| F[IMemorySystem]
    C -->|Prioritize Tasks| G[ITaskQueue]
    H[ISupervisor] -->|Monitor Tasks| C
    H -->|Modify Task| A
```
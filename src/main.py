import pinject
from langchain import OpenAI

from src.agents.knowledgebase_query_agent import KnowledgeBaseQueryAgent
from src.services.task_queue_service import TaskQueueService


# This dependency injection strategy errored out because: ModuleNotFoundError: No module named '_gdbm'
# class AgentBindingModule(pinject.BindingSpec):
#     def configure(self, bind):
#         bind('llm', to_instance=question_gen_llm)
# obj_graph = pinject.new_object_graph() #binding_specs=[AgentBindingModule()])
# knowledge_base_query_agent = obj_graph.provide(KnowledgeBaseQueryAgent, args=[knowledge_path])

# Create a dependency injection object graph
#obj_graph = pinject.new_object_graph()


# Create an instance of KnowledgeBaseQueryAgent
question_gen_llm = OpenAI(temperature=0, verbose=True)
knowledge_path = r'C:\Users\colli\PycharmProjects\langchain-master'
storage_path = '../data/langchain.pkl'
knowledge_base_query_agent = KnowledgeBaseQueryAgent(question_gen_llm, knowledge_path, storage_path)

task_q = TaskQueueService()


#q.load()
task_q.enqueue("What are all the classes that extent BaseLLM?")
# output was: The classes that extend BaseLLM are AzureOpenAI, Cohere, FakeLLM, HuggingFaceHub, InstructEmbeddings, OpenAI, SageMakerEndpoint, SelfHostedModels, TensorflowHub, and Writer.
print(str(task_q))

def main_loop():
    try:
        while task_q:
            task = task_q.dequeue()
            print(knowledge_base_query_agent.execute(task))


    except KeyboardInterrupt:
        print("Shutdown: Saving...")
        task_q.store()
        print(str(task_q))
        print("Shutdown: Complete")

    else:
        print("Completed all tasks.")

if __name__ == '__main__':
    main_loop()
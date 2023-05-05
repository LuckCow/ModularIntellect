import pinject
from langchain import OpenAI

from src.agents.chat_bot_interface import TripleMemoryQueryAgent
from src.agents.knowledgebase_query_agent import SimpleKnowledgeBaseQueryAgent
from src.memory.triple_modal_memory import TripleModalMemory
from src.services.task_queue_service import TaskQueueService


# This dependency injection strategy errored out because: ModuleNotFoundError: No module named '_gdbm'
# class AgentBindingModule(pinject.BindingSpec):
#     def configure(self, bind):
#         bind('llm', to_instance=question_gen_llm)
# obj_graph = pinject.new_object_graph() #binding_specs=[AgentBindingModule()])
# knowledge_base_query_agent = obj_graph.provide(KnowledgeBaseQueryAgent, args=[knowledge_path])

# Create a dependency injection object graph
#obj_graph = pinject.new_object_graph()

# Set up the cache
import langchain
from langchain.cache import SQLiteCache
langchain.llm_cache = SQLiteCache(database_path=".langchain.db")


uri = "neo4j+s://54b9b860.databases.neo4j.io"
user = "neo4j"
password = "uSblIp14RxxuLfgZCtHRVbGL8Z_QkEnjdgut5BwT5-c"

mem = TripleModalMemory(uri, user, password)

# Create an instance of KnowledgeBaseQueryAgent
question_gen_llm = OpenAI(temperature=0, verbose=True)
knowledge_path = r'C:\Users\colli\PycharmProjects\ModularIntellect\data\test_knowledgebase'
#storage_path = '../data/langchain.pkl'
mem.ingest_docs(knowledge_path)
knowledge_base_query_agent = TripleMemoryQueryAgent(question_gen_llm, mem)

#mem.save()  #AttributeError: Can't pickle local object 'Neo4jPool.open.<locals>.opener'

task_q = TaskQueueService()


#q.load()
task_q.enqueue("What do the two leaves teach readers about companionship and having a friend? Support your answer with evidence from the text and explain your argument completely.")
task_q.enqueue("Which best describes the MOOD of the 'two leaves' story? a.  Cheerful			b.  Bleak			c.  Humorous			d.  Optimistic")
task_q.enqueue("Which character trait does NOT apply to Eddie when he was a boy? a.  Defiant			b.  Understanding		c.  Diligent			d.  Respectful")
#task_q.enqueue("What are all the classes that extent BaseLLM?")
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
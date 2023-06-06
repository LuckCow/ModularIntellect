from langchain import OpenAI, LLMChain
from langchain.callbacks import StdOutCallbackHandler

from src.agents.graphdb_traversal_chain import GraphDBTraversalChain, graph_traverse_prompt
from src.memory.triple_modal_memory import TripleModalMemory

import os
from dotenv import load_dotenv


# Set up the cache
import langchain
from langchain.cache import SQLiteCache
langchain.llm_cache = SQLiteCache(database_path=".langchain.db")

# initialize the memory
load_dotenv()
uri = os.getenv("NEO4J_URI")
user = os.getenv("NEO4J_USER")
password = os.getenv("NEO4J_PASSWORD")

mem = TripleModalMemory(uri, user, password)

# Create memory from docks or load from file if it exists
ingested = os.path.exists('../data/triple_modal_memory.faiss')
if not ingested:
    knowledge_path = r'C:\Users\colli\Documents\AIPapers'
    mem.ingest_docs(knowledge_path)
    mem.save()
    print("Memory initialized and saved.")

else:
    mem.load()
    print("Memory loaded.")

handler = StdOutCallbackHandler()

llm = OpenAI(temperature=0.0, verbose=True)
chain = LLMChain(llm=llm, prompt=graph_traverse_prompt, callbacks=[handler])
knowledge_base_query_agent = GraphDBTraversalChain(llm_chain=chain, graph_vector_store=mem.vector_store)

# Example Research questions:
# What are different methods of providing language models with additional context to better answer questions?
# How can semantic search be used in conjunction with large language models in order to better answer questions?

def main_loop():
    try:
        while True:
            question = input("Enter a question: ")
            print(knowledge_base_query_agent.run(question))


    except KeyboardInterrupt:
        print("Shutdown: Saving...")
        mem.save()
        print("Shutdown: Complete")

    else:
        print("Completed all tasks.")

if __name__ == '__main__':
    main_loop()
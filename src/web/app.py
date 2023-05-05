from flask import Flask, request, jsonify, send_from_directory
from flask_socketio import SocketIO, emit
import random
import threading
import time

from langchain import OpenAI

from src.agents.chat_bot_interface import TripleMemoryQueryAgent
from src.agents.knowledgebase_query_agent import SimpleKnowledgeBaseQueryAgent
from src.web.socketio_callbackmanager import SocketIOCallbackHandler

app = Flask(__name__, static_folder='../../frontend/dist')
socketio = SocketIO(app, cors_allowed_origins='*')
manager = SocketIOCallbackHandler(socketio, room='')

import langchain
#langchain.callbacks.callback_manager = manager

# Set up the cache
from langchain.cache import SQLiteCache
langchain.llm_cache = SQLiteCache(database_path=".langchain.db")

# In-memory data store
tasks = []

@app.route('/')
def index():
    return send_from_directory('../../frontend/dist', 'index.html')

@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)

@app.route("/tasks", methods=["POST"])
def create_task():
    task = request.json
    tasks.append(task)
    return jsonify(task), 201

@app.route("/tasks/<id>", methods=["PUT"])
def update_task(id):
    updated_task = request.json
    index = next((i for i, task in enumerate(tasks) if task["id"] == id), None)
    if index is not None:
        tasks[index] = updated_task
        # Emit update to the frontend
        socketio.emit("task_updated", updated_task)
        return jsonify(updated_task)
    else:
        return jsonify({"error": "Task not found"}), 404

@app.route("/tasks/<id>", methods=["DELETE"])
def delete_task(id):
    global tasks
    tasks = [task for task in tasks if task["id"] != id]
    return "", 204

@app.route("/tasks/reorder", methods=["PUT"])
def reorder_tasks():
    reordered_tasks = request.json
    for updated_task in reordered_tasks:
        index = next((i for i, task in enumerate(tasks) if task["id"] == updated_task["id"]), None)
        if index is not None:
            tasks[index]["order"] = updated_task["order"]
    return jsonify(tasks)


# Backend API for chain execution state
@app.route("/api/chain-execution-state")
def get_chain_execution_state():
    state_response = manager.chain_execution_state()
    return state_response

@app.route("/search", methods=["POST"])
def search():
    data = request.json
    query = data["query"]
    search_type = data["search_type"]
    documents = vector_store.search(query, search_type)
    return jsonify([{'page_content': doc.page_content, 'metadata': doc.metadata} for doc in documents])


if __name__ == "__main__":
    # Task generator for the autonomous agent
    # def qa_chain():
    #     # Create an instance of KnowledgeBaseQueryAgent
    #     question_gen_llm = OpenAI(temperature=0, verbose=True)
    #     knowledge_path = r'C:\Users\colli\PycharmProjects\langchain-master'
    #     storage_path = '../../data/langchain.pkl'
    #     knowledge_base_query_agent = TripleMemoryQueryAgent(question_gen_llm, , socketio)
    #
    #     while True:
    #         task = 'What are all of the LLMs that can be used in LangChain?' #input("Enter a question: ")
    #         print(knowledge_base_query_agent.execute(task))
    #
    #
    # # Start the autonomous agent's task generator in a separate thread
    # threading.Thread(target=qa_chain, daemon=True).start()
    def test_chain_emits():
        while True:
            time.sleep(random.randint(5, 15))  # Wait between 5 and 15 seconds
            print('starting chain')
            inputs = {'memory': 'past', 'query': 'now'}
            manager.on_chain_start({}, inputs)
            print('finishing chain')
            outputs = {'output': 'results'}
            outputs.update(inputs)
            manager.on_chain_end(outputs)

    threading.Thread(target=test_chain_emits, daemon=True).start()

    socketio.run(app, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)

# Decommissioned test code
# Task generator for the autonomous agent
def task_generator():
    while True:
        time.sleep(random.randint(5, 15))  # Wait between 5 and 15 seconds
        task = {
            "id": str(random.randint(1000, 9999)),
            "description": f"System Task {random.randint(1, 100)}",
            "source": "system",
            "order": len(tasks),
            "isCompleted": False,
        }
        tasks.append(task)
        socketio.emit("task_created", task)  # Emit update to the frontend

# Start the autonomous agent's task generator in a separate thread
#threading.Thread(target=task_generator, daemon=True).start()
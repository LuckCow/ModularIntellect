from typing import Dict, Union
from langchain.docstore.base import AddableMixin, Docstore
from langchain.docstore.document import Document


class Neo4jDocstore(Docstore, AddableMixin):
    """Langchain Docstore implementation for a Neo4j database."""

    def __init__(self, neo4j_driver):
        """Initialize with Neo4j driver."""
        self.driver = neo4j_driver

    def add(self, texts: Dict[str, Document]) -> None:
        """Add texts to Neo4j database."""
        documents = {}
        notes = {}
        interactions = {}
        for doc_id, doc in texts.items():
            if doc.metadata.get("node_type"):
                doc_type = doc.metadata.pop("node_type")
            else:
                doc_type = "document"

            # classify the node type
            if doc_type == "document":
                documents[doc_id] = doc
            elif doc_type == "note":
                notes[doc_id] = doc
            elif doc_type == "interaction":
                interactions[doc_id] = doc

        if documents:
            self._add_documents(documents)
        if notes:
            self._add_notes(notes)
        if interactions:
            self._add_interactions(interactions)

    def _add_notes(self, texts: Dict[str, Document]):
        with self.driver.session() as session:
            for doc_id, doc in texts.items():
                references = doc.metadata.get("references", [])
                query = """
                MERGE (n:Note {id: $doc_id})
                ON CREATE SET n += $properties
                WITH n
                UNWIND $references AS ref_id
                MATCH (ref_node) WHERE ID(ref_node) = toInteger(ref_id)
                MERGE (n)-[:REFERENCES]->(ref_node)
                """
                properties = {k: v for k, v in doc.metadata.items() if k != "references"}
                properties["text"] = doc.page_content
                session.run(query, doc_id=doc_id, properties=properties, references=references)

    def _add_interactions(self, texts: Dict[str, Document]):
        with self.driver.session() as session:
            for doc_id, doc in texts.items():
                conversation_id = doc.metadata.get("conversation_id", None)
                query = """
                MERGE (i:Interaction {id: $doc_id})
                ON CREATE SET i += $properties
                WITH i
                MERGE (c:Conversation {id: $conversation_id})
                MERGE (i)-[:PART_OF]->(c)
                """
                properties = {k: v for k, v in doc.metadata.items() if k != "conversation_id"}
                properties["text"] = doc.page_content
                session.run(query, doc_id=doc_id, properties=properties, conversation_id=conversation_id)

    def _add_documents(self, texts: Dict[str, Document]):
        # Group texts by source, add order and previous chunk metadata for neo4j formatting
        docsrc_to_chunks = {}
        prev_docsrc = None
        prev_chunk_id = None
        chunk_order = 0
        for doc_id, doc in texts.items():
            chunk = {"id": doc_id}
            doc_src = doc.metadata.get("source", "unspecified source")
            chunk_props = {"text": doc.page_content}
            chunk_props.update(doc.metadata)

            # Reset counter and chunk pointer on new source
            if prev_docsrc != doc_src:
                prev_chunk_id = None
                chunk_order = 0

            # Add order and previous chunk metadata
            chunk_props["order"] = chunk_order
            chunk["prev_id"] = prev_chunk_id

            chunk['properties'] = chunk_props
            docsrc_to_chunks.setdefault(doc_src, []).append(chunk)

            # Update previous data
            prev_docsrc = doc_src
            chunk_order += 1
            prev_chunk_id = chunk["id"]

        with self.driver.session() as session:
            for doc_src, chunks in docsrc_to_chunks.items():
                chunks_query = ("MERGE (d:Document {doc_title: $doc_title})\n"
                                "WITH d\n"
                                "UNWIND $chunks AS chunk\n"
                                "MERGE (c:Chunk {id: chunk.id})\n"
                                "ON CREATE SET c += chunk.properties\n"
                                "MERGE (d)<-[:PART_OF]-(c)\n"
                                "WITH c, chunk\n"
                                "MATCH (prev:Chunk {id: chunk.prev_id})\n"
                                "MERGE (prev)-[:CONTINUES]->(c)\n")
                session.run(chunks_query, chunks=chunks, doc_title=doc_src)

    def search(self, search: str) -> Union[str, Document]:
        """Search for a document in Neo4j database."""
        with self.driver.session() as session:
            query = """
            MATCH (i)
            WHERE i.id = $id
            RETURN i.text AS text
            """
            result = session.run(query, id=search)
            record = result.single()

            if record:
                return Document(page_content=record["text"], metadata={"id": search})
            else:
                print('Error: ID not found.: ', search)
                return Document(page_content="Error not found: " + search, metadata={"id": search})

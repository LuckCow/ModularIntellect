from typing import Dict, Any, Union, List


class ChainBlockData:
    def __init__(self, title: str, inputs: Dict[str, Any], outputs: Union[Dict[str, Any], None] = None):
        self.title = title
        self.inputs = inputs
        self.outputs = outputs


class ChainState:
    def __init__(self):
        self.chain_blocks: List[ChainBlockData] = []
        self.current_block_index: Union[int, None] = None

    def add_chain_block(self, title: str, inputs: Dict[str, Any]):
        self.chain_blocks.append(ChainBlockData(title, inputs))
        self.current_block_index = 0 if self.current_block_index is None else self.current_block_index + 1

    def set_chain_block_outputs(self, outputs: Dict[str, Any]):
        if self.current_block_index is not None:
            self.chain_blocks[self.current_block_index].outputs = outputs

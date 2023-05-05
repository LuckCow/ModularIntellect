import {action, observable, makeAutoObservable} from "mobx";

interface ChainBlockData {
  title: string;
  inputs: Record<string, any>;
  outputs: Record<string, any> | null;
}

class ChainExecutionStore {
  @observable chainBlocks: ChainBlockData[] = [];
  currentBlockIndex: number | null = null;

  constructor() {
    makeAutoObservable(this);
    this.fetchInitialState();
  }

  async fetchInitialState() {

    const response = await fetch("/api/chain-execution-state");
    const data = await response.json();
    // Assuming the data has properties `chainBlocks` and `currentBlockIndex`
    this.chainBlocks = data.chainBlocks;
    console.log("Fetching initial state for chain execution:", this.chainBlocks)
    this.currentBlockIndex = data.currentBlockIndex;
  }

  @action addChainBlock(title: string, inputs: Record<string, any>) {
    this.chainBlocks.push({ title, inputs, outputs: null });
    this.currentBlockIndex = this.currentBlockIndex === null ? 0 : this.currentBlockIndex + 1;
  }

  @action setChainBlockOutputs(outputs: Record<string, any>) {
    if (this.currentBlockIndex !== null) {
      this.chainBlocks[this.currentBlockIndex].outputs = outputs;
    }
  }

  @action updateInput(blockIndex: number, key: string, value: any) {
    this.chainBlocks[blockIndex].inputs = {...this.chainBlocks[blockIndex].inputs, [key]: value};
  }
}

export default ChainExecutionStore;

import React, { useEffect, useContext } from "react";
import { observer } from "mobx-react";
import ChainBlock from "./ChainBlock";
import { SocketContext } from "../../services/socket";
import ChainExecutionStore from "../../stores/ChainExecutionStore";
import {Container, Header, ThemedButton, Title} from '../../SharedStyles';

interface ChainInterfaceProps {
  chainExecutionStore: ChainExecutionStore;
}

const ChainInterface: React.FC<ChainInterfaceProps> = observer(({ chainExecutionStore }) => {
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on("chain_start", (data: any) => {
      chainExecutionStore.addChainBlock(data.serialized.name, data.inputs);
    });

    socket.on("chain_end", (data: any) => {
      chainExecutionStore.setChainBlockOutputs(data.outputs);
    });

    return () => {
      socket.off("chain_start");
      socket.off("chain_end");
    };
  }, [chainExecutionStore, socket]);

  // This will refetch the initial state when the component is mounted or becomes visible
  useEffect(() => {
    chainExecutionStore.fetchInitialState();
  }, []); // Empty array as dependency to run only when the component is mounted


  const handleContinue = () => {
    socket.emit("chain_start_confirm");
  };

  const handleInputChange = (blockIndex: number, key: string, value: string) => {
    chainExecutionStore.updateInput(blockIndex, key, value);
    socket.emit("input_update", { blockIndex, key, value });
  };

  return (
    <Container>
      <Header>
        <Title>Chain Execution</Title>
      </Header>
      {chainExecutionStore.chainBlocks.map((block, index) => (
        <ChainBlock
          key={index}
          title={block.title}
          inputs={block.inputs}
          outputs={block.outputs}
          onInputChange={(key, value) => handleInputChange(index, key, value)}
        />
      ))}
      {chainExecutionStore.currentBlockIndex !== null &&
        chainExecutionStore.chainBlocks[chainExecutionStore.currentBlockIndex].outputs === null && (
          <ThemedButton onClick={handleContinue}>Continue</ThemedButton>
        )}
    </Container>
  );
});

export default ChainInterface;

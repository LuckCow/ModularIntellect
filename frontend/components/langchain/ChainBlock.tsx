import React, { ChangeEvent } from "react";
import { BlockContainer, Content, Title, InputContainer, InputLabel, InputField, OutputField } from "../../SharedStyles";

interface Props {
  title: string;
  inputs: Record<string, any>;
  outputs: Record<string, any> | null;
  onInputChange: (key: string, value: string) => void;
}

const ChainBlock: React.FC<Props> = ({ title, inputs, outputs, onInputChange }) => {
  const handleInputChange = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    onInputChange(key, event.target.value);
  };

  return (
    <BlockContainer>
      <Title>{title}</Title>
      <div>
        <h3>Inputs</h3>
        {Object.entries(inputs).map(([key, value]) => (
          <InputContainer key={key}>
            <InputLabel>{key}</InputLabel>
            <InputField value={value} onChange={handleInputChange(key)} />
          </InputContainer>
        ))}
      </div>
      {outputs && (
          <div>
          <h3>Outputs</h3>
          {Object.entries(outputs).map(([key, value]) => (
            <InputContainer key={key}>
              <InputLabel>{key}</InputLabel>
              <OutputField value={value} readOnly />
            </InputContainer>
          ))}
        </div>
      )}
    </BlockContainer>
  );
};

export default ChainBlock;

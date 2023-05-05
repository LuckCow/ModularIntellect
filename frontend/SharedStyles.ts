import styled from 'styled-components';

const Container = styled.div`
  background-color: rgba(40, 44, 52, 0.8);
  border-radius: 10px;
  padding: 1rem;
  width: 95%;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  padding: 0 1rem;
  background-color: rgba(40, 44, 52, 0.8);
  z-index: 10;
`;

const Title = styled.h2`
  color: #f0f0f0;
  margin-bottom: 1rem;
  font-family: 'Roboto', sans-serif;
`;

const BlockContainer = styled.div`
  background-color: rgba(58, 65, 73, 0.8);
  border-radius: 5px;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
`;

const Content = styled.pre`
  color: #f0f0f0;
  font-family: 'Roboto', sans-serif;
`;

const ThemedButton = styled.button`
  background-color: #3c91e6;
  border: none;
  border-radius: 5px;
  color: #f0f0f0;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2c699a;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    background-color: rgba(60, 145, 230, 0.4);
    cursor: not-allowed;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(58, 65, 73, 0.4);
  border-radius: 5px;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`;

const InputLabel = styled.label`
  color: #f0f0f0;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  width: 150px;
  text-align: right;
  font-family: 'Roboto Mono', monospace;
`;

const InputField = styled.input`
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 5px;
  color: #f0f0f0;
  font-size: 0.9rem;
  font-family: 'Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji', sans-serif;
  padding: 0.25rem 0.5rem;
  width: 100%;

  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const OutputField = styled(InputField)`
  background-color: rgba(255, 255, 255, 0.05);
  cursor: text;
`;


export {
  Container,
  Header,
  Title,
  BlockContainer,
  Content,
  ThemedButton,
  InputContainer,
  InputLabel,
  InputField,
  OutputField,
};

import React from 'react';
import styled from 'styled-components';
import { DashboardButtonData } from './DashboardButtonData';
import { useNavigate } from 'react-router-dom';

const Button = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background: #222;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
  height: 100%; 
  overflow: hidden;
  &:hover {
    background: #444;
  }
    h3 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem; // Adjust this value to control the gap between the title and the description
  }
  p {
    margin-top: 0; // Remove the default top margin of the paragraph
    margin-bottom: 0.5rem;
  }
  div {
    align-self: stretch;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  height: 100%;
`;

const WidgetWrapper = styled.div`
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`;


interface Props {
  data: DashboardButtonData;
}

const DashboardButton: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${data.id}`);
  };

  return (
    <Button onClick={handleClick}>
      <Content>
        <h3>{data.title}</h3>
        <p>{data.description}</p>
        <WidgetWrapper>{data.widget()}</WidgetWrapper>
      </Content>
    </Button>
  );
};

export default DashboardButton;

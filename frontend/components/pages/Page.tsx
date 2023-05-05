import { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {ThemedButton} from "../../SharedStyles";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #f0f0f0;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

interface CloseButtonProps {
  style?: CSSProperties;
}

const CloseButton: React.FC<CloseButtonProps> = () => {
    const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
          <ThemedButton onClick={handleClose}>
              Close
            </ThemedButton>
  );
};


interface PageProps {
  title: string;
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children }) => (
  <div>
      <PageContainer>
        <Title>{title}</Title>
          <CloseButton/>
          {children}
      </PageContainer>
  </div>
);

export default Page;

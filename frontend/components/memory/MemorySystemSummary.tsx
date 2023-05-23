import {
  Container,
  Title,
  GridBlockContainer,
  Content,
    Header,
    SubTitle,
    Description
} from "../../SharedStyles";


interface MemorySystemSummaryProps {
  documents: number;
  chunks: number;
  conversations: number;
  responses: number;
  reflections: number;
    tasks: number;
}

const MemorySystemSummary: React.FC<MemorySystemSummaryProps> = ({
  documents,
  chunks,
  conversations,
  responses,
  reflections,
  tasks,
}) => (
    <GridBlockContainer>
      <Content>
        <SubTitle>Documents: {documents}</SubTitle>
        <Description>Individual docs uploaded.</Description>
      </Content>
      <Content>
        <SubTitle>Chunks: {chunks}</SubTitle>
        <Description>Chunks docs are broken into.</Description>
      </Content>
      <Content>
        <SubTitle>Conversations: {conversations}</SubTitle>
        <Description>User conversation instances.</Description>
      </Content>
      <Content>
        <SubTitle>Responses: {responses}</SubTitle>
        <Description>Responses given during conversations.</Description>
      </Content>
      <Content>
        <SubTitle>Reflections: {reflections}</SubTitle>
        <Description>Internal system reflections.</Description>
      </Content>
      <Content>
        <SubTitle>Tasks: {tasks}</SubTitle>
        <Description>Pending and completed tasks.</Description>
      </Content>
    </GridBlockContainer>
);

export default MemorySystemSummary
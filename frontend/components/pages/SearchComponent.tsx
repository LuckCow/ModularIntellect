import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Title,
  InputContainer,
  InputLabel,
  InputField,
  ThemedButton,
  Content,
} from "../../SharedStyles";

interface Props {}

interface Document {
  page_content: string;
  metadata: Record<string, any>;
}

const SearchComponent: React.FC<Props> = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("");
  const [results, setResults] = useState<Document[]>([]);

  const handleSearch = async () => {
    const response = await axios.post("http://127.0.0.1:5000/search", {
      query,
      search_type: searchType,
    });

    setResults(response.data);
  };

  return (
    <Container>
      <Title>Vector Store Search</Title>
      <InputContainer>
        <InputLabel>Query</InputLabel>
        <InputField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <InputLabel>Search Type</InputLabel>
        <InputField
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        />
      </InputContainer>
      <ThemedButton onClick={handleSearch}>Search</ThemedButton>
      <div>
        <Title>Results</Title>
        {results.map((result, index) => (
          <Content key={index}>{result.page_content}</Content>
        ))}
      </div>
    </Container>
  );
};

export default SearchComponent;

import styled from 'styled-components';

const Container = styled.div`
  padding: ${(props) => props.padding || "20px"};
  font-family: "Nanum Gothic", sans-serif;
`;

export default Container;
import React from 'react';
import styled from 'styled-components';
import PacmanLoader from 'react-spinners/PacmanLoader';

const Loader = ({ loading, size = 28, color = 'rgba(255, 255, 255, 1)' }) => {
  if (!loading) return null; // loading이 false면 아무것도 렌더링하지 않음

  return (
    <LoaderContainer>
      <PacmanLoader color={color} loading={loading} size={size} />
    </LoaderContainer>
  );
};

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

export default Loader;

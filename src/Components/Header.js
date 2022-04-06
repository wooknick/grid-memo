import React, { useContext } from "react";
import styled from "styled-components";
import AppContext from "../Context/AppContext";

const Wrapper = styled.div`
  width: 100%;
  height: 48px;
  border-bottom: 1px solid #e3e3e3;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.span`
  font-size: 24px;
  &:hover {
    cursor: pointer;
  }
`;

const Header = () => {
  const { toggleEditMode, editMode } = useContext(AppContext);
  return (
    <Wrapper onClick={() => toggleEditMode()}>
      <Title>{editMode ? "Edit Mode" : "Play Mode"}</Title>
    </Wrapper>
  );
};

export default Header;

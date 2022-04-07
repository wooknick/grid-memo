import React, { useContext } from "react";
import styled from "styled-components";
import AppContext from "../Context/AppContext";

const Wrapper = styled.div`
  width: 100%;
  height: 56px;
  /* border-bottom: 4px solid #9e9e9e; */
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 10;
  background-color: #181c22;
`;

const Space = styled.div`
  width: 100%;
  height: 56px;
`;

const Title = styled.span`
  font-size: 32px;
  font-family: "Montserrat", sans-serif;
  font-weight: 900;
  &:hover {
    cursor: pointer;
  }
`;

const Header = () => {
  const { toggleEditMode, editMode } = useContext(AppContext);
  return (
    <>
      <Space />
      <Wrapper onClick={() => toggleEditMode()}>
        <Title>{editMode ? "GRID MEMO - edit" : "GRID MEMO"}</Title>
      </Wrapper>
    </>
  );
};

export default Header;

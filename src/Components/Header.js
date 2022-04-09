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

const RightButtons = styled.div`
  position: absolute;
  right: 16px;
  font-size: 24px;
  font-family: "Montserrat", sans-serif;
  font-weight: 900;
  &:hover {
    cursor: pointer;
  }
`;

const Button = styled.div`
  svg {
    fill: white;
  }
`;

const Header = () => {
  const { toggleEditMode, editMode } = useContext(AppContext);

  const cleanData = () => {
    localStorage.setItem("grid-memo", JSON.stringify([]));
    window.location.reload();
  };
  return (
    <>
      <Space />
      <Wrapper>
        <Title onClick={() => toggleEditMode()}>
          {editMode ? "GRID MEMO - edit" : "GRID MEMO"}
        </Title>
        <RightButtons>
          <Button onClick={cleanData}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M13.5 2c-5.629 0-10.212 4.436-10.475 10h-3.025l4.537 5.917 4.463-5.917h-2.975c.26-3.902 3.508-7 7.475-7 4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5c-2.381 0-4.502-1.119-5.876-2.854l-1.847 2.449c1.919 2.088 4.664 3.405 7.723 3.405 5.798 0 10.5-4.702 10.5-10.5s-4.702-10.5-10.5-10.5z" />
            </svg>
          </Button>
        </RightButtons>
      </Wrapper>
    </>
  );
};

export default Header;

import React from "react";
import styled from "styled-components";
import YoutubeCanvas from "../Components/YoutubeCanvas";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Home = () => (
  <Wrapper>
    <YoutubeCanvas />
  </Wrapper>
);

export default Home;

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import MemoCanvas from "../Components/MemoCanvas";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  scrollbar-width: none;
  --ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Home = () => {
  const [firstMove, setFirstMove] = useState(true);
  const wrapperRef = useRef();

  useEffect(() => {
    let t;
    function handleScroll(e) {
      if (t) {
        clearTimeout(t);
      }
      t = setTimeout(() => {
        const {
          target: { scrollTop, scrollLeft },
        } = e;
        const scroll = { x: scrollLeft, y: scrollTop };
        localStorage.setItem("grid-memo-scroll", JSON.stringify(scroll));
      }, 500);
    }
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollTo = (x, y) => {
    if (wrapperRef.current && firstMove) {
      wrapperRef.current.scrollTo(x, y);
      setFirstMove(false);
    }
  };

  return (
    <Wrapper ref={wrapperRef}>
      <MemoCanvas scrollTo={scrollTo} />
    </Wrapper>
  );
};

export default Home;

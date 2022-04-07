import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { v4 } from "uuid";
import PropTypes from "prop-types";
import Memo from "./Memo";
import AppContext from "../Context/AppContext";

const Wrapper = styled.div`
  position: relative;
  margin: 0 auto;
  width: 6000px;
  height: 6000px;
  aspect-ratio: 1;
  background-color: #222831;
`;

const Grid = styled.div`
  position: absolute;
  left: -1px;
  top: -1px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #aaaaaa;
  box-sizing: content-box;
`;

const GridBox = styled.div`
  width: 120px;
  height: 120px;
  background-color: #222831;
  border: 1px solid #313740;
  &:hover {
    cursor: pointer;
    background-color: #121519;
  }
`;

const MemoCanvas = ({ scrollTo }) => {
  const { editMode } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [scroll, setScroll] = useState(undefined);

  useEffect(() => {
    const db = localStorage.getItem("grid-memo");
    if (db) {
      setData(JSON.parse(db));
    } else {
      setData([
        {
          id: "0",
          x: 3120,
          y: 2520,
          factor: 2,
          content: {
            type: "text",
            payload: "시작",
          },
        },
      ]);
    }
  }, []);

  useEffect(() => {
    const lastScroll = localStorage.getItem("grid-memo-scroll");
    if (lastScroll) {
      setScroll(JSON.parse(lastScroll));
    } else {
      setScroll({ x: 2000, y: 2000 });
    }
  }, []);

  useEffect(() => {
    if (scroll) {
      scrollTo(scroll.x, scroll.y);
    }
  }, [scroll, scrollTo]);

  const updateData = obj => {
    const newData = [...data];
    const targetIdx = newData.findIndex(v => v.id === obj.id);
    newData[targetIdx] = obj;
    setData(newData);
    localStorage.setItem("grid-memo", JSON.stringify(newData));
  };

  const addData = ({ x, y }) => {
    const newItem = {
      id: v4(),
      x,
      y,
      factor: 1,
      content: undefined,
    };
    const newData = [...data, newItem];
    setData(newData);
    localStorage.setItem("grid-memo", JSON.stringify(newData));
  };

  const removeData = id => {
    const newData = [...data];
    const targetIdx = newData.findIndex(v => v.id === id);
    newData.splice(targetIdx, 1);
    setData(newData);
    localStorage.setItem("grid-memo", JSON.stringify(newData));
  };

  const handleDblClick = e => {
    const { target } = e;
    const gridIdx = target.dataset.grididx;
    const x = Math.min(gridIdx % 50, 48);
    const y = Math.min(Math.floor(gridIdx / 50), 48);
    addData({ x: x * 120, y: y * 120 });
  };

  return (
    <Wrapper>
      {editMode && (
        <Grid onDoubleClick={handleDblClick}>
          {new Array(2500).fill(0).map((_, idx) => (
            <GridBox key={v4()} data-grididx={idx} />
          ))}
        </Grid>
      )}
      {data.map(d => (
        <Memo
          cardData={d}
          key={d.id}
          updateData={updateData}
          removeData={removeData}
        />
      ))}
    </Wrapper>
  );
};

export default MemoCanvas;

MemoCanvas.propTypes = {
  scrollTo: PropTypes.func.isRequired,
};

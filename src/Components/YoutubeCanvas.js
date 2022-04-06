import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { v4 } from "uuid";
import YoutubeCard from "./YoutubeCard";
import AppContext from "../Context/AppContext";

const Wrapper = styled.div`
  position: relative;
  margin: 0 auto;
  width: 1920px;
  height: 1080px;
  aspect-ratio: 16 / 9;
  background-color: #e3e3e3;
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
  width: 160px;
  height: 90px;
  background-color: #e3e3e3;
  border: 1px solid #aaaaaa;
`;

const YoutubeCanvas = () => {
  const { editMode } = useContext(AppContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const db = localStorage.getItem("youtube-grid-data");
    if (db) {
      setData(JSON.parse(db));
    } else {
      setData([
        { id: "0", x: 320, y: 630, factor: 20, videoId: "XA2YEHn-A8Q" },
        { id: "1", x: 960, y: 180, factor: 50, videoId: "Xuxgu5KwoOA" },
        { id: "2", x: 640, y: 630, factor: 30, videoId: "y49wGJyxDXs" },
        { id: "3", x: 320, y: 270, factor: 40, videoId: "2skPtp8hjEM" },
      ]);
    }
  }, []);

  const updateData = obj => {
    const newData = [...data];
    const targetIdx = newData.findIndex(v => v.id === obj.id);
    newData[targetIdx] = obj;
    setData(newData);
    localStorage.setItem("youtube-grid-data", JSON.stringify(newData));
  };

  const addData = ({ x, y }) => {
    const newItem = {
      id: v4(),
      x,
      y,
      factor: 20,
      videoId: "",
    };
    const newData = [...data, newItem];
    setData(newData);
    localStorage.setItem("youtube-grid-data", JSON.stringify(newData));
  };

  const removeData = id => {
    const newData = [...data];
    const targetIdx = newData.findIndex(v => v.id === id);
    newData.splice(targetIdx, 1);
    setData(newData);
    localStorage.setItem("youtube-grid-data", JSON.stringify(newData));
  };

  const handleDblClick = e => {
    const { target } = e;
    const gridIdx = target.dataset.grididx;
    const x = Math.min(gridIdx % 12, 10);
    const y = Math.min(Math.floor(gridIdx / 12), 10);
    addData({ x: x * 160, y: y * 90 });
  };

  return (
    <Wrapper>
      {editMode && (
        <Grid onDoubleClick={handleDblClick}>
          {new Array(144).fill(0).map((_, idx) => (
            <GridBox key={v4()} data-grididx={idx} />
          ))}
        </Grid>
      )}
      {data.map(d => (
        <YoutubeCard
          cardData={d}
          key={d.id}
          updateData={updateData}
          removeData={removeData}
        />
      ))}
    </Wrapper>
  );
};

export default YoutubeCanvas;

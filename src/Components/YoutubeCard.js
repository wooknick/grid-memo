import React, { useState, useContext, useMemo } from "react";
import styled from "styled-components";
import { Rnd } from "react-rnd";
import PropTypes from "prop-types";
import { parseUrl } from "query-string";
import AppContext from "../Context/AppContext";

const MIN_FACTOR = 20;
const MIN_WIDTH = 16 * MIN_FACTOR;
const MIN_HEIGHT = 9 * MIN_FACTOR;
const MAX_FACTOR = 120;
const MAX_WIDTH = 16 * MAX_FACTOR;
const MAX_HEIGHT = 9 * MAX_FACTOR;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Content = styled.div`
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #333333;
  background-color: #eeeeee;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.bgColor};
  opacity: 0.95;
  border: 1px solid white;
`;

const randomColor = () => {
  const colors = ["#F23847", "#95BF8A", "#DAF2C2", "#F2D027", "#F2916D"];
  const idx = Math.floor(Math.random() * colors.length);
  return colors[idx];
};

const YoutubeCard = ({ cardData, updateData, removeData }) => {
  const { editMode } = useContext(AppContext);
  /**
   * Problem : onDragStop에 deltaX, deltaY 계산 버그 존재함(22.3.12 기준)
   * Solution : 버그가 없는 onDrag를 통해 position을 직접 계산하여 관리함
   */
  const [position, setPosition] = useState({ x: cardData.x, y: cardData.y });
  const color = useMemo(() => randomColor(cardData.id), [cardData.id]);

  const handleDrag = (_, data) => {
    const { deltaX, deltaY } = data;
    const newPosition = { x: position.x + deltaX, y: position.y + deltaY };
    setPosition(newPosition);
  };

  const handleDragStop = () => {
    const { x, y } = position;
    const newData = Object.assign(cardData);
    newData.x = x;
    newData.y = y;
    updateData(newData);
  };

  const handleResizeStop = (_, __, ref) => {
    const factor = ref.offsetWidth / 16;
    const newData = Object.assign(cardData);
    newData.factor = factor;
    updateData(newData);
  };

  const handleDblClickOverlay = () => {
    const url = prompt("복사한 유튜브 주소를 입력해주세요.") || "";
    if (url === "delete" || url === "삭제" || url === "d") {
      removeData(cardData.id);
    }
    const parsedUrl = parseUrl(url);
    const newVideoId = parsedUrl.query.v;
    if (newVideoId !== undefined) {
      const newData = Object.assign(cardData);
      newData.videoId = newVideoId;
      updateData(newData);
    }
  };

  const defaultStyle = {
    x: cardData.x,
    y: cardData.y,
    width: 16 * cardData.factor,
    height: 9 * cardData.factor,
  };

  return (
    <Rnd
      default={defaultStyle}
      lockAspectRatio={16 / 9}
      minWidth={MIN_WIDTH}
      minHeight={MIN_HEIGHT}
      maxWidth={MAX_WIDTH}
      maxHeight={MAX_HEIGHT}
      resizeGrid={[MIN_WIDTH / 2, MIN_HEIGHT / 2]}
      dragGrid={[MIN_WIDTH / 2, MIN_HEIGHT / 2]}
      bounds="parent"
      onResizeStop={handleResizeStop}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      disableDragging={!editMode}
      enableResizing={editMode}
    >
      <Wrapper>
        {editMode && (
          <Overlay bgColor={color} onDoubleClick={handleDblClickOverlay} />
        )}
        <Content>
          {cardData.videoId === "" ? (
            <Overlay bgColor={color} onDoubleClick={handleDblClickOverlay} />
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${cardData.videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </Content>
      </Wrapper>
    </Rnd>
  );
};

export default YoutubeCard;

YoutubeCard.propTypes = {
  cardData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    factor: PropTypes.number.isRequired,
    videoId: PropTypes.string.isRequired,
  }).isRequired,
  updateData: PropTypes.func.isRequired,
  removeData: PropTypes.func.isRequired,
};

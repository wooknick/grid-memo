/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/aria-role */
import React, { useState, useContext, useMemo, useEffect } from "react";
import styled from "styled-components";
import { Rnd } from "react-rnd";
import PropTypes from "prop-types";
import { parseUrl } from "query-string";
import AppContext from "../Context/AppContext";

const MIN_FACTOR = 1;
const MIN_WIDTH = 120 * MIN_FACTOR;
const MIN_HEIGHT = 120 * MIN_FACTOR;
const MAX_FACTOR = 30;
const MAX_WIDTH = 120 * MAX_FACTOR;
const MAX_HEIGHT = 120 * MAX_FACTOR;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Content = styled.div`
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #333333;
  background-color: #eeeeee;
`;

const OptionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #333333;
  background-color: #eeeeee;
  position: absolute;
  font-size: 24px;
  &:hover {
    cursor: pointer;
    background-color: #cccccc;
  }
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
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
`;

const EditableDiv = styled.div`
  width: 100%;
  height: 100%;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  white-space: normal;
  text-align: center;
  padding: 16px;
  background-color: #151a22;
  color: white;
  div {
    width: 100%;
  }
`;

const randomColor = () => {
  const colors = ["#F23847", "#95BF8A", "#DAF2C2", "#F2D027", "#F2916D"];
  const idx = Math.floor(Math.random() * colors.length);
  return colors[idx];
};

const Memo = ({ cardData, updateData, removeData }) => {
  const { editMode } = useContext(AppContext);
  /**
   * Problem : onDragStop에 deltaX, deltaY 계산 버그 존재함(22.3.12 기준)
   * Solution : 버그가 없는 onDrag를 통해 position을 직접 계산하여 관리함
   */
  const [position, setPosition] = useState({ x: cardData.x, y: cardData.y });
  const [showOption, setShowOption] = useState(false);
  const [textContent, setTextContent] = useState("Something Write Here.");
  const color = useMemo(() => randomColor(cardData.id), [cardData.id]);

  let debounceT;

  useEffect(() => {
    if (!editMode) {
      setShowOption(false);
    }
  }, [editMode]);

  useEffect(() => {
    if (cardData.content && cardData.content.type === "text") {
      setTextContent(cardData.content.payload);
    }
  }, [cardData]);

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
    const factor = ref.offsetWidth / 120;
    const newData = Object.assign(cardData);
    newData.factor = factor;
    updateData(newData);
  };

  const handleDblClickOverlay = () => {
    // 옵션창 확장
    if (editMode) {
      setShowOption(v => !v);
    } else {
      // 뷰 기능
    }
  };

  const handleOption = option => {
    if (option === "delete") {
      removeData(cardData.id);
    } else if (option === "youtube") {
      const url = prompt("복사한 유튜브 주소를 입력해주세요.") || "";
      const parsedUrl = parseUrl(url);
      const newVideoId = parsedUrl.query.v;
      if (newVideoId !== undefined) {
        const newData = Object.assign(cardData);
        newData.content = {
          type: "youtube",
          payload: newVideoId,
        };
        updateData(newData);
      }
      setShowOption(false);
    } else if (option === "text") {
      const newData = Object.assign(cardData);
      newData.content = {
        type: "text",
        payload: "Something Write Here.",
      };
      updateData(newData);
      setShowOption(false);
    }
  };

  const handleEditableKeyDown = e => {
    if (debounceT) {
      clearTimeout(debounceT);
    }
    debounceT = setTimeout(() => {
      const newTextContent = e.target.innerHTML;
      const newData = Object.assign(cardData);
      newData.content = {
        type: "text",
        payload: newTextContent,
      };
      updateData(newData);
    }, 500);
  };

  const defaultStyle = {
    x: cardData.x,
    y: cardData.y,
    width: 120 * cardData.factor,
    height: 120 * cardData.factor,
  };

  return (
    <Rnd
      default={defaultStyle}
      // lockAspectRatio={1 / 1}
      minWidth={MIN_WIDTH}
      minHeight={MIN_HEIGHT}
      maxWidth={MAX_WIDTH}
      maxHeight={MAX_HEIGHT}
      resizeGrid={[MIN_WIDTH, MIN_HEIGHT]}
      dragGrid={[MIN_WIDTH, MIN_HEIGHT]}
      bounds="parent"
      onResizeStop={handleResizeStop}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      disableDragging={!editMode}
      enableResizing={editMode}
      style={{ zIndex: showOption ? 1000 : 1 }}
    >
      <Wrapper>
        {editMode && (
          <Overlay bgColor={color} onDoubleClick={handleDblClickOverlay}>
            <span>{cardData.content ? cardData.content.type : "Blank"}</span>
          </Overlay>
        )}
        {showOption && (
          <>
            <OptionWrapper
              style={{
                width: `${MIN_WIDTH}px`,
                height: `${MIN_HEIGHT}px`,
                top: `-${MIN_HEIGHT}px`,
                left: `0px`,
              }}
            >
              Image
            </OptionWrapper>
            <OptionWrapper
              style={{
                width: `${MIN_WIDTH}px`,
                height: `${MIN_HEIGHT}px`,
                top: `-${MIN_HEIGHT}px`,
                left: `${MIN_WIDTH}px`,
              }}
              onClick={() => handleOption("youtube")}
            >
              Youtube
            </OptionWrapper>
            <OptionWrapper
              style={{
                width: `${MIN_WIDTH}px`,
                height: `${MIN_HEIGHT}px`,
                top: `-${MIN_HEIGHT}px`,
                left: `${MIN_WIDTH * 2}px`,
              }}
              onClick={() => handleOption("text")}
            >
              Text
            </OptionWrapper>
            <OptionWrapper
              style={{
                width: `${MIN_WIDTH}px`,
                height: `${MIN_HEIGHT}px`,
                bottom: `-${MIN_HEIGHT}px`,
                left: `0px`,
                color: "#ab0000",
              }}
              onClick={() => handleOption("delete")}
            >
              Delete
            </OptionWrapper>
          </>
        )}
        <Content>
          {cardData.content === undefined && (
            <Overlay bgColor={color} onDoubleClick={handleDblClickOverlay}>
              <span>Blank</span>
            </Overlay>
          )}
          {cardData.content && cardData.content.type === "youtube" && (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${cardData.content.payload}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {cardData.content && cardData.content.type === "text" && (
            <EditableDiv
              contentEditable="true"
              role="editor"
              onKeyDown={handleEditableKeyDown}
              dangerouslySetInnerHTML={{ __html: textContent }}
            />
          )}
        </Content>
      </Wrapper>
    </Rnd>
  );
};

export default Memo;

Memo.propTypes = {
  cardData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    factor: PropTypes.number.isRequired,
    content: PropTypes.shape({
      type: PropTypes.string.isRequired,
      payload: PropTypes.any.isRequired,
    }),
  }).isRequired,
  updateData: PropTypes.func.isRequired,
  removeData: PropTypes.func.isRequired,
};

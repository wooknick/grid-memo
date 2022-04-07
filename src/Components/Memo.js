/* eslint-disable no-alert */
import React, { useState, useContext, useMemo, useEffect } from "react";
import styled from "styled-components";
import { Rnd } from "react-rnd";
import PropTypes from "prop-types";
import { parseUrl } from "query-string";
import AppContext from "../Context/AppContext";
import ImageMemo from "./MemoType/ImageMemo";
import TextMemo from "./MemoType/TextMemo";
import YoutubeMemo from "./MemoType/YoutubeMemo";
import MemoOption from "./MemoOption";

const FACTOR = 120;
const MIN = 1;
const MAX = 30;

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
  const color = useMemo(() => randomColor(cardData.id), [cardData.id]);

  useEffect(() => {
    if (!editMode) {
      setShowOption(false);
    }
  }, [editMode]);

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

  const updateMemo = ({ type, payload }) => {
    const newData = Object.assign(cardData);
    newData.content = {
      type,
      payload,
    };
    updateData(newData);
  };

  const handleOption = option => {
    if (option === "delete") {
      removeData(cardData.id);
    } else if (option === "youtube") {
      /**
       * type 1 : https://www.youtube.com/watch?v=J8TonSFgDk4
       * type 2 : https://youtu.be/waIZiufYDjM
       */
      const url = prompt("복사한 유튜브 주소를 입력해주세요.") || "";
      const parsedUrl = parseUrl(url);
      const newVideoId = parsedUrl.query.v;
      if (newVideoId !== undefined) {
        // type 1
        updateMemo({ type: "youtube", payload: newVideoId });
      } else {
        // type 2
        const splitUrl = url.split("/");
        if (splitUrl.length > 3 && splitUrl[2] === "youtu.be") {
          updateMemo({ type: "youtube", payload: splitUrl[3] });
        }
      }
      setShowOption(false);
    } else if (option === "text") {
      updateMemo({ type: "text", payload: "Something Write Here." });
      setShowOption(false);
    } else if (option === "image") {
      updateMemo({ type: "image", payload: "" });
      setShowOption(false);
    }
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
      minWidth={MIN * FACTOR}
      minHeight={MIN * FACTOR}
      maxWidth={MAX * FACTOR}
      maxHeight={MAX * FACTOR}
      resizeGrid={[MIN * FACTOR, MIN * FACTOR]}
      dragGrid={[MIN * FACTOR, MIN * FACTOR]}
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
            <MemoOption
              type="image"
              handleOption={handleOption}
              style={{
                width: `${MIN * FACTOR}px`,
                height: `${MIN * FACTOR}px`,
                top: `-${MIN * FACTOR}px`,
                left: `0px`,
              }}
            />
            <MemoOption
              type="youtube"
              handleOption={handleOption}
              style={{
                width: `${MIN * FACTOR}px`,
                height: `${MIN * FACTOR}px`,
                top: `-${MIN * FACTOR}px`,
                left: `${MIN * FACTOR}px`,
              }}
            />
            <MemoOption
              type="text"
              handleOption={handleOption}
              style={{
                width: `${MIN * FACTOR}px`,
                height: `${MIN * FACTOR}px`,
                top: `-${MIN * FACTOR}px`,
                left: `${MIN * FACTOR * 2}px`,
              }}
            />
            <MemoOption
              type="delete"
              handleOption={handleOption}
              style={{
                width: `${MIN * FACTOR}px`,
                height: `${MIN * FACTOR}px`,
                bottom: `-${MIN * FACTOR}px`,
                left: `0px`,
                color: "#ab0000",
              }}
            />
          </>
        )}
        <Content>
          {cardData.content === undefined && (
            <Overlay bgColor={color} onDoubleClick={handleDblClickOverlay}>
              <span>Blank</span>
            </Overlay>
          )}
          {cardData.content && cardData.content.type === "youtube" && (
            <YoutubeMemo cardData={cardData} />
          )}
          {cardData.content && cardData.content.type === "text" && (
            <TextMemo cardData={cardData} updateMemo={updateMemo} />
          )}
          {cardData.content && cardData.content.type === "image" && (
            <ImageMemo cardData={cardData} updateMemo={updateMemo} />
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

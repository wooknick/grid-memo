/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/aria-role */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const EditableDiv = styled.div`
  width: 100%;
  height: 100%;
  font-size: 20px;
  line-height: 28px;
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

const TextMemo = ({ cardData, updateMemo }) => {
  const [textContent, setTextContent] = useState("Something Write Here.");
  let debounceT;

  useEffect(() => {
    if (cardData.content && cardData.content.type === "text") {
      setTextContent(cardData.content.payload);
    }
  }, [cardData]);

  const handleEditableKeyDown = e => {
    if (debounceT) {
      clearTimeout(debounceT);
    }
    debounceT = setTimeout(() => {
      const newTextContent = e.target.innerHTML;
      updateMemo({ type: "text", payload: newTextContent });
    }, 500);
  };

  return (
    <Wrapper>
      <EditableDiv
        contentEditable="true"
        role="editor"
        onKeyDown={handleEditableKeyDown}
        dangerouslySetInnerHTML={{ __html: textContent }}
      />
    </Wrapper>
  );
};

export default TextMemo;

TextMemo.propTypes = {
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
  updateMemo: PropTypes.func.isRequired,
};

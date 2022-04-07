/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/aria-role */
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import PropTypes from "prop-types";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const ImageInput = styled.div`
  width: 100%;
  height: 100%;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #5f646b;
  color: white;
  text-transform: uppercase;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const ImageMemo = ({ cardData, updateMemo }) => {
  const onDrop = useCallback(
    acceptedFiles => {
      acceptedFiles.forEach(file => {
        const reader = new FileReader();

        reader.onload = e => {
          updateMemo({ type: "image", payload: e.target.result });
        };

        reader.readAsDataURL(file);
      });
    },
    [updateMemo],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/jpeg,image/png",
  });
  return (
    <Wrapper>
      {cardData.content &&
        cardData.content.type === "image" &&
        cardData.content.payload === "" && (
          <ImageInput {...getRootProps()} role="editor">
            <input {...getInputProps()} />
            <span>Click n Add Image</span>
          </ImageInput>
        )}
      {cardData.content &&
        cardData.content.type === "image" &&
        cardData.content.payload !== "" && (
          <Image alt="memoImage" src={cardData.content.payload} />
        )}
    </Wrapper>
  );
};

export default ImageMemo;

ImageMemo.propTypes = {
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

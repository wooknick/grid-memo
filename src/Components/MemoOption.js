import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #333333;
  background-color: #eeeeee;
  position: absolute;
  font-size: 24px;
  text-transform: uppercase;
  &:hover {
    cursor: pointer;
    background-color: #cccccc;
  }
`;

const MemoOption = ({ type, handleOption, style }) => (
  <Wrapper
    style={style}
    onClick={() => handleOption(type)}
    onTouchStart={() => handleOption(type)}
  >
    {type}
  </Wrapper>
);
export default MemoOption;

MemoOption.propTypes = {
  type: PropTypes.string.isRequired,
  handleOption: PropTypes.func.isRequired,
  style: PropTypes.any.isRequired,
};

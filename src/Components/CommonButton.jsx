import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const CommonButton = (props) => {
  return (
    <>
      <props.buttonName onClick={props.onClick}>{props.title}</props.buttonName>
    </>
  );
};

export default CommonButton;

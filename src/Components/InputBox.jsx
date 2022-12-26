import { TextField } from "@mui/material";
import React from "react";

const InputBox = (props) => {
  return (
    <>
      <props.inputName
        label={props.label}
        variant={props.variant}
        sx={props.sx}
        className={props.className}
      />
    </>
  );
};

export default InputBox;

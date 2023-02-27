import { TextField } from "@mui/material";
import { style, styled } from "@mui/system";

import React from "react";
const CommonInputCSS = styled(TextField)({
  "& label.Mui-focused": {
    color: "#5F34F5",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#5F34F5",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#d1d1d1",
    },
    "&:hover fieldset": {
      borderColor: "#5F34F5",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#5F34F5",
    },
  },
});
const InputBox = (props) => {
  return (
    <>
      <CommonInputCSS
        onKeyUp={props.onKeyUp}
        onChange={props.onChange}
        label={props.label}
        variant={props.variant}
        sx={props.sx}
        className={props.className}
        name={props.name}
        type={props.type}
        value={props.value}
      />
    </>
  );
};

export default InputBox;

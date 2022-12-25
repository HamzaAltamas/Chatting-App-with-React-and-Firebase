import { TextField } from "@mui/material";
import React from "react";

const InputBox = ({ label, variant, sx, className }) => {
  return (
    <>
      <TextField
        label={label}
        variant={variant}
        sx={sx}
        className={className}
      />
    </>
  );
};

export default InputBox;

import { Box } from "@mui/system";
import React from "react";

const Image = ({ src, imageStyle, onClick }) => {
  return (
    <>
      <img onClick={onClick} style={imageStyle} src={src} />
    </>
  );
};

export default Image;

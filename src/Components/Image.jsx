import { Box } from "@mui/system";
import React from "react";

const Image = ({ src, imageStyle }) => {
  return (
    <>
      <img style={imageStyle} src={src} />
    </>
  );
};

export default Image;

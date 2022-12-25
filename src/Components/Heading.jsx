import { Typography } from "@mui/material";
import React from "react";

const Heading = ({ variant, component, title, sx }) => {
  return (
    <>
      <Typography
        variant={variant}
        fontFamily='"Nunito", sans-serif'
        component={component}
        sx={sx}
      >
        {title}
      </Typography>
    </>
  );
};

export default Heading;

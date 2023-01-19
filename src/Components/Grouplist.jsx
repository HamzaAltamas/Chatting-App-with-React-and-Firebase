import { Box, height } from "@mui/system";
import React from "react";

const Grouplist = () => {
  return (
    <>
      <Box
        sx={{
          width: { md: "32%" },
          height: { xs: "300px", sm: "350px", md: "48%" },
          background: "red",
          borderRadius: "15px",
          marginTop: { xs: "20px", sm: "20px", md: "0" },
        }}
      ></Box>
    </>
  );
};

export default Grouplist;

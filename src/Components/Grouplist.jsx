import { Box, height } from "@mui/system";
import React from "react";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";

const Grouplist = ({ title }) => {
  return (
    <>
      <Box
        sx={{
          width: { md: "50%", lg: "32%" },
          height: { xs: "300px", sm: "350px", md: "48%" },
          background: "white",
          borderRadius: "15px",
          marginTop: { xs: "20px", sm: "20px", md: "0" },
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
      >
        <ListHeader title={title} />
        <Box
          sx={{
            height: "80%",
            width: "100%",
            padding: "0 20px",
            overflowY: "scroll",
          }}
        >
          <ul>
            <ListItems button="true" />
            <ListItems button="true" />
            <ListItems button="true" />
            <ListItems button="true" />
            <ListItems button="true" />
            <ListItems button="true" />
            <ListItems button="true" />
            <ListItems button="true" />
          </ul>
        </Box>
      </Box>
    </>
  );
};

export default Grouplist;

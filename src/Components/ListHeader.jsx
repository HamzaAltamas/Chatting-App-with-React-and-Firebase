import { Box } from "@mui/system";
import React from "react";
import { HiDotsVertical } from "react-icons/hi";
const ListHeader = ({ title }) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "20%",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#5f34f5",
          color: "#fff",
        }}
      >
        <h3>{title}</h3>
        <HiDotsVertical />
      </Box>
    </>
  );
};

export default ListHeader;

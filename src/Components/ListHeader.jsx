import { List } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import ListButton from "./ListButton";
const ListHeader = ({ title, headerButton, onClick }) => {
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
        {headerButton ? (
          <ListButton
            onClick={onClick}
            title="Create Group"
            style={{ background: "white", color: "#5f34f5" }}
          />
        ) : (
          <HiDotsVertical />
        )}
      </Box>
    </>
  );
};

export default ListHeader;

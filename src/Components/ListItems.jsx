import Image from "../Components/Image";
import { Box } from "@mui/system";
import React from "react";
import { Typography } from "@mui/material";
import ListButton from "./ListButton";

const ListItems = ({ name, button, date, buttonName }) => {
  let ImageStyle = {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
  };
  return (
    <li>
      <Box
        sx={{
          padding: "15px 0",
          borderTop: "1px solid #d1d1d1",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "28%",

            display: "flex",
            alignItems: "center",
          }}
        >
          <Image imageStyle={ImageStyle} src="../src/assets/images/dp.png" />
        </Box>
        <Box
          sx={{
            width: "42%",
          }}
        >
          <h4>User Name</h4>
          <p style={{ color: "#8c8c8c", fontSize: "12px" }}>Hi Guys, Wassup!</p>
        </Box>
        <Box
          sx={{
            width: "30%",

            display: "flex",
            justifyContent: "end",
          }}
        >
          {button ? (
            <ListButton title={buttonName} />
          ) : (
            <p style={{ color: "#8c8c8c", fontSize: "10px" }}>Today, 2:31pm</p>
          )}
        </Box>
      </Box>
    </li>
  );
};

export default ListItems;

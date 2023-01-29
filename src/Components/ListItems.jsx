import Image from "../Components/Image";
import { Box } from "@mui/system";
import React from "react";
import { Avatar, Typography } from "@mui/material";
import ListButton from "./ListButton";

const ListItems = ({
  name,
  button,
  date,
  buttonName,
  profession,
  onClick,
  doubleButton,
  secontBtnName,
  secondButtonOnclick,
  imgsrc,
}) => {
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
            width: "15%",

            display: "flex",
            alignItems: "center",
          }}
        >
          {imgsrc ? (
            <Avatar
              alt="Remy Sharp"
              src={imgsrc}
              sx={{ width: 56, height: 56 }}
            />
          ) : (
            <Avatar sx={{ width: 56, height: 56 }} />
          )}
        </Box>
        <Box
          sx={{
            width: "42%",
          }}
        >
          <h4>{name}</h4>
          <p style={{ color: "#8c8c8c", fontSize: "12px" }}>
            {date ? date : profession}
          </p>
        </Box>
        <Box
          sx={{
            width: "30%",

            display: "flex",
            justifyContent: "end",
          }}
        >
          {!button ? (
            <p style={{ color: "#8c8c8c", fontSize: "10px" }}>{date}</p>
          ) : !doubleButton ? (
            <ListButton onClick={onClick} title={buttonName} />
          ) : (
            <div style={{ display: "flex", columnGap: "10px" }}>
              <ListButton onClick={onClick} title={buttonName} />
              <ListButton
                onClick={secondButtonOnclick}
                secontBtnName={secontBtnName}
                title={buttonName}
              />
            </div>
          )}
        </Box>
      </Box>
    </li>
  );
};

export default ListItems;

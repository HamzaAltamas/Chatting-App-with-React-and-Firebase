import React from "react";
import { BsPlusLg } from "react-icons/bs";

const ListButton = ({ title, onClick, secontBtnName, style }) => {
  return (
    <button style={style} className="listButton" onClick={onClick}>
      {title == "+" ? (
        <BsPlusLg style={{ marginTop: "5px" }} />
      ) : secontBtnName ? (
        secontBtnName
      ) : (
        title
      )}
    </button>
  );
};

export default ListButton;
``;

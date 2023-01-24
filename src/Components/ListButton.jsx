import React from "react";
import { BsPlusLg } from "react-icons/bs";

const ListButton = ({ title, onClick, secontBtnName }) => {
  return (
    <button className="listButton" onClick={onClick}>
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

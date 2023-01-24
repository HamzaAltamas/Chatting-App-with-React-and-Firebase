import React from "react";
import { BsPlusLg } from "react-icons/bs";

const ListButton = ({ title, onClick }) => {
  return (
    <button className="listButton" onClick={onClick}>
      {title == "+" ? <BsPlusLg style={{ marginTop: "5px" }} /> : title}
    </button>
  );
};

export default ListButton;

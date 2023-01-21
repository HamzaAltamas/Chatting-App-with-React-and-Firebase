import React from "react";
import { BsPlusLg } from "react-icons/bs";

const ListButton = ({ title }) => {
  return (
    <button className="listButton">
      {title == "+" ? <BsPlusLg style={{ marginTop: "5px" }} /> : title}
    </button>
  );
};

export default ListButton;

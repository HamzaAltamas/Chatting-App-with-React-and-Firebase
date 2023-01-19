import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Message = () => {
  let data = useSelector((state) => state);
  let navigate = useNavigate();
  useEffect(() => {
    if (!data.userData.userInfo) {
      navigate("/login");
    }
  }, []);
  return <div>Message</div>;
};

export default Message;

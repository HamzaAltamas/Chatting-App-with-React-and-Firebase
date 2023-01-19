import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  let data = useSelector((state) => state);
  let navigate = useNavigate();
  useEffect(() => {
    if (!data.userData.userInfo) {
      navigate("/login");
    }
  }, []);
  return <div>Notification</div>;
};

export default Notification;

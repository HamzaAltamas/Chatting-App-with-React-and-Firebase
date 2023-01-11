import React, { useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../Slices/userSlices";

const Home = () => {
  let disp = useDispatch();
  let navigate = useNavigate();
  let data = useSelector((state) => state);

  useEffect(() => {
    if (!data.userData.userInfo) {
      navigate("/login");
    }
  }, []);

  const auth = getAuth();
  //  track user login or logout
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     disp(activeUser(user.uid));
  //   } else {
  //     navigate("/login");
  //   }
  // });
  // // track user login or logout

  let logout = () => {
    signOut(auth).then(() => {
      disp(activeUser(null));
      localStorage.clear("userInfo");
      navigate("/");
    });
  };

  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;

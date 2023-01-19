import React from "react";
import Registration from "./Pages/Registration";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Routes,
  Router,
} from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import ForgotPassword from "./Pages/ForgotPassword";
import Mainpage from "./Pages/Mainpage";
import Rootlayout from "./Components/Rootlayout";
import Message from "./Pages/Message";
import Notification from "./Pages/Notification";
import Settings from "./Pages/Settings";

let router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Mainpage />}></Route>
      <Route path="/registration" element={<Registration />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/forgotpass" element={<ForgotPassword />}></Route>
      <Route path="/chattingup" element={<Rootlayout />}>
        <Route index element={<Home />}></Route>
        <Route path="message" element={<Message />}></Route>
        <Route path="notification" element={<Notification />}></Route>
        <Route path="settings" element={<Settings />}></Route>
      </Route>
    </Route>
  )
);

const App = () => {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
};

export default App;

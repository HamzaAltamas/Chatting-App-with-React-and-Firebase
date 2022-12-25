import React from "react";
import { Link } from "react-router-dom";

const AuthenticationLink = ({ className, title, href, hrefTitle, style }) => {
  return (
    <>
      <p className={className} style={style}>
        {title} <Link to={href}>{hrefTitle} </Link>
      </p>
    </>
  );
};

export default AuthenticationLink;

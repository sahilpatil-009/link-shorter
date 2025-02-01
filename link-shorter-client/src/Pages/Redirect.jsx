import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const Redirect = () => {
  const { shortLink } = useParams();

  useEffect(() => {
    window.location.href = `https://shortlink-whlp.onrender.com/${shortLink}`;
  }, [shortLink]);

  return (
    <div>
      <h2>Redirecting...</h2>
    </div>
  );
};

export default Redirect;

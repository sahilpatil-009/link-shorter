import React from "react";
import { TailSpin } from "react-loader-spinner";
const Loader = () => {
  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        inset: 0,
        position: "fixed",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        zIndex:100,
      }}
    >
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="#1B48DA"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Loader;

import React from "react";

const Toolbar = () => (
  <div style={{ padding: "10px", background: "#f4f4f4", display: "flex", gap: "10px" }}>
    <button onClick={() => window.location.reload()}>Reset Diagram</button>
  </div>
);

export default Toolbar;

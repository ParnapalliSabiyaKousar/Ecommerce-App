import React from "react";
import Products from "./Products";

function App() {
  return (
    <div>

      {/* TOP HEADER */}
      <header style={styles.header}>
        <h2>🛍 My Shop (Meesho Clone)</h2>
      </header>

      {/* MAIN */}
      <Products />

    </div>
  );
}

const styles = {
  header: {
    backgroundColor: "#ff3f6c",
    color: "white",
    padding: "15px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default App;
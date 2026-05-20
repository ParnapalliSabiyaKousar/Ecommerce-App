import React, { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState([]);

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFiltered(data);
      });
  }, []);

  // ================= LOAD CART =================
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // ================= FILTER SYSTEM =================
  useEffect(() => {
    let result = [...products];

    if (category !== "all") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === category
      );
    }

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, category, products]);

  // ================= ADD TO CART =================
  const addToCart = (product) => {
    const updated = [...cart, product];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ================= REMOVE FROM CART =================
  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* ================= TOP BAR ================= */}
      <div style={styles.topBar}>

        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option value="all">All</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
          <option value="jewellery">Jewellery</option>
        </select>

        {/* CART COUNT */}
        <div style={styles.cartBox}>
          🛒 Cart: {cart.length}
        </div>

      </div>

      {/* ================= PRODUCTS GRID ================= */}
      <div style={styles.grid}>

        {filtered.map((p) => (
          <div key={p._id} style={styles.card}>

            <img src={p.image} alt="" style={styles.img} />

            <h4>{p.name}</h4>

            <p style={styles.price}>₹{p.price}</p>

            <p style={styles.desc}>{p.description}</p>

            <button
              style={styles.btn}
              onClick={() => addToCart(p)}
            >
              Add to Cart
            </button>

          </div>
        ))}

      </div>

      {/* ================= CART PREVIEW ================= */}
      <h3 style={{ marginTop: "40px" }}>🛒 My Cart</h3>

      <div>
        {cart.map((item) => (
          <div key={item._id} style={styles.cartItem}>

            <img src={item.image} width="50" />

            <p>{item.name}</p>

            <button
              onClick={() => removeFromCart(item._id)}
              style={styles.removeBtn}
            >
              Remove
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}

// ================= STYLES =================
const styles = {

  topBar: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  search: {
    padding: "10px",
    width: "200px",
  },

  select: {
    padding: "10px",
  },

  cartBox: {
    padding: "10px",
    backgroundColor: "#ff3f6c",
    color: "white",
    borderRadius: "5px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },

  card: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
  },

  img: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
  },

  price: {
    color: "green",
    fontWeight: "bold",
  },

  desc: {
    fontSize: "12px",
    color: "#555",
  },

  btn: {
    backgroundColor: "#ff3f6c",
    color: "white",
    border: "none",
    padding: "8px",
    cursor: "pointer",
    marginTop: "5px",
  },

  cartItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },

  removeBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px",
  },
};

export default Products;
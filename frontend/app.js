/* ================= API ================= */

const API =
  "http://localhost:5000/api/products";


/* ================= GLOBAL PRODUCTS ================= */

let allProducts = [];


/* ================= GET USER ================= */

function getUser() {

  return JSON.parse(
    localStorage.getItem("user")
  );
}


/* ================= CHECK ADMIN ================= */

function isAdmin() {

  const user = getUser();

  return (
    user &&
    user.role === "admin"
  );
}


/* ================= LOAD PRODUCTS ================= */

async function loadProducts() {

  try {

    const container =
      document.getElementById("products");

    if (!container) return;


    const res =
      await fetch(API);


    if (!res.ok) {

      throw new Error(
        "Failed to fetch products"
      );
    }


    const products =
      await res.json();


    // ================= FIX CATEGORY =================

    allProducts =
      products.map(product => ({

        ...product,

        category:
          product.category
          ?.toLowerCase()
          .trim()

      }));


    displayProducts(allProducts);

  }

  catch (err) {

    console.log(err);

    const container =
      document.getElementById("products");

    if (container) {

      container.innerHTML = `

        <h2
          style="
            text-align:center;
            color:red;
          "
        >
          Error Loading Products ❌
        </h2>

      `;
    }
  }
}


/* ================= DISPLAY PRODUCTS ================= */

function displayProducts(products) {

  const container =
    document.getElementById("products");


  if (!container) return;


  container.innerHTML = "";


  // ================= NO PRODUCTS =================

  if (products.length === 0) {

    container.innerHTML = `

      <h2
        style="
          text-align:center;
          width:100%;
        "
      >
        No Products Found 😔
      </h2>

    `;

    return;
  }


  products.forEach(product => {

    const div =
      document.createElement("div");

    div.className = "card";


    div.innerHTML = `

      <img

        src="${
          product.image
            ? product.image
            : "https://via.placeholder.com/300"
        }"

        class="product-img"

        onerror="
          this.src='https://via.placeholder.com/300'
        "
      >


      <h2>
        ${product.name}
      </h2>


      <p>
        ${product.description}
      </p>


      <p>

        Category:
        <b>
          ${product.category}
        </b>

      </p>


      <h3>
        ₹${product.price}
      </h3>


      <!-- ================= ADD TO CART ================= -->

      <button

        class="btn"

        onclick='addToCart(
          "${product._id}",
          "${product.name}",
          ${product.price},
          "${product.image}"
        )'
      >

        Add To Cart 🛒

      </button>


      <!-- ================= DELETE BUTTON ================= -->

      ${

        isAdmin()

        ?

        `

          <button

            onclick="
              deleteProduct('${product._id}')
            "

            style="
              background:red;
              color:white;
              margin-top:10px;
              border:none;
              padding:10px;
              border-radius:8px;
              cursor:pointer;
              width:100%;
            "
          >

            Delete ❌

          </button>

        `

        :

        ""

      }

    `;

    container.appendChild(div);

  });
}


/* ================= FILTER CATEGORY ================= */

function filterCategory(category) {

  category =
    category.toLowerCase().trim();


  // ================= SHOW ALL =================

  if (category === "all") {

    displayProducts(allProducts);

    return;
  }


  // ================= FILTER =================

  const filtered =
    allProducts.filter(product =>

      product.category === category
    );


  displayProducts(filtered);
}


/* ================= SEARCH PRODUCTS ================= */

function searchProducts() {

  const search =
    document
      .getElementById("searchInput")
      .value
      .toLowerCase()
      .trim();


  const filtered =
    allProducts.filter(product =>

      product.name
        .toLowerCase()
        .includes(search)
    );


  displayProducts(filtered);
}


/* ================= DELETE PRODUCT ================= */

async function deleteProduct(id) {

  // ================= ADMIN CHECK =================

  if (!isAdmin()) {

    alert(
      "Only admin can delete products"
    );

    return;
  }


  const confirmDelete =
    confirm(
      "Delete this product?"
    );


  if (!confirmDelete) return;


  try {

    const token =
      localStorage.getItem("token");


    const res =
      await fetch(
        `${API}/${id}`,
        {

          method: "DELETE",

          headers: {

            Authorization:
              "Bearer " + token
          }
        }
      );


    const data =
      await res.json();


    alert(
      data.message ||
      "Deleted successfully"
    );


    // ================= RELOAD =================

    loadProducts();

  }

  catch (err) {

    console.log(err);

    alert("Delete failed ❌");
  }
}


/* ================= ADD TO CART ================= */

function addToCart(
  id,
  name,
  price,
  image
) {

  let cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];


  cart.push({

    id,

    name,

    price,

    image
  });


  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );


  alert("✅ Added to cart");
}


/* ================= LOAD CART ================= */

function loadCart() {

  const cartItems =
    document.getElementById("cartItems");

  const totalBox =
    document.getElementById("total");


  if (!cartItems) return;


  let cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];


  cartItems.innerHTML = "";


  let total = 0;


  cart.forEach((item, index) => {

    total += Number(item.price);


    const li =
      document.createElement("li");


    li.innerHTML = `

      <div
        style="
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:10px;
        "
      >

        <img
          src="${
            item.image
              ? item.image
              : "https://via.placeholder.com/100"
          }"

          style="
            width:60px;
            height:60px;
            object-fit:cover;
            border-radius:8px;
          "
        >

        <div>

          <h4>
            ${item.name}
          </h4>

          <p>
            ₹${item.price}
          </p>

          <button
            onclick="
              removeItem(${index})
            "
          >
            ❌ Remove
          </button>

        </div>

      </div>

    `;

    cartItems.appendChild(li);

  });


  if (totalBox) {

    totalBox.innerText =
      "Total: ₹" + total;
  }
}


/* ================= REMOVE ITEM ================= */

function removeItem(index) {

  let cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];


  cart.splice(index, 1);


  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );


  loadCart();
}


/* ================= LOGOUT ================= */

function logout() {

  localStorage.removeItem("token");

  localStorage.removeItem("user");

  localStorage.removeItem("cart");


  window.location.href =
    "login.html";
}


/* ================= INIT ================= */

loadProducts();

loadCart();
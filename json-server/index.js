const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Path to the JSON file
const productListFilePath = "product-list.json";

// GET Route to fetch all products
app.get("/products", (req, res) => {
  fs.readFile(productListFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(JSON.parse(data));
  });
});

// POST Route to add a new product
app.post("/products", (req, res) => {
  const newProduct = req.body;

  fs.readFile(productListFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    const productList = JSON.parse(data);
    productList.products.push(newProduct);

    fs.writeFile(
      productListFilePath,
      JSON.stringify(productList, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.status(201).send("Product added successfully");
      }
    );
  });
});

// PUT Route to update an existing product
app.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;

  fs.readFile(productListFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    const productList = JSON.parse(data);
    const index = productList.products.findIndex(
      (product) => product.id === productId
    );
    if (index === -1) {
      res.status(404).send("Product not found");
      return;
    }
    productList.products[index] = {
      ...productList.products[index],
      ...updatedProduct,
    };

    fs.writeFile(
      productListFilePath,
      JSON.stringify(productList, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.status(200).send("Product updated successfully");
      }
    );
  });
});

// DELETE Route to remove a product
app.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);

  fs.readFile(productListFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    const productList = JSON.parse(data);
    const index = productList.products.findIndex(
      (product) => product.id === productId
    );
    if (index === -1) {
      res.status(404).send("Product not found");
      return;
    }
    productList.products.splice(index, 1);

    fs.writeFile(
      productListFilePath,
      JSON.stringify(productList, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.status(200).send("Product removed successfully");
      }
    );
  });
});

app.get("/cart", (req, res) => {
  res.json(cartData);
});

// Route to add an item to the shopping cart
app.post("/cart", (req, res) => {
  const newItem = req.body;
  cartData.cartItems.push(newItem);
  fs.writeFileSync("cart.json", JSON.stringify(cartData, null, 2));
  res.status(201).send("Item added to cart successfully");
});

// Route to update an item in the shopping cart
app.put("/cart/:id", (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;
  const index = cartData.cartItems.findIndex((item) => item.id === itemId);
  if (index !== -1) {
    cartData.cartItems[index] = {
      ...cartData.cartItems[index],
      ...updatedItem,
    };
    fs.writeFileSync("cart.json", JSON.stringify(cartData, null, 2));
    res.send("Item updated in cart successfully");
  } else {
    res.status(404).send("Item not found in cart");
  }
});

// Route to remove an item from the shopping cart
app.delete("/cart/:id", (req, res) => {
  const itemId = req.params.id;
  cartData.cartItems = cartData.cartItems.filter((item) => item.id !== itemId);
  fs.writeFileSync("cart.json", JSON.stringify(cartData, null, 2));
  res.send("Item removed from cart successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

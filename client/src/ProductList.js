import React from "react";
import Product from "./Product";
import TshirtImg from "./tshirt.webp";
import HoodieImg from "./hoodie.webp";
import ShoesImg from "./shoes.png";

// Sample data for products
const products = [
  { id: 1, name: "T-shirt", description: "Solid blue cotton T-shirt", price: 500, image: TshirtImg },
  { id: 2, name: "Hoodie", description: "Cozy grey hoodie", price: 1200, image: HoodieImg },
  { id: 3, name: "Shoes", description: "Comfortable running shoes", price: 2555.00, image: ShoesImg },
];

function ProductList() {
  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Our Products</h2>
      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
            <Product
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;

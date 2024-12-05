import React from "react";
import ProductList from "./ProductList";
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is included
import './App.css';

function App() {
  return (
    <div className="App bg-light">
      <header className="py-3 text-center bg-primary text-white">
        <h1>Welcome to Our Store</h1>
      </header>
      <main className="container py-4">
        <ProductList />
      </main>
      <footer className="text-center py-3 bg-dark text-white">
        <p>&copy; {new Date().getFullYear()} Our Store. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

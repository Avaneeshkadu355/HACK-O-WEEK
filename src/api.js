
const API_BASE_URL = "http://localhost:5001/api";

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to load products from the server.");
  }

  return response.json();
}

export async function createProduct(product) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create product.");
  }

  return data;
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product.");
  }

  return data;
}

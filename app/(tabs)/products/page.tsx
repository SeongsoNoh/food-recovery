import ListProduct from "@/components/list-product";
import db from "@/lib/db";

async function getProducts() {
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
  });
  return products;
}

export default async function Product() {
  const products = await getProducts();
  return (
    <div>
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
    </div>
  );
}

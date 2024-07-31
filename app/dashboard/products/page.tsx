import { db } from "@/server";
import placeholder from "@/public/placeholder_small.jpg";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const Products = async () => {
  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) throw new Error("상품이 존재하지 않습니다.");

  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
      image: placeholder.src,
    };
  });
  if (!dataTable) throw new Error("테이블 정보가 존재하지않습니다.  ");
  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
};

export default Products;

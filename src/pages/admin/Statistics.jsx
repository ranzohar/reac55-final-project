import { ProductsBarChart, ProductsPieChart } from "@/admin_components";

const Statistics = () => {
  return (
    <div className="card-statistics">
      <ProductsPieChart />
      <ProductsBarChart />
    </div>
  );
};

export default Statistics;

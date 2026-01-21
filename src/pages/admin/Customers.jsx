import CustomersTable from "../../admin_components/CustomersTable";

const Customers = () => {
  return (
    <div
      className="
      max-w-xl
      border
      border-gray-300
      dark:border-gray-700
      rounded-xl
      bg-white
      dark:bg-gray-900
      shadow-sm"
    >
      <CustomersTable />
    </div>
  );
};

export default Customers;

import useUsers from "../firebase/hooks/useUsers";
import WebpageTable from "../components/WebpageTable";

const CustomersTable = () => {
  const users = useUsers();
  if (users.length === 0) {
    return;
  }
  console.log(users);
  const tableData = users.map((user) => {
    console.log(user.joinDate);

    return [user.fname + " " + user.lname, user.joinDate, []];
  });
  return (
    <WebpageTable
      headers={["Full Name", "Joined At", "Products Bought"]}
      data={tableData}
    />
  );
};

export default CustomersTable;

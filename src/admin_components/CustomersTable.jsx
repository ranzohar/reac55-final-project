import useUsers from "../firebase/hooks/useUsers";
import WebpageTable from "../components/WebpageTable";
import { useParams } from "react-router-dom";

const CustomersTable = () => {
  const { adminId } = useParams();
  const users = useUsers(adminId);
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

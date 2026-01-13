import { useMemo } from "react";
import { useSelector } from "react-redux";
import WebpageTable from "../components/WebpageTable";

const CustomersTable = () => {
  const usersMap = useSelector((state) => state.data.users);

  const tableData = useMemo(() => {
    if (!usersMap) return [];

    return Object.entries(usersMap)
      .map(([id, user]) => ({ id, ...user }))
      .sort((a, b) => {
        const dateA = a.joinDate?.toDate
          ? a.joinDate.toDate()
          : new Date(a.joinDate);
        const dateB = b.joinDate?.toDate
          ? b.joinDate.toDate()
          : new Date(b.joinDate);
        return dateA - dateB;
      })
      .map((user) => [`${user.fname} ${user.lname}`, user.joinDate, []]);
  }, [usersMap]);

  if (!tableData.length) return null;

  return (
    <WebpageTable
      headers={["Full Name", "Joined At", "Products Bought"]}
      data={tableData}
    />
  );
};

export default CustomersTable;

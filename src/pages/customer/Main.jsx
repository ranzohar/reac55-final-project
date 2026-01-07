import Cart from "../../customer_components/Cart";
import SlidingWindow from "../../customer_components/SlidingWindow";
import { useParams, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser } from "../../firebase/firebase-utils";

const CustomerPage = () => {
  const { customerId } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = getUser(customerId, setUser);
    return () => unsubscribe();
  }, [customerId]);

  return (
    <div className="flex">
      <SlidingWindow component={<Cart />} />
      {
        <div className="flex flex-col center-screen">
          Hello, {user.fname}
          <br />
          <Outlet />
        </div>
      }
    </div>
  );
};

export default CustomerPage;

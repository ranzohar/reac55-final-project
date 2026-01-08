import { useLocation, Link } from "react-router-dom";
import { firebaseLogout } from "../firebase/log-utils";

const LinksTab = ({ items }) => {
  const { pathname } = useLocation();
  return (
    <div className="flex gap-6">
      {items.map((item) => {
        const resolvedPath = new URL(item.path, `http://dummy${pathname}`)
          .pathname;
        const isActive = resolvedPath === pathname;

        return !isActive ? (
          <Link
            key={item.path}
            to={item.path}
            className="!text-black dark:!text-white !underline text-sm text-sm"
          >
            {item.name}
          </Link>
        ) : (
          <span key={item.path} className="text-black dark:text-white text-sm">
            {item.name}
          </span>
        );
      })}
      <Link
        to={"/login"}
        className="text-blue-500 !underline text-sm text-sm"
        onClick={firebaseLogout}
      >
        Log Out
      </Link>
    </div>
  );
};

export default LinksTab;

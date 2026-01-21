import { useLocation, Link } from "react-router-dom";
import SignOut from "./SignOut";

const LinksTab = ({ items }) => {
  const { pathname } = useLocation();

  return (
    <div className="flex gap-6 p-2">
      {items.map((item) => {
        const resolvedPath = new URL(item.path, `http://dummy${pathname}`)
          .pathname;
        const isActive = resolvedPath === pathname;

        return !isActive ? (
          <Link
            key={item.path}
            to={item.path}
            className="text-black! dark:text-white! underline! text-sm"
          >
            {item.name}
          </Link>
        ) : (
          <span key={item.path} className="text-black dark:text-white text-sm">
            {item.name}
          </span>
        );
      })}
      <SignOut />
    </div>
  );
};

export default LinksTab;

import { useLocation, Link } from "react-router-dom";

import SignOut from "./SignOut";

const LinksTab = ({ items }) => {
  const { pathname } = useLocation();

  return (
    <div className="card-links">
      {items.map((item) => {
        const resolvedPath = new URL(item.path, `http://dummy${pathname}`)
          .pathname;
        const isActive = resolvedPath === pathname;

        return !isActive ? (
          <Link
            key={item.path}
            to={item.path}
            className={`navigate-link${isActive ? " current" : ""}`}
          >
            {item.name}
          </Link>
        ) : (
          <span key={item.path} className="current-navigate-link">
            {item.name}
          </span>
        );
      })}
      <SignOut />
    </div>
  );
};

export default LinksTab;

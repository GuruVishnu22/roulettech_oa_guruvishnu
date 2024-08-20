import { Link } from "react-router-dom";

const links = [
  { name: "Home", path: "/items", icon: "fa fa-home" },
  { name: "Items", path: "/items", icon: "fa-solid fa-cubes-stacked" },
  { name: "Customers", path: "/items", icon: "fa fa-person" },
  { name: "Logout", path: "/", icon: "fa fa-person" },
];

function Sidebar() {
  const height = window.innerWidth < 768 ? "100%" : "100vh";
  const width = window.innerWidth < 768 ? "100vw" : "100%";
  const isMobile = window.innerWidth < 768;

  return (
    <div
      className="d-flex flex-sm-column bg-light border-end border-bottom border-sm-2 border-dark p-2"
      style={{ height, width }}
    >
      <div className="mt-5 pt-4"></div>
      {links.map((item, index) => (
        <Link
          to={item.path}
          className="btn py-2 mx-1 my-lg-2 text-lg-start"
          key={index}
        >
          <i className={item.icon}></i> {!isMobile && <>&nbsp;&nbsp;&nbsp;</>}{" "}
          {item.name}
        </Link>
      ))}
    </div>
  );
}

export default Sidebar;

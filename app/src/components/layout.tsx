import { Outlet } from "react-router-dom";
import Nav from "./nav";

const Layout = () => {
  return (
    <>
      <Nav />

      <div className="container pt-10">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;

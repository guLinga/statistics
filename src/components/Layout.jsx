import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <h1 className="page-title">统计</h1>
      <nav className="page-nav" role="navigation">
        <NavLink
          to="/attendance"
          className={({ isActive }) => `tab-btn${isActive ? " active" : ""}`}
        >
          <span className="nav-label-long">每日读经打卡及周六日上线</span>
          <span className="nav-label-short">打卡</span>
        </NavLink>
        <NavLink
          to="/duty"
          className={({ isActive }) => `tab-btn${isActive ? " active" : ""}`}
        >
          安排
        </NavLink>
      </nav>
      <Outlet />
    </>
  );
}

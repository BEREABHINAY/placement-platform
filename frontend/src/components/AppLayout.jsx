import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import MiniFooter from "./MiniFooter";

// Shared shell for every authenticated page: persistent nav with back button,
// module links, and the user menu (logout / delete account), plus a compact
// contact footer so support info is never more than a scroll away.
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-void flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <MiniFooter />
    </div>
  );
}

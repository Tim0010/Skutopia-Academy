import { Outlet } from "react-router-dom";

export default function StudentViewCommonLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}

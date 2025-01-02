import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  FileText,
  Home
} from "lucide-react";

export default function ParentViewCommonLayout() {
  const navigate = useNavigate();

  const sidebarItems = [
    {
      icon: Home,
      label: "Dashboard",
      onClick: () => navigate("/parent"),
    },
    {
      icon: Users,
      label: "Child Progress",
      onClick: () => navigate("/parent/child-progress"),
    },
    {
      icon: BookOpen,
      label: "Resources",
      onClick: () => navigate("/parent/resources"),
    },
    {
      icon: MessageSquare,
      label: "Communication",
      onClick: () => navigate("/parent/communication"),
    },
    {
      icon: FileText,
      label: "Reports",
      onClick: () => navigate("/parent/reports"),
    },
  ];

  return (
    <div className="flex">
      <Sidebar items={sidebarItems} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

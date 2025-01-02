import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  BarChart, 
  PlusCircle,
  Home,
  GraduationCap,
  FileEdit
} from "lucide-react";

export default function InstructorViewCommonLayout() {
  const navigate = useNavigate();

  const sidebarItems = [
    {
      icon: Home,
      label: "Dashboard",
      onClick: () => navigate("/instructor"),
    },
    {
      icon: Users,
      label: "Class Management",
      onClick: () => navigate("/instructor/class-management"),
    },
    {
      icon: FileEdit,
      label: "Content Creation",
      onClick: () => navigate("/instructor/content-creation"),
    },
    {
      icon: BarChart,
      label: "Analytics",
      onClick: () => navigate("/instructor/analytics"),
    },
    {
      icon: PlusCircle,
      label: "New Course",
      onClick: () => navigate("/instructor/create-new-course"),
    },
    {
      icon: GraduationCap,
      label: "Resources",
      onClick: () => navigate("/instructor/resources"),
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

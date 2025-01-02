import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  Settings,
  ChevronDown,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  {
    name: "Overview",
    path: "/instructor/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Courses",
    path: "/instructor/dashboard/courses",
    icon: BookOpen,
  },
  {
    name: "Discussions",
    path: "/instructor/dashboard/discussions",
    icon: MessageCircle,
  },
  {
    name: "Settings",
    path: "/instructor/dashboard/settings",
    icon: Settings,
  },
];

export default function InstructorDashboardLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({ item }) => (
    <Link
      to={item.path}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        location.pathname === item.path
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      }`}
    >
      <item.icon className="h-4 w-4" />
      {item.name}
    </Link>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col gap-4 border-r p-6">
        <div className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6" />
          <span>Instructor Portal</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 p-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Instructor Portal
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.path}
                    item={item}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <span className="font-semibold">Instructor Portal</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:p-8 p-4 md:pt-8 pt-20">
        <Outlet />
      </main>
    </div>
  );
}

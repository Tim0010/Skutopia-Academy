import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useCallback } from "react";
import { AuthContext } from "../../context/auth-context";
import { Button } from "../ui/button";
import { Menu, X, LogOut, User, BookOpen, Search, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "../ui/command";
import { searchCourses } from "../../api/search";
import { useToast } from "../ui/use-toast";
import debounce from 'lodash/debounce';
import { Input } from "../ui/input";

export function Navigation() {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const debouncedSearch = useCallback(
    debounce(async (value) => {
      if (!value) return;
      setIsLoading(true);
      try {
        const results = await searchCourses(value);
        setSearchResults(results);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-bold text-primary">Skutopia</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/courses" className="nav-link">
              Courses
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>

            {/* Search */}
            <Button
              variant="ghost"
              className="nav-link"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            {auth?.authenticate ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="nav-link">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="btn-primary">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="nav-link"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/courses" className="block nav-link">
              Courses
            </Link>
            <Link to="/about" className="block nav-link">
              About
            </Link>
            <Link to="/contact" className="block nav-link">
              Contact
            </Link>
            {auth?.authenticate ? (
              <>
                <Link to="/dashboard" className="block nav-link">
                  Dashboard
                </Link>
                <button onClick={logout} className="block w-full text-left text-red-600 hover:text-red-700">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="btn-primary w-full">Sign In</Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Search Dialog */}
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput
          placeholder="Search courses..."
          onValueChange={(value) => debouncedSearch(value)}
          className="border-none focus:ring-0"
        />
        <CommandList>
          {isLoading ? (
            <CommandLoading>
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            </CommandLoading>
          ) : searchResults.length > 0 ? (
            <CommandGroup heading="Courses">
              {searchResults.map((course) => (
                <CommandItem
                  key={course._id}
                  onSelect={() => {
                    navigate(`/courses/${course._id}`);
                    setIsSearchOpen(false);
                  }}
                  className="cursor-pointer hover:bg-primary/5"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{course.title}</span>
                    <span className="text-sm text-gray-500">
                      by {course.instructor.name}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty className="py-6 text-center text-gray-500">
              No courses found.
            </CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </nav>
  );
}

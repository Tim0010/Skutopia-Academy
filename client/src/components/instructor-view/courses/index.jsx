import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit, Search, Plus, Filter, ArrowUpDown } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'no-students'

  // Sort function
  const sortedCourses = [...(listOfCourses || [])].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = sortConfig.key === 'revenue' 
      ? a.pricing * a.students.length
      : sortConfig.key === 'students'
      ? a.students.length
      : a[sortConfig.key];
      
    const bValue = sortConfig.key === 'revenue'
      ? b.pricing * b.students.length
      : sortConfig.key === 'students'
      ? b.students.length
      : b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter function
  const filteredCourses = sortedCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' 
      ? true 
      : filterStatus === 'active' 
      ? course.students.length > 0
      : course.students.length === 0;
    return matchesSearch && matchesFilter;
  });

  const requestSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
          <Button
            onClick={() => {
              setCurrentEditedCourseId(null);
              setCourseLandingFormData(courseLandingInitialFormData);
              setCourseCurriculumFormData(courseCurriculumInitialFormData);
              navigate("/instructor/create-new-course");
            }}
            className="p-6 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[120px]">
                  <Filter className="w-4 h-4 mr-2" />
                  {filterStatus === 'all' ? 'All' : filterStatus === 'active' ? 'Active' : 'No Students'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Courses</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('active')}>Active Courses</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('no-students')}>No Students</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">
                    <Button variant="ghost" onClick={() => requestSort('title')} className="flex items-center">
                      Course
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('students')} className="flex items-center">
                      Students
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('revenue')} className="flex items-center">
                      Revenue
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      {searchTerm 
                        ? "No courses found matching your search"
                        : "No courses created yet. Create your first course!"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-md">
                            {item.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.students.length}</TableCell>
                      <TableCell>ZMK {(item.pricing * item.students.length).toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.students.length > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.students.length > 0 ? 'Active' : 'No Students'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => {
                              setCurrentEditedCourseId(item._id);
                              navigate(`/instructor/edit-course/${item._id}`);
                            }}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Delete className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorCourses;

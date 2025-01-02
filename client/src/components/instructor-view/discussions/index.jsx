import { useContext, useEffect, useState } from "react";
import { InstructorContext } from "@/context/instructor-context";
import { getDiscussionStatsService, getCourseDiscussionsService, togglePinDiscussionService, toggleResolveDiscussionService, flagDiscussionService, deleteDiscussionService } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Search,
  Pin,
  Trash2,
  MoreVertical,
  Filter,
  ArrowUpDown,
  Clock,
  UserCircle,
  Flag,
  ThumbsUp,
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function InstructorDiscussions({ listOfCourses }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);

  useEffect(() => {
    if (selectedCourse) {
      fetchDiscussions();
      fetchStats();
    }
  }, [selectedCourse]);

  async function fetchDiscussions() {
    try {
      const response = await getCourseDiscussionsService(selectedCourse._id);
      if (response?.success) {
        setDiscussions(response.data);
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  }

  async function fetchStats() {
    try {
      const response = await getDiscussionStatsService(selectedCourse._id);
      if (response?.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  const filteredAndSortedDiscussions = discussions
    .filter((discussion) => {
      const matchesSearch =
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === "all") return matchesSearch;
      if (filterStatus === "resolved") return matchesSearch && discussion.isResolved;
      if (filterStatus === "unresolved") return matchesSearch && !discussion.isResolved;
      if (filterStatus === "pinned") return matchesSearch && discussion.isPinned;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "mostReplies") return b.replies.length - a.replies.length;
      if (sortBy === "leastReplies") return a.replies.length - b.replies.length;
      return 0;
    });

  const handleDiscussionAction = async (discussionId, action) => {
    try {
      let response;
      switch (action) {
        case "pin":
          response = await togglePinDiscussionService(discussionId);
          break;
        case "resolve":
          response = await toggleResolveDiscussionService(discussionId);
          break;
        case "flag":
          response = await flagDiscussionService(discussionId);
          break;
        case "delete":
          response = await deleteDiscussionService(discussionId);
          break;
        default:
          return;
      }

      if (response?.success) {
        // Refresh discussions after action
        await fetchDiscussions();
        await fetchStats();
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Discussions</h2>
          <p className="text-muted-foreground">
            Monitor and manage student discussions across your courses
          </p>
        </div>
        <Select value={selectedCourse?._id || ""} onValueChange={(value) => {
          const course = listOfCourses.find(c => c._id === value);
          setSelectedCourse(course);
        }}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {listOfCourses.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCourse && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Discussions
                </CardTitle>
                <MessageCircle className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalDiscussions || 0}</div>
                <p className="text-xs opacity-80">Across all sections</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Resolved
                </CardTitle>
                <CheckCircle className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.resolvedDiscussions || 0}</div>
                <Progress
                  value={(stats?.resolvedDiscussions / stats?.totalDiscussions) * 100 || 0}
                  className="mt-2 bg-white/20"
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending
                </CardTitle>
                <AlertCircle className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.unresolvedDiscussions || 0}</div>
                <p className="text-xs opacity-80">Require attention</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Engagement Rate
                </CardTitle>
                <ThumbsUp className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.engagementRate ? `${Math.round(stats.engagementRate)}%` : '0%'}
                </div>
                <Progress
                  value={stats?.engagementRate || 0}
                  className="mt-2 bg-white/20"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Discussion Management</CardTitle>
                  <CardDescription>
                    View and manage all course discussions
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[130px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="unresolved">Unresolved</SelectItem>
                      <SelectItem value="pinned">Pinned</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[150px]">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="mostReplies">Most Replies</SelectItem>
                      <SelectItem value="leastReplies">Least Replies</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search discussions..."
                      className="pl-8 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredAndSortedDiscussions.map((discussion) => (
                      <motion.div
                        key={discussion._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className={`border-l-4 ${
                          discussion.isResolved 
                            ? "border-l-green-500" 
                            : discussion.isPinned 
                            ? "border-l-purple-500"
                            : "border-l-yellow-500"
                        }`}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar>
                                  <AvatarImage src={discussion.userAvatar} />
                                  <AvatarFallback>
                                    {discussion.userName.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{discussion.title}</h3>
                                    {discussion.isPinned && (
                                      <Badge variant="secondary">
                                        <Pin className="h-3 w-3 mr-1" />
                                        Pinned
                                      </Badge>
                                    )}
                                    {discussion.isResolved && (
                                      <Badge variant="success">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Resolved
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <UserCircle className="h-4 w-4" />
                                    <span>{discussion.userName}</span>
                                    <Clock className="h-4 w-4 ml-2" />
                                    <span>{format(new Date(discussion.createdAt), "PPp")}</span>
                                  </div>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleDiscussionAction(discussion._id, "pin")}>
                                    <Pin className="h-4 w-4 mr-2" />
                                    {discussion.isPinned ? "Unpin" : "Pin"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDiscussionAction(discussion._id, "resolve")}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {discussion.isResolved ? "Unresolve" : "Resolve"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDiscussionAction(discussion._id, "flag")}>
                                    <Flag className="h-4 w-4 mr-2" />
                                    Flag
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDiscussionAction(discussion._id, "delete")}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{discussion.content}</p>
                          </CardContent>
                          <CardFooter className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{discussion.replies.length} replies</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{discussion.likes || 0} likes</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedDiscussion(discussion)}
                            >
                              View Thread
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

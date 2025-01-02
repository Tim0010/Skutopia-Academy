import { useEffect, useState } from "react";
import {
  getCourseDiscussionsService,
  deleteDiscussionService,
} from "@/services";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import {
  Search,
  MoreVertical,
  Pin,
  CheckCircle,
  Trash2,
} from "lucide-react";

export default function DiscussionManagement({ courseId }) {
  const [discussions, setDiscussions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);

  useEffect(() => {
    fetchDiscussions();
  }, [courseId]);

  async function fetchDiscussions() {
    try {
      const response = await getCourseDiscussionsService(courseId);
      if (response?.success) {
        setDiscussions(response.data);
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  }

  async function handleDelete() {
    if (!selectedDiscussion) return;

    try {
      await deleteDiscussionService(selectedDiscussion._id);
      setDiscussions(discussions.filter(d => d._id !== selectedDiscussion._id));
      setDeleteDialogOpen(false);
      setSelectedDiscussion(null);
    } catch (error) {
      console.error("Error deleting discussion:", error);
    }
  }

  const filteredDiscussions = discussions.filter(
    (discussion) =>
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Replies</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDiscussions.map((discussion) => (
              <TableRow key={discussion._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {discussion.title}
                    {discussion.isPinned && (
                      <Pin className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{discussion.userName}</TableCell>
                <TableCell>
                  {format(new Date(discussion.createdAt), "PPp")}
                </TableCell>
                <TableCell>
                  {discussion.isResolved ? (
                    <span className="flex items-center gap-1 text-green-500">
                      <CheckCircle className="h-4 w-4" />
                      Resolved
                    </span>
                  ) : (
                    <span className="text-yellow-500">Pending</span>
                  )}
                </TableCell>
                <TableCell>{discussion.replies.length}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setSelectedDiscussion(discussion);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Discussion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Discussion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this discussion? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { getLectureDiscussionsService } from "@/services";
import DiscussionItem from "./discussion-item";
import NewDiscussion from "./new-discussion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DiscussionList({ courseId, lectureId }) {
  const { auth } = useContext(AuthContext);
  const [discussions, setDiscussions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, resolved, unresolved
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);

  useEffect(() => {
    fetchDiscussions();
  }, [courseId, lectureId]);

  async function fetchDiscussions() {
    try {
      const response = await getLectureDiscussionsService(courseId, lectureId);
      if (response?.success) {
        setDiscussions(response.data);
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  }

  const filteredDiscussions = discussions
    .filter((discussion) => {
      if (filter === "resolved") return discussion.isResolved;
      if (filter === "unresolved") return !discussion.isResolved;
      return true;
    })
    .filter((discussion) =>
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discussions</h2>
        <Button onClick={() => setShowNewDiscussion(true)}>Start Discussion</Button>
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilter("all")}>
              All Discussions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("resolved")}>
              Resolved
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("unresolved")}>
              Unresolved
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {showNewDiscussion && (
        <NewDiscussion
          courseId={courseId}
          lectureId={lectureId}
          onClose={() => setShowNewDiscussion(false)}
          onSuccess={() => {
            setShowNewDiscussion(false);
            fetchDiscussions();
          }}
        />
      )}

      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <DiscussionItem
            key={discussion._id}
            discussion={discussion}
            currentUser={auth?.user}
            onUpdate={fetchDiscussions}
          />
        ))}
      </div>
    </div>
  );
}

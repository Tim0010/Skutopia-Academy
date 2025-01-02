import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MessageCircle,
  Pin,
  CheckCircle,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  addReplyService,
  toggleLikeService,
  togglePinService,
  toggleResolvedService,
} from "@/services";

export default function DiscussionItem({ discussion, currentUser, onUpdate }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const isInstructor = currentUser?.role === "instructor";
  const isAuthor = currentUser?._id === discussion.userId;
  const hasLiked = discussion.likes.includes(currentUser?._id);

  async function handleLike() {
    try {
      await toggleLikeService(discussion._id);
      onUpdate();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }

  async function handlePin() {
    try {
      await togglePinService(discussion._id);
      onUpdate();
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  }

  async function handleResolve() {
    try {
      await toggleResolvedService(discussion._id);
      onUpdate();
    } catch (error) {
      console.error("Error toggling resolved status:", error);
    }
  }

  async function handleReply(e) {
    e.preventDefault();
    try {
      await addReplyService(discussion._id, replyContent);
      setReplyContent("");
      setShowReplyForm(false);
      onUpdate();
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  }

  return (
    <Card className={discussion.isPinned ? "border-primary" : ""}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {discussion.title}
              {discussion.isPinned && (
                <Pin className="h-4 w-4 text-primary" />
              )}
              {discussion.isResolved && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </CardTitle>
            <CardDescription>
              Posted by {discussion.userName} on{" "}
              {format(new Date(discussion.createdAt), "PPp")}
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isInstructor && (
                <DropdownMenuItem onClick={handlePin}>
                  {discussion.isPinned ? "Unpin" : "Pin"} Discussion
                </DropdownMenuItem>
              )}
              {(isAuthor || isInstructor) && (
                <DropdownMenuItem onClick={handleResolve}>
                  Mark as {discussion.isResolved ? "Unresolved" : "Resolved"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm">{discussion.content}</p>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={hasLiked ? "text-primary" : ""}
            onClick={handleLike}
          >
            <Heart className="h-4 w-4 mr-1" />
            {discussion.likes.length}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplies(!showReplies)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            {discussion.replies.length}
          </Button>
        </div>

        {showReplies && (
          <div className="pl-6 space-y-4">
            {discussion.replies.map((reply, index) => (
              <div key={index} className="border-l-2 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{reply.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(reply.createdAt), "PPp")}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm">{reply.content}</p>
              </div>
            ))}
          </div>
        )}

        {!showReplyForm ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReplyForm(true)}
          >
            Reply
          </Button>
        ) : (
          <form onSubmit={handleReply} className="space-y-2">
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowReplyForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!replyContent.trim()}>
                Post Reply
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

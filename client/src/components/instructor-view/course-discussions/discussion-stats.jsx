import { useEffect, useState } from "react";
import { getDiscussionStatsService } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, CheckCircle, Pin, AlertCircle } from "lucide-react";

export default function DiscussionStats({ courseId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [courseId]);

  async function fetchStats() {
    try {
      const response = await getDiscussionStatsService(courseId);
      if (response?.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching discussion stats:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading stats...</div>;
  }

  if (!stats) {
    return null;
  }

  const resolvedPercentage = 
    (stats.resolvedDiscussions / stats.totalDiscussions) * 100 || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Discussions
          </CardTitle>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDiscussions}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Resolved Discussions
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.resolvedDiscussions}</div>
          <Progress
            value={resolvedPercentage}
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pinned Discussions
          </CardTitle>
          <Pin className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pinnedDiscussions}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Unresolved Discussions
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.unresolvedDiscussions}</div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Most Active Discussions</CardTitle>
          <CardDescription>
            Discussions with the most engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.mostActiveDiscussions.map((discussion) => (
              <div
                key={discussion._id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{discussion.title}</p>
                  <p className="text-sm text-muted-foreground">
                    by {discussion.userName}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{discussion.replies.length}</span>
                  </div>
                  {discussion.isResolved && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {discussion.isPinned && (
                    <Pin className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Eye, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkPlan, WorkPlanComment } from "../types/teamTypes";

const generateMonitoringData = () => {
  const workPlans: WorkPlan[] = [
    {
      id: "wp001",
      memberId: "tm002",
      title: "Project Planning Review",
      description: "Review and update project timelines for Q2",
      location: "Main Office - Conference Room A",
      period: "weekly",
      startDate: "2024-03-01",
      endDate: "2024-03-07",
      status: "current",
      priority: "high",
      createdAt: "2024-02-28",
      updatedAt: "2024-03-01",
      progress: 65
    },
    {
      id: "wp002",
      memberId: "tm003",
      title: "Equipment Installation",
      description: "Install new monitoring equipment at site location",
      location: "Site B - Plant Area",
      period: "daily",
      startDate: "2024-03-15",
      endDate: "2024-03-15",
      status: "upcoming",
      priority: "medium",
      createdAt: "2024-03-01",
      updatedAt: "2024-03-01",
      progress: 0
    }
  ];

  const comments: WorkPlanComment[] = [
    {
      id: "c001",
      workPlanId: "wp001",
      authorId: "tm001",
      authorName: "John Smith",
      authorRole: "administrator",
      content: "Great progress on the timeline review. Please ensure all stakeholders are notified of the changes.",
      type: "comment",
      createdAt: "2024-03-02T10:30:00Z",
      isRead: false
    },
    {
      id: "c002",
      workPlanId: "wp001",
      authorId: "tm001",
      authorName: "John Smith",
      authorRole: "administrator",
      content: "What is the expected completion date for the final documentation?",
      type: "question",
      createdAt: "2024-03-02T14:15:00Z",
      isRead: true
    }
  ];

  return { workPlans, comments };
};

const TeamMonitoring = () => {
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>([]);
  const [comments, setComments] = useState<WorkPlanComment[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkPlan | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentType, setCommentType] = useState<"comment" | "question" | "feedback">("comment");

  useEffect(() => {
    const { workPlans: plans, comments: planComments } = generateMonitoringData();
    setWorkPlans(plans);
    setComments(planComments);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "current":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const handleViewDetails = (plan: WorkPlan) => {
    setSelectedPlan(plan);
    setIsDetailDialogOpen(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPlan) return;

    const comment: WorkPlanComment = {
      id: `c${Date.now()}`,
      workPlanId: selectedPlan.id,
      authorId: "current-user", // This would come from auth context
      authorName: "Current User", // This would come from auth context
      authorRole: "administrator", // This would come from auth context
      content: newComment,
      type: commentType,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setComments([...comments, comment]);
    setNewComment("");
    console.log("Added comment:", comment);
  };

  const getCommentsForPlan = (planId: string) => {
    return comments.filter(comment => comment.workPlanId === planId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Activity Monitoring</CardTitle>
          <CardDescription>Monitor team work plans and provide feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Plan</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workPlans.map((plan) => {
                  const planComments = getCommentsForPlan(plan.id);
                  const unreadComments = planComments.filter(c => !c.isRead).length;
                  
                  return (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.title}</div>
                          <div className="text-sm text-muted-foreground">{plan.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Member {plan.memberId}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(plan.status)}
                          <Badge className={
                            plan.status === "completed" ? "bg-green-100 text-green-800" :
                            plan.status === "current" ? "bg-yellow-100 text-yellow-800" :
                            plan.status === "overdue" ? "bg-red-100 text-red-800" :
                            "bg-blue-100 text-blue-800"
                          }>
                            {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${plan.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{plan.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{plan.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>{planComments.length}</span>
                          {unreadComments > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {unreadComments} new
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(plan)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Work Plan Details & Comments</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedPlan.title}</CardTitle>
                  <CardDescription>{selectedPlan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Location:</strong> {selectedPlan.location}</div>
                    <div><strong>Period:</strong> {selectedPlan.period}</div>
                    <div><strong>Start Date:</strong> {selectedPlan.startDate}</div>
                    <div><strong>End Date:</strong> {selectedPlan.endDate}</div>
                    <div><strong>Priority:</strong> {selectedPlan.priority}</div>
                    <div><strong>Progress:</strong> {selectedPlan.progress}%</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comments & Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {getCommentsForPlan(selectedPlan.id).map((comment) => (
                      <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.authorName}</span>
                          <Badge variant="outline" className="text-xs">
                            {comment.authorRole}
                          </Badge>
                          <Badge className={
                            comment.type === "question" ? "bg-orange-100 text-orange-800" :
                            comment.type === "feedback" ? "bg-purple-100 text-purple-800" :
                            "bg-blue-100 text-blue-800"
                          }>
                            {comment.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex gap-2">
                      <Button
                        variant={commentType === "comment" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCommentType("comment")}
                      >
                        Comment
                      </Button>
                      <Button
                        variant={commentType === "question" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCommentType("question")}
                      >
                        Question
                      </Button>
                      <Button
                        variant={commentType === "feedback" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCommentType("feedback")}
                      >
                        Feedback
                      </Button>
                    </div>
                    <Textarea
                      placeholder={`Add a ${commentType}...`}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      Add {commentType.charAt(0).toUpperCase() + commentType.slice(1)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamMonitoring;

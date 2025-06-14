
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Calendar, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import TeamMembersManagement from "@/features/team/components/TeamMembersManagement";
import WorkPlanManagement from "@/features/team/components/WorkPlanManagement";
import TeamMonitoring from "@/features/team/components/TeamMonitoring";
import AddTeamMemberForm from "@/features/team/components/AddTeamMemberForm";
import AddWorkPlanForm from "@/features/team/components/AddWorkPlanForm";

const TeamManagement = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [isWorkPlanDialogOpen, setIsWorkPlanDialogOpen] = useState(false);

  const handleAddMemberSuccess = () => {
    setIsMemberDialogOpen(false);
    toast.success("Team member added successfully");
  };

  const handleAddWorkPlanSuccess = () => {
    setIsWorkPlanDialogOpen(false);
    toast.success("Work plan added successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Manage team members, work plans, and monitor activities</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Members
          </TabsTrigger>
          <TabsTrigger value="workplans" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Work Plans
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage all team members and their roles</CardDescription>
                </div>
                <Button onClick={() => setIsMemberDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TeamMembersManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workplans" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Work Plans</CardTitle>
                  <CardDescription>Manage daily, weekly, and monthly work plans</CardDescription>
                </div>
                <Button onClick={() => setIsWorkPlanDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Work Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <WorkPlanManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Monitoring</CardTitle>
              <CardDescription>Monitor team activities and provide feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <TeamMonitoring />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
          </DialogHeader>
          <AddTeamMemberForm onSuccess={handleAddMemberSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isWorkPlanDialogOpen} onOpenChange={setIsWorkPlanDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Work Plan</DialogTitle>
          </DialogHeader>
          <AddWorkPlanForm onSuccess={handleAddWorkPlanSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;

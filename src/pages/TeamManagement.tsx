
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@/components/chakra/Tabs";
import { Plus, Users, Calendar, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { toast } from "@/hooks/use-toast";
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
        <TabList className="grid w-full grid-cols-3">
          <Tab value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Members
          </Tab>
          <Tab value="workplans" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Work Plans
          </Tab>
          <Tab value="monitoring" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Monitoring
          </Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel value="members">
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
          </TabPanel>
          
          <TabPanel value="workplans">
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
          </TabPanel>

          <TabPanel value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle>Team Monitoring</CardTitle>
                <CardDescription>Monitor team activities and provide feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <TeamMonitoring />
              </CardContent>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
          </DialogHeader>
          <AddTeamMemberForm 
            onSubmit={handleAddMemberSuccess} 
            onCancel={() => setIsMemberDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isWorkPlanDialogOpen} onOpenChange={setIsWorkPlanDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Work Plan</DialogTitle>
          </DialogHeader>
          <AddWorkPlanForm 
            onSubmit={handleAddWorkPlanSuccess} 
            onCancel={() => setIsWorkPlanDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;

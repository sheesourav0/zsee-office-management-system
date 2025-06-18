
import { useState, useEffect } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Badge } from "@/components/chakra/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Plus, Search, Edit, Trash2, Users, Calendar, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@/components/chakra/Tabs";
import { toast } from "@/hooks/use-toast";
import { TeamMember, UserRole } from "@/features/team/types/teamTypes";
import AddTeamMemberForm from "./AddTeamMemberForm";
import WorkPlanManagement from "./WorkPlanManagement";
import TeamMonitoring from "./TeamMonitoring";

const generateTeamMembers = (): TeamMember[] => {
  return [
    {
      id: "tm001",
      name: "John Smith",
      email: "john.smith@company.com",
      role: "administrator",
      department: "Administration",
      isActive: true,
      joinDate: "2024-01-15"
    },
    {
      id: "tm002",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "project-manager",
      department: "Engineering",
      teamLeadId: "tm001",
      isActive: true,
      joinDate: "2024-01-20"
    },
    {
      id: "tm003",
      name: "Mike Wilson",
      email: "mike.wilson@company.com",
      role: "engineer",
      department: "Engineering",
      teamLeadId: "tm002",
      isActive: true,
      joinDate: "2024-02-01"
    },
    {
      id: "tm004",
      name: "Lisa Brown",
      email: "lisa.brown@company.com",
      role: "hr",
      department: "Human Resources",
      isActive: true,
      joinDate: "2024-01-10"
    }
  ];
};

const TeamMembersManagement = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState("members");

  useEffect(() => {
    const allMembers = generateTeamMembers();
    setMembers(allMembers);
    applyFilters(allMembers);
  }, [searchQuery, selectedRole]);

  const applyFilters = (members: TeamMember[]) => {
    let filtered = [...members];

    if (selectedRole !== "all") {
      filtered = filtered.filter(member => member.role === selectedRole);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.department.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query)
      );
    }

    setFilteredMembers(filtered);
  };

  const getRoleBadge = (role: UserRole) => {
    const roleColors: Record<UserRole, string> = {
      "administrator": "bg-purple-100 text-purple-800",
      "admin": "bg-red-100 text-red-800",
      "hr": "bg-pink-100 text-pink-800",
      "account": "bg-green-100 text-green-800",
      "project-manager": "bg-blue-100 text-blue-800",
      "project-coordinator": "bg-indigo-100 text-indigo-800",
      "team-lead": "bg-orange-100 text-orange-800",
      "engineer": "bg-cyan-100 text-cyan-800",
      "technician": "bg-teal-100 text-teal-800",
      "helper": "bg-gray-100 text-gray-800",
      "supervisor": "bg-yellow-100 text-yellow-800",
      "sales": "bg-emerald-100 text-emerald-800",
      "labor": "bg-stone-100 text-stone-800",
      "office-boy": "bg-slate-100 text-slate-800",
      "others": "bg-neutral-100 text-neutral-800"
    };

    return (
      <Badge className={roleColors[role]}>
        {role.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    // Refresh data
    const allMembers = generateTeamMembers();
    setMembers(allMembers);
    applyFilters(allMembers);
  };

  return (
    <Box gap={6}>
      <Flex 
        direction={{ base: "column", md: "row" }} 
        align={{ md: "center" }} 
        justify={{ md: "space-between" }} 
        gap={4}
        mb={6}
      >
        <Heading size="lg">Team Members</Heading>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus style={{ marginRight: '8px', width: '16px', height: '16px' }} />
          Add Team Member
        </Button>
      </Flex>

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
                    <CardDescription>Manage team members and their roles</CardDescription>
                  </div>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, department, or role..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{getRoleBadge(member.role)}</TableCell>
                          <TableCell>{member.department}</TableCell>
                          <TableCell>{member.joinDate}</TableCell>
                          <TableCell>
                            <Badge className={member.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {member.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedMember(member)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredMembers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No team members found matching the current criteria.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value="workplans">
            <WorkPlanManagement />
          </TabPanel>

          <TabPanel value="monitoring">
            <TeamMonitoring />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
          </DialogHeader>
          <AddTeamMemberForm 
            onSubmit={handleAddSuccess} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TeamMembersManagement;


import { useState } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Badge } from "@/components/chakra/Badge";
import { Textarea } from "@/components/chakra/Textarea";
import { Alert, AlertDescription } from "@/components/chakra/Alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Search, MessageCircle, Clock, User, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for team activities
const mockActivities = [
  {
    id: "1",
    memberName: "John Smith",
    activity: "Started work on Site Preparation",
    timestamp: "2024-01-20 09:00",
    status: "active",
    location: "Construction Site A"
  },
  {
    id: "2", 
    memberName: "Sarah Johnson",
    activity: "Completed Foundation Work planning",
    timestamp: "2024-01-20 08:30",
    status: "completed",
    location: "Office"
  },
  {
    id: "3",
    memberName: "Mike Wilson", 
    activity: "Working on Electrical Wiring design",
    timestamp: "2024-01-20 07:45",
    status: "in-progress",
    location: "Engineering Lab"
  }
];

const TeamMonitoring = () => {
  const [activities] = useState(mockActivities);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedMember, setSelectedMember] = useState("");

  const filteredActivities = activities.filter(activity =>
    activity.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.activity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge colorScheme="green">Active</Badge>;
      case "completed":
        return <Badge colorScheme="blue">Completed</Badge>;
      case "in-progress":
        return <Badge colorScheme="yellow">In Progress</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleSendFeedback = () => {
    if (!selectedMember || !feedback.trim()) {
      toast.error("Please select a team member and enter feedback");
      return;
    }
    
    toast.success(`Feedback sent to ${selectedMember}`);
    setFeedback("");
    setSelectedMember("");
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
        <Heading size="lg">Team Monitoring</Heading>
      </Flex>

      <Alert status="info" mb={6}>
        <AlertCircle style={{ width: '16px', height: '16px' }} />
        <AlertDescription>
          Monitor real-time team activities and provide feedback to improve productivity.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Track team member activities and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Box mb={4}>
            <Box position="relative">
              <Search style={{ position: 'absolute', left: '8px', top: '10px', width: '16px', height: '16px', color: '#A0AEC0' }} />
              <Input
                placeholder="Search activities..."
                paddingLeft="32px"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>
          </Box>

          <Box borderWidth={1} borderRadius="md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <Flex align="center" gap={2}>
                        <User style={{ width: '16px', height: '16px' }} />
                        <Text fontWeight="medium">{activity.memberName}</Text>
                      </Flex>
                    </TableCell>
                    <TableCell>{activity.activity}</TableCell>
                    <TableCell>{activity.location}</TableCell>
                    <TableCell>
                      <Flex align="center" gap={2}>
                        <Clock style={{ width: '16px', height: '16px' }} />
                        <Text>{activity.timestamp}</Text>
                      </Flex>
                    </TableCell>
                    <TableCell>{getStatusBadge(activity.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send Feedback</CardTitle>
          <CardDescription>Provide feedback to team members</CardDescription>
        </CardHeader>
        <CardContent>
          <Box gap={4}>
            <Box>
              <Text mb={2} fontWeight="medium">Select Team Member</Text>
              <Input
                placeholder="Enter team member name"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
              />
            </Box>
            
            <Box>
              <Text mb={2} fontWeight="medium">Feedback Message</Text>
              <Textarea
                placeholder="Enter your feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </Box>
            
            <Button onClick={handleSendFeedback}>
              <MessageCircle style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Send Feedback
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeamMonitoring;

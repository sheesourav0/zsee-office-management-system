
import { useState, useEffect } from "react";
import { Input } from "@/components/chakra/Input";
import { Button } from "@/components/chakra/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { Search, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const generateVehicleRequests = () => {
  return [
    {
      id: "VT001",
      requestDate: "2023-04-12",
      requesterName: "John Doe",
      department: "Engineering",
      projectName: "Amni WTP",
      vehicleType: "Pickup Truck",
      purpose: "Equipment Transportation",
      fromLocation: "Warehouse",
      toLocation: "Amni Site",
      departureTime: "09:00 AM",
      estimatedDuration: "4 hours",
      passengers: "2",
      driverName: "Ram Singh",
      vehicleNumber: "AR-01-AB-1234",
      fuelAllocation: "200L",
      status: "assigned",
      priority: "High",
      approvedBy: "Site Manager",
      specialRequirements: "Need loading crane attachment"
    },
    {
      id: "VT002",
      requestDate: "2023-04-13",
      requesterName: "Jane Smith",
      department: "Operations",
      projectName: "YACHULI",
      vehicleType: "SUV",
      purpose: "Site Inspection",
      fromLocation: "Main Office",
      toLocation: "Yachuli Site",
      departureTime: "07:00 AM",
      estimatedDuration: "6 hours",
      passengers: "4",
      driverName: "Suresh Kumar",
      vehicleNumber: "AR-02-CD-5678",
      fuelAllocation: "150L",
      status: "in-transit",
      priority: "Medium",
      approvedBy: "Project Manager",
      specialRequirements: "4WD required for rough terrain"
    },
    {
      id: "VT003",
      requestDate: "2023-04-14",
      requesterName: "Mike Johnson",
      department: "Maintenance",
      projectName: "Sample Testing",
      vehicleType: "Van",
      purpose: "Equipment Delivery",
      fromLocation: "Storage Facility",
      toLocation: "Lab",
      departureTime: "02:00 PM",
      estimatedDuration: "2 hours",
      passengers: "1",
      driverName: "Ravi Sharma",
      vehicleNumber: "AR-03-EF-9012",
      fuelAllocation: "100L",
      status: "completed",
      priority: "Normal",
      approvedBy: "Department Head",
      specialRequirements: "Temperature controlled compartment"
    },
    {
      id: "VT004",
      requestDate: "2023-04-15",
      requesterName: "Sarah Wilson",
      department: "Quality Control",
      projectName: "Piyong IoT",
      vehicleType: "Sedan",
      purpose: "Client Meeting",
      fromLocation: "Regional Office",
      toLocation: "Client Office",
      departureTime: "10:30 AM",
      estimatedDuration: "3 hours",
      passengers: "3",
      driverName: "",
      vehicleNumber: "",
      fuelAllocation: "",
      status: "pending",
      priority: "Low",
      approvedBy: "",
      specialRequirements: "Professional appearance required"
    },
    {
      id: "VT005",
      requestDate: "2023-04-16",
      requesterName: "David Brown",
      department: "Logistics",
      projectName: "Machuika",
      vehicleType: "Heavy Truck",
      purpose: "Heavy Equipment Transport",
      fromLocation: "Equipment Yard",
      toLocation: "Machuika Site",
      departureTime: "05:00 AM",
      estimatedDuration: "8 hours",
      passengers: "2",
      driverName: "",
      vehicleNumber: "",
      fuelAllocation: "",
      status: "pending",
      priority: "High",
      approvedBy: "",
      specialRequirements: "Heavy load permit required"
    }
  ];
};

const VehicleTransportation = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const allRequests = generateVehicleRequests();
    setRequests(allRequests);
    filterRequests(allRequests);
  }, [searchQuery]);

  const filterRequests = (requests: any[]) => {
    if (!searchQuery) {
      setFilteredRequests(requests);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = requests.filter(request => 
      request.requesterName.toLowerCase().includes(query) ||
      request.department.toLowerCase().includes(query) ||
      request.projectName.toLowerCase().includes(query) ||
      request.vehicleType.toLowerCase().includes(query) ||
      request.purpose.toLowerCase().includes(query) ||
      request.vehicleNumber.toLowerCase().includes(query)
    );
    
    setFilteredRequests(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge colorScheme="green">Completed</Badge>;
      case "in-transit":
        return <Badge colorScheme="blue">In Transit</Badge>;
      case "assigned":
        return <Badge colorScheme="purple">Assigned</Badge>;
      case "pending":
        return <Badge colorScheme="yellow">Pending</Badge>;
      default:
        return <Badge colorScheme="gray">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge colorScheme="red">High</Badge>;
      case "Medium":
        return <Badge colorScheme="orange">Medium</Badge>;
      case "Low":
        return <Badge colorScheme="gray">Low</Badge>;
      default:
        return <Badge colorScheme="gray">Normal</Badge>;
    }
  };

  const handleViewDetails = (requestId: string) => {
    toast({ title: `Vehicle request details for ${requestId} will be shown here` });
  };

  const handleAssignVehicle = (requestId: string) => {
    toast({ title: `Vehicle assignment for ${requestId} will be handled here` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by requester, department, project, or vehicle..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Vehicle Type</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Vehicle No.</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.requesterName}</TableCell>
                <TableCell>{request.department}</TableCell>
                <TableCell>{request.projectName}</TableCell>
                <TableCell>{request.vehicleType}</TableCell>
                <TableCell>{request.purpose}</TableCell>
                <TableCell>{request.fromLocation} → {request.toLocation}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{request.requestDate}</div>
                    <div className="text-muted-foreground">{request.departureTime}</div>
                  </div>
                </TableCell>
                <TableCell>{request.vehicleNumber || "Not assigned"}</TableCell>
                <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewDetails(request.id)}
                    >
                      View
                    </Button>
                    {request.status === "pending" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAssignVehicle(request.id)}
                      >
                        Assign
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VehicleTransportation;

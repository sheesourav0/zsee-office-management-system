import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Label } from "@/components/chakra/Label";
import { Select } from "@/components/chakra/Select";
import { Textarea } from "@/components/chakra/Textarea";
import { Badge } from "@/components/chakra/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/chakra/Tabs";
import { DatePicker } from "@/components/chakra/DatePicker";
import { Truck, Plus, Calendar, MapPin, Package, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TransportationRequest {
  id: string;
  requestNo: string;
  vehicleType: string;
  requestDate: string;
  deliveryDate: string;
  pickupLocation: string;
  dropLocation: string;
  itemDescription: string;
  quantity: number;
  priority: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
  remarks?: string;
}

const mockTransportationRequests: TransportationRequest[] = [
  {
    id: "1",
    requestNo: "TR-2024-001",
    vehicleType: "Truck",
    requestDate: "2024-07-15",
    deliveryDate: "2024-07-20",
    pickupLocation: "Itanagar",
    dropLocation: "Naharlagun",
    itemDescription: "Construction Materials",
    quantity: 10,
    priority: "High",
    status: "in-transit",
    remarks: "Urgent delivery required",
  },
  {
    id: "2",
    requestNo: "TR-2024-002",
    vehicleType: "Van",
    requestDate: "2024-07-16",
    deliveryDate: "2024-07-22",
    pickupLocation: "Banderdewa",
    dropLocation: "Nirjuli",
    itemDescription: "Office Supplies",
    quantity: 5,
    priority: "Medium",
    status: "pending",
    remarks: "Standard delivery",
  },
  {
    id: "3",
    requestNo: "TR-2024-003",
    vehicleType: "Truck",
    requestDate: "2024-07-17",
    deliveryDate: "2024-07-23",
    pickupLocation: "Yupia",
    dropLocation: "Doimukh",
    itemDescription: "Machinery Parts",
    quantity: 3,
    priority: "High",
    status: "delivered",
    remarks: "Delivered on time",
  },
  {
    id: "4",
    requestNo: "TR-2024-004",
    vehicleType: "Truck",
    requestDate: "2024-07-18",
    deliveryDate: "2024-07-24",
    pickupLocation: "Seppa",
    dropLocation: "Itanagar",
    itemDescription: "Raw Materials",
    quantity: 8,
    priority: "Low",
    status: "cancelled",
    remarks: "Request cancelled due to unavailability",
  },
];

const getPriorityBadge = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return <Badge className="bg-red-100 text-red-800">High</Badge>;
    case "medium":
      return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    case "low":
      return <Badge className="bg-green-100 text-green-800">Low</Badge>;
    default:
      return <Badge variant="outline">Normal</Badge>;
  }
};

const VehicleTransportation = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transportRequests, setTransportRequests] =
    useState<TransportationRequest[]>(mockTransportationRequests);
  const [newRequest, setNewRequest] = useState<Omit<TransportationRequest, 'id'>>({
    requestNo: "",
    vehicleType: "Truck",
    requestDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date().toISOString().split('T')[0],
    pickupLocation: "",
    dropLocation: "",
    itemDescription: "",
    quantity: 1,
    priority: "Medium",
    status: "pending",
    remarks: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRequest = () => {
    const newId = Math.random().toString(36).substring(7);
    setTransportRequests(prev => [...prev, { id: newId, ...newRequest }]);
    toast.success("Transportation request added successfully!");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Transportation</h1>
          <p className="text-muted-foreground">
            Manage vehicle transportation requests and track their status
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Request
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Transportation Requests
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Transportation Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transportation Requests</CardTitle>
                  <CardDescription>
                    Manage and track all transportation requests
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Request No.</TableHead>
                      <TableHead>Vehicle Type</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Pickup Location</TableHead>
                      <TableHead>Drop Location</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transportRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.requestNo}</TableCell>
                        <TableCell>{request.vehicleType}</TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>{request.deliveryDate}</TableCell>
                        <TableCell>{request.pickupLocation}</TableCell>
                        <TableCell>{request.dropLocation}</TableCell>
                        <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Transportation Reports</CardTitle>
              <CardDescription>
                Generate and view transportation reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Coming Soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Add Transportation Request</DialogTitle>
            <CardDescription>
              Fill in the details for the transportation request
            </CardDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requestNo">Request No.</Label>
                <Input
                  id="requestNo"
                  name="requestNo"
                  value={newRequest.requestNo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select
                  id="vehicleType"
                  name="vehicleType"
                  value={newRequest.vehicleType}
                  onChange={handleInputChange}
                >
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Pickup">Pickup</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requestDate">Request Date</Label>
                <Input
                  type="date"
                  id="requestDate"
                  name="requestDate"
                  value={newRequest.requestDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  value={newRequest.deliveryDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupLocation">Pickup Location</Label>
                <Input
                  id="pickupLocation"
                  name="pickupLocation"
                  value={newRequest.pickupLocation}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropLocation">Drop Location</Label>
                <Input
                  id="dropLocation"
                  name="dropLocation"
                  value={newRequest.dropLocation}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemDescription">Item Description</Label>
              <Textarea
                id="itemDescription"
                name="itemDescription"
                value={newRequest.itemDescription}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={newRequest.quantity.toString()}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  id="priority"
                  name="priority"
                  value={newRequest.priority}
                  onChange={handleInputChange}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                name="remarks"
                value={newRequest.remarks}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRequest}>Add Request</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleTransportation;

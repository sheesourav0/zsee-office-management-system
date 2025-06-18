import { useState } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Badge } from "@/components/chakra/Badge";
import { Button } from "@/components/chakra/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Separator } from "@/components/chakra/Separator";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@/components/chakra/Tabs";
import { ArrowLeft, Download, FileText, Calendar, DollarSign, User, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PaymentDetailViewProps {
  paymentId: string | null;
  onBack: () => void;
}

const PaymentDetailView = ({ paymentId, onBack }: PaymentDetailViewProps) => {
  const mockPayments = [
    {
      id: "1",
      invoiceNumber: "INV-2023-001",
      vendor: "King Longkai",
      project: "Amrit WTP",
      amount: 75000,
      paymentDate: "2023-01-15",
      dueDate: "2023-01-30",
      status: "paid",
      invoiceFile: "invoice-001.pdf",
      notes: "First payment for gateway modules and PC"
    },
    {
      id: "2",
      invoiceNumber: "INV-2023-002",
      vendor: "BMP SYSTEMS",
      project: "YACHULI",
      amount: 42000,
      paymentDate: "2023-02-01",
      dueDate: "2023-02-15",
      status: "pending",
      invoiceFile: "invoice-002.pdf",
      notes: "Payment for Lithium Ion Battery"
    },
    {
      id: "3",
      invoiceNumber: "INV-2023-003",
      vendor: "P.R.S ENTERPRISE",
      project: "Sample Testing",
      amount: 18000,
      paymentDate: "2023-02-15",
      dueDate: "2023-02-28",
      status: "paid",
      invoiceFile: "invoice-003.pdf",
      notes: "Payment for Control Valve"
    },
    {
      id: "4",
      invoiceNumber: "INV-2023-004",
      vendor: "SKY MARKETING",
      project: "Piyong IoT",
      amount: 28000,
      paymentDate: "2023-03-01",
      dueDate: "2023-03-15",
      status: "overdue",
      invoiceFile: "invoice-004.pdf",
      notes: "Payment for Panel Internal Instruments"
    },
    {
      id: "5",
      invoiceNumber: "INV-2023-005",
      vendor: "Agmatic Technologies",
      project: "Machuika",
      amount: 9500,
      paymentDate: "2023-03-15",
      dueDate: "2023-03-31",
      status: "paid",
      invoiceFile: "invoice-005.pdf",
      notes: "Payment for Marxian's Equipment Return"
    },
  ];

  const [activeTab, setActiveTab] = useState("details");

  if (!paymentId) {
    return (
      <Card>
        <CardContent p={8} textAlign="center">
          <Text color="gray.600">Select a payment to view details</Text>
        </CardContent>
      </Card>
    );
  }

  const payment = mockPayments.find(p => p.id === paymentId);
  
  if (!payment) {
    return (
      <Card>
        <CardContent p={8} textAlign="center">
          <Text color="red.600">Payment not found</Text>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge colorScheme="green">Paid</Badge>;
      case "pending":
        return <Badge colorScheme="yellow">Pending</Badge>;
      case "overdue":
        return <Badge colorScheme="red">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleDownloadInvoice = () => {
    toast.info(`Downloading invoice ${payment.invoiceNumber}`);
  };

  return (
    <Box gap={6}>
      <Flex align="center" gap={4} mb={6}>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft style={{ marginRight: '8px', width: '16px', height: '16px' }} />
          Back to Payments
        </Button>
        <Heading size="lg">Payment Details</Heading>
      </Flex>

      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>Details about this payment</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabList>
              <Tab value="details">Details</Tab>
              <Tab value="notes">Notes</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="details">
                <Box gap={4}>
                  <Flex justify="space-between">
                    <Text fontWeight="medium">Invoice Number:</Text>
                    <Text>{payment.invoiceNumber}</Text>
                  </Flex>
                  <Separator />
                  <Flex justify="space-between">
                    <Text fontWeight="medium">Vendor:</Text>
                    <Text>{payment.vendor}</Text>
                  </Flex>
                  <Separator />
                  <Flex justify="space-between">
                    <Text fontWeight="medium">Project:</Text>
                    <Text>{payment.project}</Text>
                  </Flex>
                  <Separator />
                  <Flex justify="space-between">
                    <Text fontWeight="medium">Amount:</Text>
                    <Text>₹{payment.amount.toLocaleString()}</Text>
                  </Flex>
                  <Separator />
                  <Flex justify="space-between">
                    <Text fontWeight="medium">Payment Date:</Text>
                    <Text>{payment.paymentDate}</Text>
                  </Flex>
                  <Separator />
                  <Flex justify="space-between">
                    <Text fontWeight="medium">Due Date:</Text>
                    <Text>{payment.dueDate}</Text>
                  </Flex>
                  <Separator />
                  <Flex justify="space-between">
                    <Text fontWeight="medium">Status:</Text>
                    <Text>{getStatusBadge(payment.status)}</Text>
                  </Flex>
                </Box>
              </TabPanel>
              <TabPanel value="notes">
                <Box>
                  <Text>{payment.notes}</Text>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice File</CardTitle>
          <CardDescription>Download the invoice file for this payment</CardDescription>
        </CardHeader>
        <CardContent>
          <Flex align="center" justify="space-between">
            <Flex align="center" gap={2}>
              <FileText style={{ width: '16px', height: '16px' }} />
              <Text fontWeight="medium">{payment.invoiceFile}</Text>
            </Flex>
            <Button onClick={handleDownloadInvoice}>
              <Download style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Download Invoice
            </Button>
          </Flex>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentDetailView;

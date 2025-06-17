
import { Box, VStack, Heading, Text, SimpleGrid, Icon } from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

const ReportsPage = () => {
  const reportTypes = [
    {
      id: "1",
      title: "Payment Summary",
      description: "Summary of all payments by project, status, and date range",
      icon: <Icon as={FileText} boxSize={8} color="blue.500" />,
    },
    {
      id: "2",
      title: "Project Expenditure",
      description: "Detailed breakdown of expenses by project",
      icon: <Icon as={FileText} boxSize={8} color="blue.500" />,
    },
    {
      id: "3",
      title: "Vendor Payment History",
      description: "Payment history for each vendor",
      icon: <Icon as={FileText} boxSize={8} color="blue.500" />,
    },
    {
      id: "4",
      title: "Material Transportation",
      description: "Status of material shipments and deliveries",
      icon: <Icon as={FileText} boxSize={8} color="blue.500" />,
    },
    {
      id: "5",
      title: "Budget vs Actual",
      description: "Comparison of budgeted vs actual expenditure",
      icon: <Icon as={FileText} boxSize={8} color="blue.500" />,
    },
    {
      id: "6",
      title: "Payment Due Report",
      description: "List of upcoming payment dues",
      icon: <Icon as={FileText} boxSize={8} color="blue.500" />,
    }
  ];

  const handleGenerateReport = (reportId: string) => {
    toast.success("Report generation started. It will be available for download shortly.");
  };

  return (
    <VStack gap={6} align="stretch">
      <Box>
        <Heading size="xl" mb={2}>Reports</Heading>
        <Text color="gray.600">Generate and download various reports</Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        {reportTypes.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <CardTitle>{report.title}</CardTitle>
                {report.icon}
              </Box>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                width="full"
                onClick={() => handleGenerateReport(report.id)}
              >
                <Download style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default ReportsPage;

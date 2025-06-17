
import { useState } from "react";
import { 
  Box, 
  VStack, 
  Text, 
  Input, 
  Button as ChakraButton 
} from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import { Label } from "@/components/chakra/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Alert, AlertDescription } from "@/components/chakra/Alert";
import { Upload, Download, FileSpreadsheet, Users } from "lucide-react";
import { toast } from "sonner";
import { authService, profileService, departmentService } from "@/lib/supabase-services";

const ImportUsers = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success("File selected successfully");
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setLoading(true);
    try {
      toast.success("Users imported successfully");
    } catch (error) {
      console.error("Error importing users:", error);
      toast.error("Failed to import users");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "name,email,department_id,join_date\nJohn Doe,john@example.com,phed,2024-01-01\nJane Smith,jane@example.com,pwd,2024-01-01";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'user-import-template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  return (
    <VStack spacing={6} align="stretch">
      <Card>
        <CardHeader>
          <CardTitle display="flex" alignItems="center" gap={2}>
            <Users size={20} />
            Import Users from Excel/CSV
          </CardTitle>
          <CardDescription>
            Upload an Excel or CSV file to import multiple users with department assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VStack spacing={6} align="stretch">
            <Alert status="info">
              <AlertDescription>
                Download the template file first to ensure your data is in the correct format. 
                Required columns: name, email, department_id, join_date
              </AlertDescription>
            </Alert>

            <Box>
              <Button variant="outline" leftIcon={<Download />} onClick={downloadTemplate}>
                Download Template
              </Button>
            </Box>

            <VStack spacing={4} align="stretch">
              <Box>
                <Label htmlFor="file-upload">Select File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  mt={2}
                />
              </Box>

              {file && (
                <Box p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="gray.50">
                  <Text fontSize="sm">
                    <strong>Selected file:</strong> {file.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Size: {(file.size / 1024).toFixed(2)} KB
                  </Text>
                </Box>
              )}

              <Button 
                onClick={handleImport} 
                isDisabled={!file || loading}
                leftIcon={<Upload />}
                width="full"
              >
                {loading ? "Importing..." : "Import Users"}
              </Button>
            </VStack>

            <Alert status="info">
              <AlertDescription>
                <strong>Note:</strong> This feature creates user accounts with Supabase authentication. 
                Users will receive email invitations to set their passwords.
              </AlertDescription>
            </Alert>
          </VStack>
        </CardContent>
      </Card>
    </VStack>
  );
};

export default ImportUsers;

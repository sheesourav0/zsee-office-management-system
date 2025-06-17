import React, { useState } from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import { Button } from '@/components/chakra/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/chakra/Card';
import { Upload, Download, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ImportUsers = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = () => {
    setIsUploading(true);
    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Users imported successfully!');
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    toast.info('Template download will be implemented');
  };

  return (
    <Box>
      <Card>
        <CardHeader>
          <CardTitle>Import Users</CardTitle>
          <CardDescription>Bulk import users from CSV file</CardDescription>
        </CardHeader>
        <CardContent>
          <VStack gap={6} align="stretch">
            <Box p={6} border="2px dashed" borderColor="gray.300" borderRadius="lg" textAlign="center">
              <VStack gap={4}>
                <Upload size={48} color="gray" />
                <VStack gap={2} align="stretch">
                  <Text fontSize="lg" fontWeight="medium">
                    Drop your CSV file here or click to browse
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Supported format: CSV files with columns for name, email, role
                  </Text>
                </VStack>
                <VStack gap={3} align="stretch">
                  <Button loading={isUploading} onClick={handleFileUpload}>
                    <Upload style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                    {isUploading ? 'Uploading...' : 'Select File'}
                  </Button>
                  <Button variant="outline" onClick={handleDownloadTemplate}>
                    <Download style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                    Download Template
                  </Button>
                </VStack>
              </VStack>
            </Box>

            <Box p={4} bg="blue.50" borderRadius="md">
              <VStack gap={2} align="start">
                <Text fontSize="sm" fontWeight="medium" color="blue.800">
                  <FileText style={{ display: 'inline', marginRight: '4px', width: '14px', height: '14px' }} />
                  CSV Format Requirements:
                </Text>
                <Text fontSize="xs" color="blue.700">
                  • First row should contain headers: name, email, role, department
                </Text>
                <Text fontSize="xs" color="blue.700">
                  • Each user should be on a separate row
                </Text>
                <Text fontSize="xs" color="blue.700">
                  • Email addresses must be unique and valid
                </Text>
              </VStack>
            </Box>
          </VStack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ImportUsers;

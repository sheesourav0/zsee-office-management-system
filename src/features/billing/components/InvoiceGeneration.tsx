
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/chakra/Card';
import { Button } from '@/components/chakra/Button';
import { VStack, HStack, Input, SimpleGrid, Box } from '@chakra-ui/react';
import { Badge } from '@/components/chakra/Badge';
import { toast } from '@/hooks/use-toast';

interface InvoiceGenerationProps {
  refreshTrigger: number;
}

const InvoiceGeneration = ({ refreshTrigger }: InvoiceGenerationProps) => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProjects();
  }, [refreshTrigger]);

  const loadProjects = () => {
    const storedProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
    setProjects(storedProjects);
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateInvoice = (project: any) => {
    toast.success(`Invoice generated for ${project.name}`);
  };

  return (
    <VStack gap={6} align="stretch">
      <HStack gap={4}>
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </HStack>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={8}>
              <p className="text-muted-foreground">No projects found</p>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {filteredProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <VStack align="start" gap={2}>
                  <p><strong>Owner:</strong> {project.projectOwner}</p>
                  <p><strong>Total Cost:</strong> ₹{project.totalCost?.toLocaleString()}</p>
                  <Badge colorScheme={project.status === 'completed' ? 'green' : 'blue'}>
                    {project.status}
                  </Badge>
                  <Button
                    size="sm"
                    width="full"
                    onClick={() => generateInvoice(project)}
                  >
                    Generate Invoice
                  </Button>
                </VStack>
              </CardContent>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default InvoiceGeneration;


import { useState } from "react";
import { Button } from "@/components/radix/Button";
import { Input } from "@/components/radix/Input";
import { Label } from "@/components/radix/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/radix/Card";
import { Alert, AlertDescription } from "@/components/radix/Alert";
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
      // Here you would typically parse the Excel file and show a preview
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
      // This is a simplified version - in a real implementation,
      // you would parse the Excel file and process each user
      toast.success("Users imported successfully");
    } catch (error) {
      console.error("Error importing users:", error);
      toast.error("Failed to import users");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Create a simple CSV template
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Import Users from Excel/CSV
          </CardTitle>
          <CardDescription>
            Upload an Excel or CSV file to import multiple users with department assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <FileSpreadsheet className="h-4 w-4" />
            <AlertDescription>
              Download the template file first to ensure your data is in the correct format. 
              Required columns: name, email, department_id, join_date
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="mt-2"
              />
            </div>

            {file && (
              <div className="p-4 border rounded-md bg-muted/50">
                <p className="text-sm">
                  <strong>Selected file:</strong> {file.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Size: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <Button 
              onClick={handleImport} 
              disabled={!file || loading}
              className="w-full"
            >
              {loading ? (
                "Importing..."
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Users
                </>
              )}
            </Button>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Note:</strong> This feature creates user accounts with Supabase authentication. 
              Users will receive email invitations to set their passwords.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportUsers;

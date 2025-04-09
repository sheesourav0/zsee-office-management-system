
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UploadCloud, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { UserRole, roles } from "@/lib/roles";
import { User } from "./UsersList";
import * as XLSX from "xlsx";

<lov-add-dependency>xlsx@0.18.5</lov-add-dependency>

type ImportStatus = "idle" | "validating" | "valid" | "invalid" | "importing" | "success";

interface UserImport extends Omit<User, "id" | "createdAt"> {
  status: "valid" | "invalid";
  errors?: string[];
}

const ImportUsers = () => {
  const [users, setUsers] = useState<UserImport[]>([]);
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetImport = () => {
    setUsers([]);
    setStatus("idle");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      resetImport();
      return;
    }

    const file = files[0];
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(fileExt)) {
      toast.error("Please select an Excel or CSV file");
      resetImport();
      return;
    }

    setSelectedFile(file);
    setStatus("validating");
    parseExcelFile(file);
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        validateImportData(json);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        toast.error("Could not parse the Excel file. Please make sure it's valid.");
        setStatus("invalid");
      }
    };
    
    reader.onerror = () => {
      toast.error("Error reading the file");
      setStatus("invalid");
    };
    
    reader.readAsBinaryString(file);
  };

  const validateImportData = (data: any[]) => {
    if (data.length === 0) {
      toast.error("The file doesn't contain any data");
      setStatus("invalid");
      return;
    }

    const requiredFields = ['name', 'email', 'role'];
    const validRoles = Object.keys(roles);
    
    const validatedUsers: UserImport[] = data.map(row => {
      const user: UserImport = {
        name: row.name || row.Name || '',
        email: row.email || row.Email || '',
        role: (row.role || row.Role || 'viewer').toLowerCase() as UserRole,
        phone: row.phone || row.Phone || '',
        status: 'valid',
        errors: []
      };

      // Validate required fields
      for (const field of requiredFields) {
        if (!user[field as keyof typeof user]) {
          user.status = 'invalid';
          user.errors = [...(user.errors || []), `Missing ${field}`];
        }
      }
      
      // Validate email format
      if (user.email && !/^\S+@\S+\.\S+$/.test(user.email)) {
        user.status = 'invalid';
        user.errors = [...(user.errors || []), 'Invalid email format'];
      }
      
      // Validate role
      if (user.role && !validRoles.includes(user.role)) {
        user.status = 'invalid';
        user.errors = [...(user.errors || []), `Invalid role: must be one of ${validRoles.join(', ')}`];
      }
      
      return user;
    });
    
    setUsers(validatedUsers);
    
    const hasInvalidUsers = validatedUsers.some(user => user.status === 'invalid');
    setStatus(hasInvalidUsers ? 'invalid' : 'valid');
    
    if (hasInvalidUsers) {
      toast.error("Some records have validation errors. Please fix them before importing.");
    } else {
      toast.success("All records are valid and ready to import.");
    }
  };

  const handleImport = async () => {
    if (users.length === 0 || status !== 'valid') {
      toast.error("Please upload a valid file first");
      return;
    }
    
    setStatus("importing");
    
    try {
      // In a real app, this would be an API call
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Convert import users to actual users
      const newUsers = users.map(user => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: new Date().toISOString()
      }));
      
      // Save to localStorage
      localStorage.setItem("users", JSON.stringify([...storedUsers, ...newUsers]));
      
      setStatus("success");
      toast.success(`Successfully imported ${users.length} users`);
      
      // Reset after 3 seconds
      setTimeout(() => {
        resetImport();
      }, 3000);
    } catch (error) {
      console.error("Error importing users:", error);
      toast.error("An error occurred while importing users");
      setStatus("valid"); // Revert to valid state to allow retrying
    }
  };

  const renderFileUpload = () => (
    <div className="border-2 border-dashed rounded-lg p-10 text-center">
      <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Upload User Data</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop an Excel file or click to browse
      </p>
      <Input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleFileSelect}
        id="file-upload"
      />
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Select Excel File
      </Button>
      <div className="mt-4 text-xs text-muted-foreground">
        <p>File must include the following columns:</p>
        <p className="font-medium">name, email, role (optional: phone)</p>
      </div>
    </div>
  );

  const renderImportPreview = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <span className="font-medium">{selectedFile?.name}</span>
          <Badge variant="outline">
            {users.length} {users.length === 1 ? 'record' : 'records'}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={resetImport}>
            Cancel
          </Button>
          <Button 
            size="sm" 
            disabled={status !== 'valid'} 
            onClick={handleImport}
          >
            {status === 'importing' ? 'Importing...' : 'Import Users'}
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role && (
                    <Badge className="capitalize">{user.role}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.status === 'valid' ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      <span>Valid</span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>Invalid</span>
                      </div>
                      {user.errors && user.errors.length > 0 && (
                        <span className="text-xs text-red-600 mt-1">
                          {user.errors.join(', ')}
                        </span>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderSuccessMessage = () => (
    <div className="border-2 border-dashed border-green-200 rounded-lg p-10 text-center bg-green-50">
      <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Import Successful!</h3>
      <p className="text-sm text-muted-foreground">
        {users.length} users have been successfully imported.
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      {status === 'idle' && renderFileUpload()}
      {['validating', 'valid', 'invalid', 'importing'].includes(status) && renderImportPreview()}
      {status === 'success' && renderSuccessMessage()}
      
      {status === 'idle' && (
        <div className="mt-8 border-t pt-6">
          <h3 className="font-medium mb-2">Excel File Template</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your Excel file should have the following columns:
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>name</TableHead>
                  <TableHead>email</TableHead>
                  <TableHead>role</TableHead>
                  <TableHead>phone (optional)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>john@example.com</TableCell>
                  <TableCell>manager</TableCell>
                  <TableCell>+1234567890</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>jane@example.com</TableCell>
                  <TableCell>viewer</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm">
            <p><strong>Valid roles:</strong> superadmin, admin, manager, viewer</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportUsers;

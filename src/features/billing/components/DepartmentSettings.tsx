
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Department } from "../types/billingTypes";

interface DepartmentSettingsProps {
  onUpdate: () => void;
}

const DepartmentSettings = ({ onUpdate }: DepartmentSettingsProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDepartmentName, setNewDepartmentName] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = () => {
    const storedDepartments = JSON.parse(localStorage.getItem('billing_departments') || '[]');
    if (storedDepartments.length === 0) {
      // Initialize with default departments
      const defaultDepartments: Department[] = [
        { id: "1", name: "Tender", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "2", name: "Account", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "3", name: "Survey", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "4", name: "DPR", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "5", name: "Designing", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "6", name: "Consultancy", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "7", name: "Civil", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "8", name: "Mechanical", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "9", name: "Electrical", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "10", name: "Automation", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "11", name: "IT", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "12", name: "TPI", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ];
      saveDepartments(defaultDepartments);
      setDepartments(defaultDepartments);
    } else {
      setDepartments(storedDepartments);
    }
  };

  const saveDepartments = (depts: Department[]) => {
    localStorage.setItem('billing_departments', JSON.stringify(depts));
  };

  const addDepartment = () => {
    if (!newDepartmentName.trim()) {
      toast.error("Please enter a department name");
      return;
    }

    const newDepartment: Department = {
      id: Date.now().toString(),
      name: newDepartmentName.trim(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedDepartments = [...departments, newDepartment];
    setDepartments(updatedDepartments);
    saveDepartments(updatedDepartments);
    setNewDepartmentName("");
    toast.success("Department added successfully");
    onUpdate();
  };

  const toggleDepartment = (id: string) => {
    const updatedDepartments = departments.map(dept =>
      dept.id === id 
        ? { ...dept, isActive: !dept.isActive, updatedAt: new Date().toISOString() }
        : dept
    );
    setDepartments(updatedDepartments);
    saveDepartments(updatedDepartments);
    onUpdate();
  };

  const deleteDepartment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      const updatedDepartments = departments.filter(dept => dept.id !== id);
      setDepartments(updatedDepartments);
      saveDepartments(updatedDepartments);
      toast.success("Department deleted successfully");
      onUpdate();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter department name"
          value={newDepartmentName}
          onChange={(e) => setNewDepartmentName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addDepartment()}
        />
        <Button onClick={addDepartment}>
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={department.isActive}
                      onCheckedChange={() => toggleDepartment(department.id)}
                    />
                    <span className={department.isActive ? 'text-green-600' : 'text-red-600'}>
                      {department.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteDepartment(department.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DepartmentSettings;

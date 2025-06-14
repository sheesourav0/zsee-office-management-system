
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserRole } from "../types/teamTypes";

interface AddTeamMemberFormProps {
  onSuccess: () => void;
}

const AddTeamMemberForm = ({ onSuccess }: AddTeamMemberFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "" as UserRole | "",
    department: "",
    teamLeadId: ""
  });

  const roles: { value: UserRole; label: string }[] = [
    { value: "administrator", label: "Administrator" },
    { value: "admin", label: "Admin" },
    { value: "hr", label: "HR" },
    { value: "account", label: "Account" },
    { value: "project-manager", label: "Project Manager" },
    { value: "project-coordinator", label: "Project Coordinator" },
    { value: "team-lead", label: "Team Lead" },
    { value: "engineer", label: "Engineer" },
    { value: "technician", label: "Technician" },
    { value: "helper", label: "Helper" },
    { value: "supervisor", label: "Supervisor" },
    { value: "sales", label: "Sales" },
    { value: "labor", label: "Labor" },
    { value: "office-boy", label: "Office Boy" },
    { value: "others", label: "Others" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role || !formData.department) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("Adding team member:", formData);
    toast.success("Team member added successfully");
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Enter department"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          Add Team Member
        </Button>
      </div>
    </form>
  );
};

export default AddTeamMemberForm;


import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Label } from "@/components/chakra/Label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/chakra/Select";
import { toast } from "@/hooks/use-toast";

interface AddTeamMemberFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

type UserRole = "administrator" | "admin" | "hr" | "account" | "project-manager" | "project-coordinator" | "team-lead" | "engineer" | "technician" | "helper" | "supervisor" | "sales" | "labor" | "office-boy" | "others";

const AddTeamMemberForm = ({ onSubmit, onCancel }: AddTeamMemberFormProps) => {
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
    onSubmit(formData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} gap={4}>
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

      <Flex gap={4} justify="flex-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Team Member
        </Button>
      </Flex>
    </Box>
  );
};

export default AddTeamMemberForm;


import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Label } from "@/components/chakra/Label";
import { Textarea } from "@/components/chakra/Textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/chakra/Select";
import { toast } from "@/hooks/use-toast";

interface AddWorkPlanFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

type WorkPlanPeriod = "daily" | "weekly" | "monthly";

const AddWorkPlanForm = ({ onSubmit, onCancel }: AddWorkPlanFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    period: "" as WorkPlanPeriod | "",
    startDate: "",
    endDate: "",
    priority: "" as "low" | "medium" | "high" | "",
    memberId: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location || !formData.period || !formData.startDate || !formData.endDate || !formData.priority) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("Adding work plan:", formData);
    toast.success("Work plan added successfully");
    onSubmit(formData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} gap={4}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter work plan title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Enter work location"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter detailed description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="period">Period *</Label>
          <Select value={formData.period} onValueChange={(value: WorkPlanPeriod) => setFormData({ ...formData, period: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority *</Label>
        <Select value={formData.priority} onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, priority: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Flex gap={4} justify="flex-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Work Plan
        </Button>
      </Flex>
    </Box>
  );
};

export default AddWorkPlanForm;

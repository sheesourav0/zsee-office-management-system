
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
}

const PaymentFilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [filters, setFilters] = useState({
    project: "",
    vendor: "",
    paymentStatus: "",
    dateFrom: null,
    dateTo: null,
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (value && !activeFilters.includes(key)) {
      setActiveFilters([...activeFilters, key]);
    } else if (!value && activeFilters.includes(key)) {
      setActiveFilters(activeFilters.filter(k => k !== key));
    }
    
    onFilterChange(newFilters);
  };

  const clearFilter = (key: string) => {
    const newFilters = { ...filters, [key]: "" };
    setFilters(newFilters);
    setActiveFilters(activeFilters.filter(k => k !== key));
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      project: "",
      vendor: "",
      paymentStatus: "",
      dateFrom: null,
      dateTo: null,
    };
    setFilters(resetFilters);
    setActiveFilters([]);
    onFilterChange(resetFilters);
  };

  const getFilterLabel = (key: string) => {
    switch (key) {
      case "project": return "Project";
      case "vendor": return "Vendor";
      case "paymentStatus": return "Payment Status";
      case "dateFrom": return "From Date";
      case "dateTo": return "To Date";
      default: return key;
    }
  };

  const getFilterValue = (key: string) => {
    if (key === "dateFrom" || key === "dateTo") {
      return filters[key] ? new Date(filters[key]).toLocaleDateString() : "";
    }
    return filters[key];
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <Label htmlFor="project">Project</Label>
          <Select 
            value={filters.project} 
            onValueChange={(value) => handleFilterChange("project", value)}
          >
            <SelectTrigger id="project">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sample Testing">Sample Testing</SelectItem>
              <SelectItem value="YACHULI">YACHULI</SelectItem>
              <SelectItem value="Amni WTP">Amni WTP</SelectItem>
              <SelectItem value="Machuika">Machuika</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="vendor">Vendor</Label>
          <Select 
            value={filters.vendor} 
            onValueChange={(value) => handleFilterChange("vendor", value)}
          >
            <SelectTrigger id="vendor">
              <SelectValue placeholder="All Vendors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="King Longkai">King Longkai</SelectItem>
              <SelectItem value="A-TEL TECH">A-TEL TECH</SelectItem>
              <SelectItem value="BMP SYSTEMS">BMP SYSTEMS</SelectItem>
              <SelectItem value="P.R.S ENTERPRISE">P.R.S ENTERPRISE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Payment Status</Label>
          <Select 
            value={filters.paymentStatus} 
            onValueChange={(value) => handleFilterChange("paymentStatus", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partially Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>From Date</Label>
          <DatePicker 
            date={filters.dateFrom} 
            setDate={(date) => handleFilterChange("dateFrom", date)} 
            placeholder="Select start date"
          />
        </div>

        <div>
          <Label>To Date</Label>
          <DatePicker 
            date={filters.dateTo} 
            setDate={(date) => handleFilterChange("dateTo", date)} 
            placeholder="Select end date"
          />
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {activeFilters.map(key => (
            <Badge key={key} variant="secondary" className="flex items-center gap-1">
              {getFilterLabel(key)}: {getFilterValue(key)}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter(key)} 
              />
            </Badge>
          ))}
          {activeFilters.length > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentFilterBar;

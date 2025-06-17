
import { useState } from "react";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Label } from "@/components/chakra/Label";
import { Select } from "@/components/chakra/Select";
import { DatePicker } from "@/components/chakra/DatePicker";
import { Badge } from "@/components/chakra/Badge";
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
            onChange={(e) => handleFilterChange("project", e.target.value)}
            id="project"
          >
            <option value="">All Projects</option>
            <option value="Sample Testing">Sample Testing</option>
            <option value="YACHULI">YACHULI</option>
            <option value="Amni WTP">Amni WTP</option>
            <option value="Machuika">Machuika</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="vendor">Vendor</Label>
          <Select 
            value={filters.vendor} 
            onChange={(e) => handleFilterChange("vendor", e.target.value)}
            id="vendor"
          >
            <option value="">All Vendors</option>
            <option value="King Longkai">King Longkai</option>
            <option value="A-TEL TECH">A-TEL TECH</option>
            <option value="BMP SYSTEMS">BMP SYSTEMS</option>
            <option value="P.R.S ENTERPRISE">P.R.S ENTERPRISE</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Payment Status</Label>
          <Select 
            value={filters.paymentStatus} 
            onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
            id="status"
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="partial">Partially Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="hold">On Hold</option>
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
            <Badge key={key} variant="subtle" className="flex items-center gap-1">
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

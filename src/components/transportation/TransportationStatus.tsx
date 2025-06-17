import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Badge } from "@/components/chakra/Badge";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Select } from "@/components/chakra/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { FormItem, FormLabel, FormControl } from "@/components/chakra/Form";
import { toast } from "@/hooks/use-toast";

import { CheckCircle, CircleDashed, Truck } from "lucide-react";

interface StatusUpdate {
  status: string;
  location: string;
  timestamp: string;
  note?: string;
}

interface TransportationStatusProps {
  status: string;
  updates: StatusUpdate[];
}

type StatusStep = {
  title: string;
  completed: boolean;
  current: boolean;
  location?: string;
  timestamp?: string;
  note?: string;
}

const TransportationStatus = ({ status, updates }: TransportationStatusProps) => {
  // Default status steps if no updates are provided
  const defaultSteps: StatusStep[] = [
    { title: "Order Placed", completed: true, current: false },
    { title: "Processing", completed: status !== "Not Shipped", current: status === "Processing" },
    { title: "Shipped", completed: ["In Transit", "Delivered"].includes(status), current: status === "Shipped" },
    { title: "In Transit", completed: status === "Delivered", current: status === "In Transit" },
    { title: "Delivered", completed: false, current: status === "Delivered" }
  ];

  // Use provided updates if available, otherwise use default steps
  const steps: StatusStep[] = updates.length > 0 
    ? updates.map(update => ({
        title: update.status,
        location: update.location,
        timestamp: update.timestamp,
        note: update.note,
        completed: true,
        current: update.status === status
      }))
    : defaultSteps;

  return (
    <div className="py-4">
      <div className="relative">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start mb-8 relative">
            <div className="flex flex-col items-center mr-4">
              <div className={`rounded-full p-1 ${
                step.completed 
                  ? "bg-primary text-primary-foreground" 
                  : step.current 
                    ? "bg-blue-100 text-blue-600 border border-blue-600" 
                    : "bg-gray-100 text-gray-400"
              }`}>
                {step.completed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : step.current ? (
                  <Truck className="h-5 w-5" />
                ) : (
                  <CircleDashed className="h-5 w-5" />
                )}
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-12 w-0.5 my-1 ${
                  step.completed ? "bg-primary" : "bg-gray-200"
                }`}></div>
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-medium ${
                step.current ? "text-blue-600" : step.completed ? "text-primary" : "text-gray-500"
              }`}>
                {step.title}
              </h3>
              {step.location && (
                <p className="text-sm text-muted-foreground">{step.location}</p>
              )}
              {step.timestamp && (
                <p className="text-xs text-muted-foreground">{step.timestamp}</p>
              )}
              {step.note && (
                <p className="text-sm mt-1">{step.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {steps.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No transportation information available
        </div>
      )}
    </div>
  );
};

export default TransportationStatus;

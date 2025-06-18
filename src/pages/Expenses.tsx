
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/chakra/Tabs";
import { Button } from "@/components/chakra/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { Plus, Calculator, FileText, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AddExpenseForm from "@/features/expenses/components/AddExpenseForm";
import ExpensesList from "@/features/expenses/components/ExpensesList";
import ExpenseCalculator from "@/features/expenses/components/ExpenseCalculator";
import MonthlyStatements from "@/features/expenses/components/MonthlyStatements";
import ExcelImportExport from "@/features/expenses/components/ExcelImportExport";

// Mock expenses data for demonstration
const mockExpenses = [
  {
    id: "1",
    description: "Office supplies",
    amount: 2500,
    category: "office",
    date: "2024-01-15",
    receipt: "Receipt details here"
  },
  {
    id: "2", 
    description: "Team lunch",
    amount: 1200,
    category: "meals",
    date: "2024-01-14",
  },
  {
    id: "3",
    description: "Travel expenses",
    amount: 5000,
    category: "travel", 
    date: "2024-01-13",
  }
];

const Expenses = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("project");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddExpenseSuccess = () => {
    setIsAddDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success("Expense added successfully!");
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Expenses Management</h1>
        <div className="flex gap-2">
          <ExcelImportExport />
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="project">Project Expenses</TabsTrigger>
          <TabsTrigger value="other">Other Expenses</TabsTrigger>
          <TabsTrigger value="statements">Monthly Statements</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <ExpenseCalculator />
        </TabsContent>

        <TabsContent value="project" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Expenses</CardTitle>
              <CardDescription>
                Track expenses related to project materials, transportation, team movements, and project-related travel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpensesList expenses={mockExpenses} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Other Expenses</CardTitle>
              <CardDescription>
                Track business-related expenses, travel, accommodation, food, and other non-project expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpensesList expenses={mockExpenses} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements" className="space-y-6">
          <MonthlyStatements expenses={mockExpenses} />
        </TabsContent>
      </Tabs>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <AddExpenseForm onSuccess={handleAddExpenseSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;

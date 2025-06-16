import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Trash2 } from "lucide-react";
import { ExpenseItem } from "../types/expenseTypes";
import { toast } from "sonner";

interface ExpensesListProps {
  type: 'project' | 'other';
  refreshTrigger: number;
}

const ExpensesList = ({ type, refreshTrigger }: ExpensesListProps) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [transactionFilter, setTransactionFilter] = useState("all");

  useEffect(() => {
    loadExpenses();
  }, [refreshTrigger]);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchQuery, categoryFilter, transactionFilter, type]);

  const loadExpenses = () => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    setExpenses(storedExpenses);
  };

  const filterExpenses = () => {
    let filtered = expenses.filter(expense => expense.type === type);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        (expense.projectName && expense.projectName.toLowerCase().includes(query))
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    if (transactionFilter !== "all") {
      filtered = filtered.filter(expense => expense.transactionType === transactionFilter);
    }

    setFilteredExpenses(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    toast.success("Expense deleted successfully");
  };

  const getUniqueCategories = () => {
    const categories = expenses
      .filter(expense => expense.type === type)
      .map(expense => expense.category);
    return [...new Set(categories)];
  };

  const getTotalReceived = () => {
    return filteredExpenses
      .filter(expense => expense.transactionType === 'received' || expense.transactionType === 'total_received')
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTotalSpent = () => {
    return filteredExpenses
      .filter(expense => expense.transactionType === 'spent')
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getBalance = () => {
    return getTotalReceived() - getTotalSpent();
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Total Received</h3>
          <p className="text-2xl font-bold text-green-600">₹{getTotalReceived().toLocaleString()}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">Total Spent</h3>
          <p className="text-2xl font-bold text-red-600">₹{getTotalSpent().toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-lg ${getBalance() >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
          <h3 className={`text-sm font-medium ${getBalance() >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>Balance</h3>
          <p className={`text-2xl font-bold ${getBalance() >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            ₹{getBalance().toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800">Total Entries</h3>
          <p className="text-2xl font-bold text-gray-600">{filteredExpenses.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {getUniqueCategories().map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={transactionFilter} onValueChange={setTransactionFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="spent">Spent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              {type === 'project' && <TableHead>Project</TableHead>}
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                <TableCell>{expense.category}</TableCell>
                {type === 'project' && <TableCell>{expense.projectName || '-'}</TableCell>}
                <TableCell>
                  <Badge variant={expense.transactionType === 'spent' ? 'destructive' : 'default'}>
                    {expense.transactionType === 'received' ? 'Received' : 
                     expense.transactionType === 'total_received' ? 'Total Received' : 'Spent'}
                  </Badge>
                </TableCell>
                <TableCell className={expense.transactionType === 'spent' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                  {expense.transactionType === 'spent' ? '-' : '+'}₹{expense.amount.toLocaleString()}
                </TableCell>
                <TableCell>{expense.paymentMethod}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteExpense(expense.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredExpenses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No expenses found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesList;

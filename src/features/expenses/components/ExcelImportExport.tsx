
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { ExpenseItem, PROJECT_EXPENSE_CATEGORIES, OTHER_EXPENSE_CATEGORIES, PAYMENT_METHODS } from "../types/expenseTypes";

interface ExcelImportExportProps {
  onDataChange: () => void;
}

const ExcelImportExport = ({ onDataChange }: ExcelImportExportProps) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const templateData = [
      ['Type (project/other)', 'Category', 'Project Name (if project)', 'Description', 'Amount', 'Transaction Type (received/spent)', 'Date (YYYY-MM-DD)', 'Payment Method'],
      ['project', 'Materials Purchase', 'Amni WTP', 'Sample description', '1000', 'spent', '2024-01-15', 'Bank Transfer'],
      ['other', 'Business Travel', '', 'Sample travel expense', '500', 'spent', '2024-01-16', 'Cash'],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, ws, 'Expense Template');
    XLSX.writeFile(wb, 'Expense_Import_Template.xlsx');
    toast.success("Template downloaded successfully!");
  };

  const exportAllExpenses = () => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    
    if (storedExpenses.length === 0) {
      toast.error("No expenses to export");
      return;
    }

    const exportData = [
      ['Date', 'Type', 'Category', 'Project Name', 'Description', 'Amount', 'Transaction Type', 'Payment Method'],
      ...storedExpenses.map((expense: ExpenseItem) => [
        expense.date,
        expense.type,
        expense.category,
        expense.projectName || '',
        expense.description,
        expense.amount,
        expense.transactionType,
        expense.paymentMethod
      ])
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, 'All Expenses');
    XLSX.writeFile(wb, `All_Expenses_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("All expenses exported successfully!");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row
        const rows = jsonData.slice(1) as any[][];
        const importedExpenses: ExpenseItem[] = [];
        const errors: string[] = [];

        rows.forEach((row, index) => {
          const rowNum = index + 2; // +2 because we skipped header and arrays are 0-indexed
          
          if (row.length < 8) {
            errors.push(`Row ${rowNum}: Missing required columns`);
            return;
          }

          const [type, category, projectName, description, amount, transactionType, date, paymentMethod] = row;

          // Validation
          if (!['project', 'other'].includes(type)) {
            errors.push(`Row ${rowNum}: Invalid type. Must be 'project' or 'other'`);
            return;
          }

          const validCategories = type === 'project' ? PROJECT_EXPENSE_CATEGORIES : OTHER_EXPENSE_CATEGORIES;
          if (!validCategories.includes(category)) {
            errors.push(`Row ${rowNum}: Invalid category '${category}' for type '${type}'`);
            return;
          }

          if (!description || description.trim() === '') {
            errors.push(`Row ${rowNum}: Description is required`);
            return;
          }

          if (isNaN(amount) || amount <= 0) {
            errors.push(`Row ${rowNum}: Invalid amount`);
            return;
          }

          if (!['received', 'spent'].includes(transactionType)) {
            errors.push(`Row ${rowNum}: Invalid transaction type. Must be 'received' or 'spent'`);
            return;
          }

          if (!PAYMENT_METHODS.includes(paymentMethod)) {
            errors.push(`Row ${rowNum}: Invalid payment method`);
            return;
          }

          // Parse date
          let parsedDate: string;
          try {
            if (typeof date === 'number') {
              // Excel date serial number
              const excelDate = new Date((date - 25569) * 86400 * 1000);
              parsedDate = excelDate.toISOString().split('T')[0];
            } else {
              parsedDate = new Date(date).toISOString().split('T')[0];
            }
          } catch {
            errors.push(`Row ${rowNum}: Invalid date format`);
            return;
          }

          const expense: ExpenseItem = {
            id: `import_${Date.now()}_${index}`,
            type: type as 'project' | 'other',
            category,
            projectName: type === 'project' && projectName ? projectName : undefined,
            description: description.trim(),
            amount: parseFloat(amount),
            transactionType: transactionType as 'received' | 'spent',
            date: parsedDate,
            paymentMethod,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          importedExpenses.push(expense);
        });

        if (errors.length > 0) {
          toast.error(`Import failed with ${errors.length} errors. Check console for details.`);
          console.error('Import errors:', errors);
          return;
        }

        if (importedExpenses.length === 0) {
          toast.error("No valid expenses found in the file");
          return;
        }

        // Save to localStorage
        const existingExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
        const allExpenses = [...existingExpenses, ...importedExpenses];
        localStorage.setItem('expenses', JSON.stringify(allExpenses));

        toast.success(`Successfully imported ${importedExpenses.length} expenses`);
        setIsImportDialogOpen(false);
        onDataChange();
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error("Failed to import file. Please check the format.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" onClick={downloadTemplate}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Download Template
        </Button>
        <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Import Excel
        </Button>
        <Button variant="outline" onClick={exportAllExpenses}>
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Expenses from Excel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Please ensure your Excel file has the following columns in order:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Type (project/other)</li>
                <li>Category</li>
                <li>Project Name (if project type)</li>
                <li>Description</li>
                <li>Amount</li>
                <li>Transaction Type (received/spent)</li>
                <li>Date (YYYY-MM-DD format)</li>
                <li>Payment Method</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadTemplate} className="flex-1">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExcelImportExport;

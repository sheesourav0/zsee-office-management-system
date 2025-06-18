
import React, { useState } from 'react';
import { Button } from '@/components/chakra/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/chakra/Dialog';
import { VStack, HStack, Input as ChakraInput } from '@chakra-ui/react';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface ExcelImportExportProps {
  onImport?: (data: any[]) => void;
  onExport?: () => any[];
}

const ExcelImportExport = ({ onImport, onExport }: ExcelImportExportProps) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (onImport) {
            onImport(jsonData);
            toast.success(`Imported ${jsonData.length} records successfully`);
          }
          setIsImportDialogOpen(false);
        } catch (error) {
          toast.error('Failed to import file');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = onExport ? onExport() : [];
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
      XLSX.writeFile(workbook, `expenses_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Expenses exported successfully');
    } catch (error) {
      toast.error('Failed to export expenses');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <HStack gap={2}>
        <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Import Excel
        </Button>
        <Button variant="outline" onClick={handleExport} loading={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          Export Excel
        </Button>
      </HStack>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Expenses from Excel</DialogTitle>
          </DialogHeader>
          <VStack gap={4}>
            <div className="text-center">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Upload an Excel file to import expenses
              </p>
            </div>
            <ChakraInput
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: .xlsx, .xls
            </p>
          </VStack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExcelImportExport;


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface POData {
  poNumber: string;
  date: string;
  project: string;
  vendor: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  deliveryDate: string;
  terms: string;
  specialInstructions?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  poNumber: string;
  vendor: string;
  invoiceDate: string;
  dueDate: string;
  baseAmount: number;
  taxRate: number;
  discount: number;
  taxAmount: number;
  totalAmount: number;
}

export const generatePOPDF = async (data: POData) => {
  const pdf = new jsPDF();
  
  // Company Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PURCHASE ORDER', 20, 30);
  
  // PO Details
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`PO Number: ${data.poNumber}`, 20, 50);
  pdf.text(`Date: ${data.date}`, 120, 50);
  pdf.text(`Project: ${data.project}`, 20, 65);
  pdf.text(`Vendor: ${data.vendor}`, 20, 80);
  
  // Delivery Date
  pdf.text(`Expected Delivery: ${data.deliveryDate}`, 20, 95);
  
  // Table Header
  pdf.setFont('helvetica', 'bold');
  pdf.text('Description', 20, 120);
  pdf.text('Qty', 100, 120);
  pdf.text('Unit Price', 130, 120);
  pdf.text('Total', 170, 120);
  
  // Table Line
  pdf.line(20, 125, 190, 125);
  
  // Table Content
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.description, 20, 140);
  pdf.text(data.quantity.toString(), 100, 140);
  pdf.text(`₹${data.unitPrice.toLocaleString()}`, 130, 140);
  pdf.text(`₹${data.totalAmount.toLocaleString()}`, 170, 140);
  
  // Total Line
  pdf.line(20, 145, 190, 145);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Total Amount: ₹${data.totalAmount.toLocaleString()}`, 130, 160);
  
  // Terms
  pdf.setFont('helvetica', 'normal');
  pdf.text('Payment Terms:', 20, 180);
  pdf.text(data.terms, 20, 195);
  
  // Special Instructions
  if (data.specialInstructions) {
    pdf.text('Special Instructions:', 20, 215);
    pdf.text(data.specialInstructions, 20, 230);
  }
  
  // Signature Section
  pdf.text('Authorized Signature: _________________', 20, 260);
  pdf.text('Date: _________________', 120, 260);
  
  return pdf;
};

export const generateInvoicePDF = async (data: InvoiceData) => {
  const pdf = new jsPDF();
  
  // Invoice Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TAX INVOICE', 20, 30);
  
  // Invoice Details
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Invoice Number: ${data.invoiceNumber}`, 20, 50);
  pdf.text(`Date: ${data.invoiceDate}`, 120, 50);
  pdf.text(`PO Reference: ${data.poNumber}`, 20, 65);
  pdf.text(`Due Date: ${data.dueDate}`, 120, 65);
  
  // Billed To
  pdf.setFont('helvetica', 'bold');
  pdf.text('Billed To:', 20, 85);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.vendor, 20, 100);
  
  // Invoice Table Header
  pdf.setFont('helvetica', 'bold');
  pdf.text('Description', 20, 130);
  pdf.text('Amount', 170, 130);
  
  // Table Line
  pdf.line(20, 135, 190, 135);
  
  // Invoice Items
  pdf.setFont('helvetica', 'normal');
  pdf.text('Base Amount', 20, 150);
  pdf.text(`₹${data.baseAmount.toLocaleString()}`, 170, 150);
  
  if (data.discount > 0) {
    const discountAmount = (data.baseAmount * data.discount) / 100;
    pdf.text(`Discount (${data.discount}%)`, 20, 165);
    pdf.text(`-₹${discountAmount.toLocaleString()}`, 170, 165);
  }
  
  pdf.text(`Tax (${data.taxRate}%)`, 20, 180);
  pdf.text(`₹${data.taxAmount.toLocaleString()}`, 170, 180);
  
  // Total Line
  pdf.line(20, 185, 190, 185);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Amount:', 20, 200);
  pdf.text(`₹${data.totalAmount.toLocaleString()}`, 170, 200);
  
  // Terms
  pdf.setFont('helvetica', 'normal');
  pdf.text('Terms & Conditions:', 20, 220);
  pdf.text('Payment due within 30 days', 20, 235);
  
  // Signature
  pdf.text('Authorized Signature: _________________', 20, 260);
  
  return pdf;
};

export const downloadPDF = (pdf: jsPDF, filename: string) => {
  pdf.save(filename);
};

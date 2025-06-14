
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
  gstRate?: number;
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
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
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
}

export const generatePOPDF = async (data: POData) => {
  const pdf = new jsPDF();
  
  // Company Header with Logo placeholder
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ZSEE SMART SOLUTION INDIA PVT LTD', 20, 25);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('CHETA VILLAGE-I, CHETA, Roing,', 20, 35);
  pdf.text('Lower Dibang Valley, Arunachal Pradesh, 792110', 20, 42);
  pdf.text('GSTIN: 12AABCZ1684M1Z2', 20, 49);
  
  // Purchase Order Title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Purchase Order', 105, 70, { align: 'center' });
  
  // PO Details Box
  pdf.rect(20, 80, 170, 25);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`PO No.: ${data.poNumber}`, 25, 88);
  pdf.text(`Date: ${data.date}`, 25, 95);
  pdf.text(`Project: ${data.project}`, 110, 88);
  pdf.text(`Delivery Date: ${data.deliveryDate}`, 110, 95);
  
  // Vendor Details
  pdf.setFont('helvetica', 'bold');
  pdf.text('Vendor Details:', 20, 120);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.vendor, 20, 130);
  
  // Items Table Header
  const tableTop = 150;
  pdf.rect(20, tableTop, 170, 15);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Sl No.', 25, tableTop + 10);
  pdf.text('Particulars of Work', 45, tableTop + 10);
  pdf.text('Quantity', 110, tableTop + 10);
  pdf.text('Unit', 130, tableTop + 10);
  pdf.text('Rate (Rs.)', 145, tableTop + 10);
  pdf.text('Amount', 170, tableTop + 10);
  
  // Items Table Content
  const itemTop = tableTop + 15;
  pdf.rect(20, itemTop, 170, 20);
  pdf.setFont('helvetica', 'normal');
  pdf.text('1', 25, itemTop + 10);
  
  // Split long descriptions
  const maxWidth = 60;
  const lines = pdf.splitTextToSize(data.description, maxWidth);
  let yPos = itemTop + 8;
  lines.forEach((line: string) => {
    pdf.text(line, 45, yPos);
    yPos += 4;
  });
  
  pdf.text(data.quantity.toString(), 110, itemTop + 10);
  pdf.text('Pcs', 130, itemTop + 10);
  pdf.text(`₹${data.unitPrice.toLocaleString()}`, 145, itemTop + 10);
  pdf.text(`₹${data.totalAmount.toLocaleString()}`, 170, itemTop + 10);
  
  // Tax Calculations
  const taxTop = itemTop + 25;
  const gstRate = data.gstRate || 18;
  const cgstRate = data.cgstRate || 9;
  const sgstRate = data.sgstRate || 9;
  
  const cgstAmount = (data.totalAmount * cgstRate) / 100;
  const sgstAmount = (data.totalAmount * sgstRate) / 100;
  const totalWithTax = data.totalAmount + cgstAmount + sgstAmount;
  
  pdf.text(`Sub Total: ₹${data.totalAmount.toLocaleString()}`, 140, taxTop);
  pdf.text(`CGST (${cgstRate}%): ₹${cgstAmount.toLocaleString()}`, 140, taxTop + 8);
  pdf.text(`SGST (${sgstRate}%): ₹${sgstAmount.toLocaleString()}`, 140, taxTop + 16);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Total Amount: ₹${totalWithTax.toLocaleString()}`, 140, taxTop + 28);
  
  // Terms & Conditions
  pdf.setFont('helvetica', 'bold');
  pdf.text('Terms & Conditions:', 20, taxTop + 45);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Payment Terms: ${data.terms}`, 20, taxTop + 55);
  
  if (data.specialInstructions) {
    pdf.text('Special Instructions:', 20, taxTop + 65);
    pdf.text(data.specialInstructions, 20, taxTop + 75);
  }
  
  // Signature
  pdf.text('Authorized Signatory', 20, 270);
  pdf.text('ZSEE Smart Solution India Pvt Ltd', 20, 280);
  
  return pdf;
};

export const generateInvoicePDF = async (data: InvoiceData) => {
  const pdf = new jsPDF();
  
  // Company Header
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ZSEE SMART SOLUTION INDIA PVT LTD', 20, 25);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('CHETA VILLAGE-I, CHETA, Roing,', 20, 35);
  pdf.text('Lower Dibang Valley, Arunachal Pradesh, 792110', 20, 42);
  pdf.text('PAN: AABCZ1684M | GSTIN: 12AABCZ1684M1Z2', 20, 49);
  
  // Invoice Title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Tax Invoice', 105, 70, { align: 'center' });
  
  // Invoice Details Table
  pdf.rect(20, 80, 85, 40);
  pdf.rect(105, 80, 85, 40);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Invoice No: ${data.invoiceNumber}`, 25, 90);
  pdf.text(`Invoice Date: ${data.invoiceDate}`, 25, 98);
  pdf.text(`PO Reference: ${data.poNumber}`, 25, 106);
  pdf.text(`Due Date: ${data.dueDate}`, 25, 114);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Billed to Party:', 110, 90);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.vendor, 110, 98);
  pdf.text('Address: [Vendor Address]', 110, 106);
  pdf.text('GSTIN: [Vendor GSTIN]', 110, 114);
  
  // Items Table
  const tableTop = 135;
  pdf.rect(20, tableTop, 170, 15);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Sl.', 25, tableTop + 10);
  pdf.text('Product Description', 40, tableTop + 10);
  pdf.text('Qty.', 100, tableTop + 10);
  pdf.text('Rate', 115, tableTop + 10);
  pdf.text('SGST', 130, tableTop + 10);
  pdf.text('CGST', 145, tableTop + 10);
  pdf.text('Total', 170, tableTop + 10);
  
  // Item row
  const itemTop = tableTop + 15;
  pdf.rect(20, itemTop, 170, 20);
  pdf.setFont('helvetica', 'normal');
  pdf.text('1', 25, itemTop + 10);
  pdf.text('Service/Product Description', 40, itemTop + 10);
  pdf.text('1', 100, itemTop + 10);
  pdf.text(`₹${data.baseAmount.toLocaleString()}`, 115, itemTop + 10);
  
  // Calculate tax amounts
  const cgstAmount = data.cgstAmount || (data.baseAmount * (data.taxRate / 2)) / 100;
  const sgstAmount = data.sgstAmount || (data.baseAmount * (data.taxRate / 2)) / 100;
  
  pdf.text(`₹${sgstAmount.toLocaleString()}`, 130, itemTop + 10);
  pdf.text(`₹${cgstAmount.toLocaleString()}`, 145, itemTop + 10);
  pdf.text(`₹${data.totalAmount.toLocaleString()}`, 170, itemTop + 10);
  
  // Total section
  const totalTop = itemTop + 30;
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Total Invoice Amount: ₹${data.totalAmount.toLocaleString()}`, 20, totalTop);
  
  // Amount in words (placeholder)
  pdf.setFont('helvetica', 'normal');
  pdf.text('Total Invoice Amount (in words): [Amount in Words]', 20, totalTop + 10);
  
  // Bank Details
  pdf.setFont('helvetica', 'bold');
  pdf.text("Company's Bank Details", 20, totalTop + 25);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Bank Name: HDFC Bank', 20, totalTop + 35);
  pdf.text('Bank Account Number: 50200078568850', 20, totalTop + 43);
  pdf.text('Branch Name: Chandmari', 20, totalTop + 51);
  pdf.text('IFS Code: HDFC0000631', 20, totalTop + 59);
  
  // Declaration
  pdf.setFont('helvetica', 'bold');
  pdf.text('Declaration', 20, totalTop + 75);
  pdf.setFont('helvetica', 'normal');
  pdf.text('We declare that this invoice shows the actual price of the goods described', 20, totalTop + 85);
  pdf.text('and that all particulars are true and correct.', 20, totalTop + 93);
  
  // Signature
  pdf.text('Authorised Signatory', 20, 270);
  pdf.text('For, ZSEE Smart Solution India Private Limited', 20, 280);
  
  return pdf;
};

export const downloadPDF = (pdf: jsPDF, filename: string) => {
  pdf.save(filename);
};

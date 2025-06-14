
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface POData {
  poNumber: string;
  date: string;
  project: string;
  vendor: string;
  vendorDetails: {
    name: string;
    address: string;
    gstin: string;
    email?: string;
    phone?: string;
  };
  items: Array<{
    slNo: number;
    description: string;
    quantity: number;
    unit: string;
    gstRate: number;
    rate: number;
    amount: number;
  }>;
  deliveryDate: string;
  terms: string;
  specialInstructions?: string;
  deliveryAddress?: string;
  contactDetails?: string;
  dispatchPeriod?: string;
  transportationCharges?: string;
  priceBasis?: string;
  paymentTerms?: string;
  materialRequiredFor?: string;
  requisitionedBy?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  pan: string;
  gstin: string;
  state: string;
  code: string;
  billedToParty: {
    name: string;
    address: string;
    gstin: string;
    state: string;
    code: string;
  };
  items: Array<{
    slNo: number;
    description: string;
    quantity: number;
    rate: number;
    sgstRate: number;
    sgstAmount: number;
    cgstRate: number;
    cgstAmount: number;
    total: number;
  }>;
  totalInvoiceAmount: number;
  totalInWords: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    branchName: string;
    ifscCode: string;
  };
}

export const generatePOPDF = async (data: POData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Add ZSEE logo placeholder in top right
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ZSEE', 180, 20);
  
  // Purchase Order Header
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Purchase Order', 105, 35, { align: 'center' });
  
  // Create table structure for seller details and PO info
  let yPos = 50;
  
  // Seller Details Section
  pdf.rect(15, yPos, 90, 60);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Seller Details', 20, yPos + 8);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.vendorDetails.name, 20, yPos + 18);
  const addressLines = pdf.splitTextToSize(data.vendorDetails.address, 80);
  let addressY = yPos + 25;
  addressLines.forEach((line: string) => {
    pdf.text(line, 20, addressY);
    addressY += 5;
  });
  
  pdf.text(`GSTIN: ${data.vendorDetails.gstin}`, 20, addressY + 5);
  if (data.vendorDetails.email) {
    pdf.text(`Email: ${data.vendorDetails.email}`, 20, addressY + 10);
  }
  if (data.vendorDetails.phone) {
    pdf.text(`PH No. ${data.vendorDetails.phone}`, 20, addressY + 15);
  }
  
  // PO Details Section
  pdf.rect(110, yPos, 85, 60);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PO No.', 115, yPos + 8);
  pdf.text('Date', 115, yPos + 18);
  pdf.text('Qtn No. & Date', 115, yPos + 28);
  pdf.text('GSTIN', 115, yPos + 38);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.poNumber, 150, yPos + 8);
  pdf.text(data.date, 150, yPos + 18);
  pdf.text('Nil dtd. 08.05.2025', 150, yPos + 28);
  pdf.text('12AABCZ1684M1Z2', 150, yPos + 38);
  
  yPos += 70;
  
  // Items Table Header
  pdf.rect(15, yPos, 180, 15);
  pdf.setFillColor(200, 220, 255);
  pdf.rect(15, yPos, 180, 15, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Sl No.', 20, yPos + 10);
  pdf.text('Particulars of Work', 35, yPos + 10);
  pdf.text('Quantity', 90, yPos + 10);
  pdf.text('Unit', 110, yPos + 10);
  pdf.text('GST Rate', 125, yPos + 10);
  pdf.text('Rate (Rs.)', 145, yPos + 10);
  pdf.text('Amount', 170, yPos + 10);
  
  yPos += 15;
  
  // Items
  data.items.forEach((item, index) => {
    const itemHeight = 20;
    pdf.rect(15, yPos, 180, itemHeight);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.slNo.toString(), 20, yPos + 12);
    
    const descLines = pdf.splitTextToSize(item.description, 50);
    let descY = yPos + 8;
    descLines.forEach((line: string) => {
      pdf.text(line, 35, descY);
      descY += 4;
    });
    
    pdf.text(item.quantity.toString(), 90, yPos + 12);
    pdf.text(item.unit, 110, yPos + 12);
    pdf.text(`${item.gstRate}%`, 125, yPos + 12);
    pdf.text(`${item.rate.toFixed(2)}`, 145, yPos + 12);
    pdf.text(`${item.amount.toLocaleString()}`, 170, yPos + 12);
    
    yPos += itemHeight;
  });
  
  // Subtotal and Tax Calculations
  const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
  const totalGst = data.items.reduce((sum, item) => sum + (item.amount * item.gstRate / 100), 0);
  const grandTotal = subtotal + totalGst;
  
  yPos += 10;
  pdf.text(`Sub Total (i.i. & iv): ${subtotal.toLocaleString()}`, 120, yPos);
  yPos += 8;
  pdf.text(`CGST 9%: -`, 120, yPos);
  yPos += 8;
  pdf.text(`SGST 9%: -`, 120, yPos);
  yPos += 8;
  pdf.text(`IGST 18%: ${totalGst.toLocaleString()}`, 120, yPos);
  yPos += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Total Amount (Rs.): ${grandTotal.toLocaleString()}`, 120, yPos);
  
  // Terms & Conditions
  yPos += 20;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Terms & Conditions:', 15, yPos);
  
  yPos += 10;
  pdf.setFont('helvetica', 'normal');
  const termsData = [
    ['Delivery Address', data.deliveryAddress || ''],
    ['Contact Details', data.contactDetails || ''],
    ['Dispatch Period', data.dispatchPeriod || 'Immediate'],
    ['Transportation Charges', data.transportationCharges || 'Extra as Actual'],
    ['Price Basis', data.priceBasis || 'Ex-works'],
    ['Payment Terms', data.paymentTerms || '100% payment against PI prior to dispatch'],
    ['Special Instruction', data.specialInstructions || 'N/A'],
    ['Material Required For', data.materialRequiredFor || ''],
    ['Requisitioned by', data.requisitionedBy || '']
  ];
  
  termsData.forEach(([label, value]) => {
    if (value) {
      pdf.text(`${label}: ${value}`, 15, yPos);
      yPos += 8;
    }
  });
  
  // Signature
  yPos += 20;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Authorized Signatory', 15, yPos);
  pdf.text('ZSEE Smart Solution India Pvt Ltd', 15, yPos + 10);
  
  // Footer
  pdf.setFontSize(8);
  pdf.text('ZSEE SMART SOLUTION INDIA PVT LTD', 105, 280, { align: 'center' });
  pdf.text('CIN : U74999KL2018PTC051862  PAN & IEC: AABCZ1684M  GST:12AABCZ1684M1Z2', 105, 285, { align: 'center' });
  pdf.text('Arunachal Prdesh Office: CHETA VILLAGE-I, CHETA, Roing, Lower Dibang Valley, Arunachal Pradesh, 792110', 105, 290, { align: 'center' });
  
  return pdf;
};

export const generateInvoicePDF = async (data: InvoiceData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Add ZSEE logo placeholder in top right
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ZSEE', 180, 20);
  
  // Tax Invoice Header
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Tax Invoice', 105, 35, { align: 'center' });
  
  // Invoice details table
  let yPos = 50;
  
  // Left side - Invoice details
  pdf.rect(15, yPos, 90, 60);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Invoice No: ${data.invoiceNumber}`, 20, yPos + 10);
  pdf.text(`Invoice Date: ${data.invoiceDate}`, 20, yPos + 20);
  pdf.text(`PAN: ${data.pan}`, 20, yPos + 30);
  pdf.text(`GSTIN: ${data.gstin}`, 20, yPos + 40);
  pdf.text(`State: ${data.state}`, 20, yPos + 50);
  pdf.text(`Code: ${data.code}`, 20, yPos + 60);
  
  // Right side - Billed to Party
  pdf.rect(110, yPos, 85, 60);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Billed to Party:', 115, yPos + 10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Name: ${data.billedToParty.name}`, 115, yPos + 20);
  const addressLines = pdf.splitTextToSize(data.billedToParty.address, 70);
  let addressY = yPos + 30;
  addressLines.forEach((line: string) => {
    pdf.text(`Address: ${line}`, 115, addressY);
    addressY += 5;
  });
  pdf.text(`GSTIN: ${data.billedToParty.gstin}`, 115, addressY + 5);
  pdf.text(`State: ${data.billedToParty.state}`, 115, addressY + 15);
  pdf.text(`Code: ${data.billedToParty.code}`, 115, addressY + 25);
  
  yPos += 70;
  
  // Items Table Header
  pdf.rect(15, yPos, 180, 15);
  pdf.setFillColor(200, 220, 255);
  pdf.rect(15, yPos, 180, 15, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Sl. No.', 20, yPos + 10);
  pdf.text('Product Description', 35, yPos + 10);
  pdf.text('Qnty.', 80, yPos + 10);
  pdf.text('Rate', 95, yPos + 10);
  pdf.text('SGST', 115, yPos + 10);
  pdf.text('CGST', 140, yPos + 10);
  pdf.text('Total', 170, yPos + 10);
  
  // Sub headers for SGST and CGST
  pdf.setFontSize(8);
  pdf.text('Rate | Amount', 110, yPos + 5);
  pdf.text('Rate | Amount', 135, yPos + 5);
  
  yPos += 15;
  
  // Items
  data.items.forEach((item) => {
    const itemHeight = 40;
    pdf.rect(15, yPos, 180, itemHeight);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.slNo.toString(), 20, yPos + 15);
    
    const descLines = pdf.splitTextToSize(item.description, 40);
    let descY = yPos + 10;
    descLines.forEach((line: string) => {
      pdf.text(line, 35, descY);
      descY += 4;
    });
    
    pdf.text(`${item.quantity} lot`, 80, yPos + 15);
    pdf.text(item.rate.toLocaleString(), 95, yPos + 15);
    pdf.text(`${item.sgstRate}%`, 110, yPos + 12);
    pdf.text(item.sgstAmount.toLocaleString(), 110, yPos + 20);
    pdf.text(`${item.cgstRate}%`, 135, yPos + 12);
    pdf.text(item.cgstAmount.toLocaleString(), 135, yPos + 20);
    pdf.text(item.total.toLocaleString(), 170, yPos + 15);
    
    yPos += itemHeight;
  });
  
  // Total section
  yPos += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Total Invoice Amount (in words): ${data.totalInWords}`, 20, yPos);
  pdf.text(`Total amount after Tax: ${data.totalInvoiceAmount.toLocaleString()}`, 140, yPos);
  
  // Bank Details
  yPos += 20;
  pdf.setFont('helvetica', 'bold');
  pdf.text("Company's Bank Details", 20, yPos);
  
  yPos += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Bank Name: ${data.bankDetails.bankName}`, 20, yPos);
  pdf.text(`Bank Account Number: ${data.bankDetails.accountNumber}`, 20, yPos + 8);
  pdf.text(`Branch Name: ${data.bankDetails.branchName}`, 20, yPos + 16);
  pdf.text(`IFS Code: ${data.bankDetails.ifscCode}`, 20, yPos + 24);
  
  // Declaration
  yPos += 40;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Declaration', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text('We declare that this invoice shows the actual price of the goods described', 20, yPos + 10);
  pdf.text('and that all particulars are true and correct.', 20, yPos + 18);
  
  // Signature section
  yPos += 40;
  pdf.setFont('helvetica', 'normal');
  pdf.text('Authorised Signatory', 20, yPos);
  pdf.text('For, ZSEE Smart Solution India Private Limited', 20, yPos + 10);
  
  return pdf;
};

export const downloadPDF = (pdf: jsPDF, filename: string) => {
  pdf.save(filename);
};

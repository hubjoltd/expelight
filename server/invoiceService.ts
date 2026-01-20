import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  variant?: string;
}

interface OrderData {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  phone: string;
  email: string;
  createdAt: Date;
  status?: string;
}

interface UserData {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}

interface InvoiceData {
  invoiceNumber: string;
  order: OrderData;
  user: UserData;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  taxBreakdown: {
    cgst: number;
    sgst: number;
    igst: number;
    gstRate: number;
  };
}

const INVOICES_DIR = path.join(process.cwd(), "public", "invoices");

function ensureInvoiceDir() {
  if (!fs.existsSync(INVOICES_DIR)) {
    fs.mkdirSync(INVOICES_DIR, { recursive: true });
  }
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `EXP-${year}${month}${day}-${random}`;
}

export function calculateTax(subtotal: number, isInterstate: boolean = false) {
  const gstRate = 18;
  const taxAmount = Math.round(subtotal * gstRate / 100);
  
  if (isInterstate) {
    return {
      cgst: 0,
      sgst: 0,
      igst: taxAmount,
      gstRate,
      totalTax: taxAmount,
    };
  } else {
    const halfTax = Math.round(taxAmount / 2);
    return {
      cgst: halfTax,
      sgst: halfTax,
      igst: 0,
      gstRate,
      totalTax: halfTax * 2,
    };
  }
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<string> {
  ensureInvoiceDir();
  
  const fileName = `${invoiceData.invoiceNumber}.pdf`;
  const filePath = path.join(INVOICES_DIR, fileName);
  
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      margin: 50,
      size: "A4",
    });
    
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const pageWidth = doc.page.width - 100;
    
    doc.fillColor("#E53935")
       .fontSize(28)
       .font("Helvetica-Bold")
       .text("EXPELIGHT", 50, 50);
    
    doc.fillColor("#666666")
       .fontSize(10)
       .font("Helvetica")
       .text("Premium Automotive LED Lighting", 50, 85)
       .text("Official Diode Dynamics Partner - India", 50, 100);

    doc.fillColor("#333333")
       .fontSize(24)
       .font("Helvetica-Bold")
       .text("TAX INVOICE", 400, 50, { align: "right", width: 145 });
    
    doc.fillColor("#666666")
       .fontSize(10)
       .font("Helvetica")
       .text(`Invoice No: ${invoiceData.invoiceNumber}`, 400, 85, { align: "right", width: 145 })
       .text(`Date: ${new Date(invoiceData.order.createdAt).toLocaleDateString("en-IN")}`, 400, 100, { align: "right", width: 145 });

    doc.moveTo(50, 130)
       .lineTo(545, 130)
       .strokeColor("#E5E5E5")
       .stroke();

    doc.fillColor("#333333")
       .fontSize(12)
       .font("Helvetica-Bold")
       .text("Bill To:", 50, 150);
    
    const customerName = invoiceData.user.firstName && invoiceData.user.lastName
      ? `${invoiceData.user.firstName} ${invoiceData.user.lastName}`
      : invoiceData.user.email.split("@")[0];
    
    doc.fillColor("#333333")
       .fontSize(11)
       .font("Helvetica")
       .text(customerName, 50, 170)
       .text(invoiceData.order.email, 50, 185)
       .text(invoiceData.order.phone, 50, 200);

    const addressLines = invoiceData.order.shippingAddress.split(",").map(s => s.trim());
    let yPos = 215;
    addressLines.forEach((line) => {
      doc.text(line, 50, yPos);
      yPos += 15;
    });

    doc.fillColor("#333333")
       .fontSize(12)
       .font("Helvetica-Bold")
       .text("Order Details:", 350, 150);
    
    doc.fillColor("#333333")
       .fontSize(10)
       .font("Helvetica")
       .text(`Order ID: ${invoiceData.order.id.slice(-8).toUpperCase()}`, 350, 170)
       .text(`Status: ${invoiceData.order.status || "Confirmed"}`, 350, 185);

    const tableTop = Math.max(yPos, 250) + 20;
    
    doc.rect(50, tableTop, pageWidth, 30)
       .fillColor("#F5F5F5")
       .fill();
    
    doc.fillColor("#333333")
       .fontSize(10)
       .font("Helvetica-Bold")
       .text("#", 60, tableTop + 10)
       .text("Item Description", 80, tableTop + 10)
       .text("Qty", 350, tableTop + 10)
       .text("Price", 400, tableTop + 10)
       .text("Amount", 470, tableTop + 10);

    let itemY = tableTop + 40;
    invoiceData.order.items.forEach((item, index) => {
      doc.fillColor("#333333")
         .fontSize(10)
         .font("Helvetica")
         .text((index + 1).toString(), 60, itemY)
         .text(item.name.substring(0, 40), 80, itemY, { width: 260 })
         .text(item.quantity.toString(), 350, itemY)
         .text(`₹${item.price.toLocaleString("en-IN")}`, 400, itemY)
         .text(`₹${(item.quantity * item.price).toLocaleString("en-IN")}`, 470, itemY);
      
      if (item.variant) {
        doc.fillColor("#666666")
           .fontSize(8)
           .text(`Variant: ${item.variant}`, 80, itemY + 15);
        itemY += 30;
      } else {
        itemY += 25;
      }
    });

    doc.moveTo(50, itemY + 10)
       .lineTo(545, itemY + 10)
       .strokeColor("#E5E5E5")
       .stroke();

    const summaryY = itemY + 30;
    const labelX = 350;
    const valueX = 470;
    
    doc.fillColor("#333333")
       .fontSize(10)
       .font("Helvetica")
       .text("Subtotal:", labelX, summaryY)
       .text(`₹${invoiceData.subtotal.toLocaleString("en-IN")}`, valueX, summaryY);
    
    let currentY = summaryY + 20;
    
    if (invoiceData.taxBreakdown.cgst > 0) {
      doc.text(`CGST (${invoiceData.taxBreakdown.gstRate/2}%):`, labelX, currentY)
         .text(`₹${invoiceData.taxBreakdown.cgst.toLocaleString("en-IN")}`, valueX, currentY);
      currentY += 18;
      
      doc.text(`SGST (${invoiceData.taxBreakdown.gstRate/2}%):`, labelX, currentY)
         .text(`₹${invoiceData.taxBreakdown.sgst.toLocaleString("en-IN")}`, valueX, currentY);
      currentY += 18;
    } else if (invoiceData.taxBreakdown.igst > 0) {
      doc.text(`IGST (${invoiceData.taxBreakdown.gstRate}%):`, labelX, currentY)
         .text(`₹${invoiceData.taxBreakdown.igst.toLocaleString("en-IN")}`, valueX, currentY);
      currentY += 18;
    }
    
    if (invoiceData.shippingAmount > 0) {
      doc.text("Shipping:", labelX, currentY)
         .text(`₹${invoiceData.shippingAmount.toLocaleString("en-IN")}`, valueX, currentY);
      currentY += 18;
    } else {
      doc.text("Shipping:", labelX, currentY)
         .fillColor("#27AE60")
         .text("FREE", valueX, currentY);
      doc.fillColor("#333333");
      currentY += 18;
    }
    
    if (invoiceData.discountAmount > 0) {
      doc.text("Discount:", labelX, currentY)
         .fillColor("#E53935")
         .text(`-₹${invoiceData.discountAmount.toLocaleString("en-IN")}`, valueX, currentY);
      doc.fillColor("#333333");
      currentY += 18;
    }

    doc.moveTo(labelX, currentY + 5)
       .lineTo(545, currentY + 5)
       .strokeColor("#333333")
       .lineWidth(2)
       .stroke();
    
    currentY += 20;
    doc.fillColor("#333333")
       .fontSize(14)
       .font("Helvetica-Bold")
       .text("Total:", labelX, currentY)
       .text(`₹${invoiceData.order.totalAmount.toLocaleString("en-IN")}`, valueX, currentY);

    const footerY = doc.page.height - 100;
    
    doc.moveTo(50, footerY - 20)
       .lineTo(545, footerY - 20)
       .strokeColor("#E5E5E5")
       .lineWidth(1)
       .stroke();
    
    doc.fillColor("#666666")
       .fontSize(9)
       .font("Helvetica")
       .text("Thank you for choosing Expelight!", 50, footerY, { align: "center", width: pageWidth })
       .text("For support: support@expelight.com | WhatsApp: +91 XXXXXXXXXX", 50, footerY + 15, { align: "center", width: pageWidth })
       .text("Warranty: 8 Years | All products are SAE-compliant", 50, footerY + 30, { align: "center", width: pageWidth });
    
    doc.fillColor("#999999")
       .fontSize(8)
       .text("This is a computer-generated invoice and does not require a signature.", 50, footerY + 50, { align: "center", width: pageWidth });

    doc.end();
    
    stream.on("finish", () => {
      resolve(`/invoices/${fileName}`);
    });
    
    stream.on("error", reject);
  });
}

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface JsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

interface OrderItem {
  productId: number;
  quantity: number;
}

interface Order {
  id: string | number;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  groupBuyId: number;
}

interface Organization {
  name: string;
  inn: string;
  kpp?: string;
  address?: string;
}

interface Product {
  name: string;
  price: number;
}

export const generateInvoicePDF = (order: Order, product: Product | null | undefined, organization: Organization | null) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.text('INVOICE / SCHET-FAKTURA', 14, 20);

  doc.setFontSize(12);
  doc.text(`Order #: ${order.id}`, 14, 30);
  doc.text(`Date: ${order.date}`, 14, 36);

  // Seller Info
  doc.setFontSize(14);
  doc.text('Seller:', 14, 50);
  doc.setFontSize(10);
  doc.text('Portrade Platform LLC', 14, 56);
  doc.text('INN: 7799123456', 14, 60);
  doc.text('Moscow, Russia', 14, 64);

  // Buyer Info
  doc.setFontSize(14);
  doc.text('Buyer:', 14, 80);
  doc.setFontSize(10);
  if (organization) {
    doc.text(`Name: ${organization.name || 'Organization'}`, 14, 86);
    doc.text(`INN: ${organization.inn}`, 14, 90);
  }

  // Table
  const tableColumn = ["#", "Item", "Quantity", "Price", "Total"];
  const tableRows: string[][] = [];

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const productName = product?.name || `Lot #${order.groupBuyId}`;
  const price = product?.price || (totalQuantity > 0 ? order.total / totalQuantity : 0);

  order.items.forEach((item, idx) => {
    const itemName = idx === 0 && product ? product.name : `Product #${item.productId}`;
    const itemPrice = product?.price || (item.quantity > 0 ? (order.total / totalQuantity) : 0);
    tableRows.push([
      (idx + 1).toString(),
      itemName,
      item.quantity.toString(),
      `${Math.round(itemPrice)} RUB`,
      `${Math.round(itemPrice * item.quantity)} RUB`
    ]);
  });

  autoTable(doc, {
    startY: 100,
    head: [tableColumn],
    body: tableRows,
  });

  const finalY = (doc as unknown as JsPDFWithAutoTable).lastAutoTable.finalY;

  doc.text(`Total Amount: ${order.total} RUB`, 14, finalY + 10);
  
  // Footer
  doc.setFontSize(8);
  doc.text('Thank you for your business!', 14, finalY + 30);
  doc.text('Payment due within 3 days.', 14, finalY + 35);

  return doc;
};

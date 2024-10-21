const fs = require("fs");
const { statement } = require("./utils/statement");
const { htmlInvoice } = require("./utils/create-invoice");
const { createFolder } = require("./utils/create-folder");

const plays = JSON.parse(fs.readFileSync("./data/plays.json"));
const invoices = JSON.parse(fs.readFileSync("./data/invoices.json"));

const processedInvoice = invoices.map((invoice) => statement(invoice, plays));
const processedHtmlInvoice = processedInvoice.map((invoice) => ({
  customerName: invoice.customer,
  html: htmlInvoice(invoice),
}));

createFolder("./output");
processedHtmlInvoice.forEach((invoice) => {
  fs.writeFileSync(`./output/${invoice.customerName}.html`, invoice.html);
});

const fs = require("fs");
const { statement } = require("./statement");
const { htmlInvoice } = require("./invoice");

const plays = JSON.parse(fs.readFileSync("./plays.json"));
const invoices = JSON.parse(fs.readFileSync("./invoices.json"));

const processedInvoice = invoices.map((invoice) => statement(invoice, plays));
const processedHtmlInvoice = processedInvoice.map(htmlInvoice);

fs.writeFileSync("./processedInvoice.html", processedHtmlInvoice.join("\n"));

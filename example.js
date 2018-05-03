
var FPDF = require('./fpdf.js');
var pdf = new FPDF();
pdf.CreatePDF();
pdf.AddPage();
pdf.SetFont('Arial','B',16);
pdf.Cell(40,10,'Hello World!');
pdf.Output('F','example.pdf');

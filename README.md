
FPDF Module
===========

Node.js version of ASP (classic) version of fpdf for PHP
Original work by Lorenzo Abbati, site offline, you can found at [Web Archive](https://web.archive.org/web/20100408094356/http://www.aspxnet.it:80/public/Default.asp?page=58)
The impetus for this is for low level control over the creation of PDF documents with no unnecessary dependencies, such as TypeScript or CoffeeScript.

Description

This exports the FPDF object that implements an API for the creation of PDF
documents through low level controls--provides flexibility without much in
terms of time learning or developing.  Furthermore, skills in FPDF for PHP 
are directly translatable to this module for Node.js.


Documentation

You may use the documentation for the original PHP version.  Just remember to
translate the syntax.  For example, this minimal example from http://fpdf.org
may be translated as follows:

Differences from PHP Version

While converting, I noticed not everything is identical to the original PHP 
version.  I modified a few things to bring it more into compliance.  I 
completely rewrote the .Output() method for compliance.  And to work with
the Express web framework, I added an extra parameter in which to put the
Express response object.  Of course, that isn't necessary.  The option to
write a file to disk or return as a string could be used, if you are not
using Express.

PHP Version
--------------------------------------

<?php
require('fpdf.php');

$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial','B',16);
$pdf->Cell(40,10,'Hello World!');
$pdf->Output('F','example.pdf');
?>

-------------------------------------

Node.js Translation
-------------------------------------

var FPDF = require('fpdf.js');
var pdf = new FPDF();
pdf.AddPage();
pdf.SetFont('Arial','B',16);
pdf.Cell(40,10,'Hello World!');
pdf.Output();

-------------------------------------






<?php
require("fpdf186/fpdf.php");

$monto = $_GET["monto"] ?? 0;
$saldo = $_GET["saldo"] ?? 0;

$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont("Courier", "B", 16);
$pdf->Cell(0, 10, "Cajero Automatico", 0, 1, "C");
$pdf->SetFont("Courier", "", 12);
$pdf->Cell(0, 10, "Monto retirado: $" . number_format($monto, 0, ',', '.'), 0, 1);
$pdf->Cell(0, 10, "Saldo disponible: $" . number_format($saldo, 0, ',', '.'), 0, 1);
$pdf->Cell(0, 10, "Fecha: " . date("d/m/Y H:i"), 0, 1);
$pdf->Cell(0, 10, "Gracias por usar el cajero", 0, 1);
$pdf->Output();

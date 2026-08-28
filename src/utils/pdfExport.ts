import { PeriodLog, SymptomLog, PcodResult, UserProfile } from '../types';

export function exportHealthPdfReport(
  profile: UserProfile,
  periodLogs: PeriodLog[],
  symptomLogs: SymptomLog[],
  pcodResult?: PcodResult
) {
  try {
    const jsPDF = (window as any).jspdf?.jsPDF;
    if (!jsPDF) {
      alert("jsPDF library is still loading or unavailable. Please try again in a moment.");
      return;
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Header Banner
    doc.setFillColor(185, 86, 121); // #B95679
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("PeriodTracker - Personal Health & Cycle Report", 14, 15);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString()} | 100% Private Offline Document`, 14, 22);

    let y = 38;

    // Patient Profile Box
    doc.setDrawColor(185, 86, 121);
    doc.setLineWidth(0.5);
    doc.setFillColor(255, 248, 248);
    doc.roundedRect(14, y, pageWidth - 28, 26, 3, 3, 'FD');

    doc.setTextColor(22, 33, 62);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Patient Information Profile", 18, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Name: ${profile.name || 'User'}`, 18, y + 16);
    doc.text(`Average Cycle Length: ${profile.avgCycleLength} Days`, 90, y + 16);
    doc.text(`Average Period Duration: ${profile.avgPeriodLength} Days`, 90, y + 21);
    doc.text(`Last Period Start: ${profile.lastPeriodDate || 'N/A'}`, 18, y + 21);

    y += 34;

    // PCOD Risk Assessment Summary (if available)
    if (pcodResult) {
      doc.setFillColor(245, 245, 250);
      doc.setDrawColor(200, 200, 220);
      doc.roundedRect(14, y, pageWidth - 28, 38, 3, 3, 'FD');

      doc.setTextColor(185, 86, 121);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("PCOD / PCOS Clinical Screening Assessment", 18, y + 8);

      doc.setTextColor(22, 33, 62);
      doc.setFontSize(10);
      doc.text(`Assessment Date: ${pcodResult.date}`, 18, y + 15);
      doc.text(`Total Screening Score: ${pcodResult.totalScore} / 20`, 85, y + 15);

      const riskColor = pcodResult.riskLevel === 'High' ? [220, 53, 69] : pcodResult.riskLevel === 'Moderate' ? [255, 152, 0] : [40, 167, 69];
      doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text(`Risk Level Status: ${pcodResult.riskLevel} Risk`, 140, y + 15);

      doc.setTextColor(60, 60, 80);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Key Recommendations:", 18, y + 22);
      
      let recY = y + 27;
      pcodResult.recommendations.slice(0, 2).forEach(rec => {
        const splitText = doc.splitTextToSize(`• ${rec}`, pageWidth - 42);
        doc.text(splitText, 18, recY);
        recY += 5;
      });

      y += 44;
    }

    // Period History Table
    doc.setTextColor(185, 86, 121);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Cycle Logs & Period History", 14, y);
    y += 6;

    // Table Header
    doc.setFillColor(185, 86, 121);
    doc.rect(14, y, pageWidth - 28, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Start Date", 18, y + 5.5);
    doc.text("End Date", 60, y + 5.5);
    doc.text("Flow Intensity", 100, y + 5.5);
    doc.text("Notes / Observations", 145, y + 5.5);

    y += 8;

    const recentLogs = periodLogs.slice(0, 8);
    if (recentLogs.length === 0) {
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "italic");
      doc.text("No period logs recorded yet.", 18, y + 6);
      y += 10;
    } else {
      recentLogs.forEach((log, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, 248, 248);
        doc.rect(14, y, pageWidth - 28, 7, 'F');

        doc.setTextColor(22, 33, 62);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(log.startDate, 18, y + 5);
        doc.text(log.endDate, 60, y + 5);
        doc.text(log.flow.toUpperCase(), 100, y + 5);
        doc.text(log.notes ? log.notes.substring(0, 30) : '-', 145, y + 5);

        y += 7;
      });
    }

    y += 6;

    // Symptom Logs Section
    doc.setTextColor(185, 86, 121);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Recent Symptom Logs", 14, y);
    y += 6;

    const recentSymptoms = symptomLogs.slice(0, 6);
    if (recentSymptoms.length === 0) {
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "italic");
      doc.text("No symptoms logged recently.", 18, y + 6);
      y += 10;
    } else {
      recentSymptoms.forEach(sym => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(22, 33, 62);
        const symptomTypesStr = sym.symptoms.map(s => `${s.type} (lvl ${s.severity})`).join(', ');
        doc.text(`Date ${sym.date}:`, 18, y + 4);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 100);
        doc.text(symptomTypesStr, 48, y + 4);
        y += 6;
      });
    }

    // Disclaimer Footer
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 140);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Disclaimer: This document is generated from user offline self-logged data. It is intended for personal reference and clinical consultation.",
      14,
      doc.internal.pageSize.getHeight() - 10
    );

    doc.save(`PeriodTracker_Health_Report_${profile.name || 'User'}.pdf`);
  } catch (err) {
    console.error("PDF generation error:", err);
    alert("Could not generate PDF: " + err);
  }
}

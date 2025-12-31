import jsPDF from "jspdf";
import { categories, questions } from "@/data/bookQuestions";

interface BookData {
  title: string;
  subtitle?: string;
  dedication?: string;
  coverColor?: string;
  bookType?: string;
}

interface PrintSettings {
  bleedMM: number; // Bleed in millimeters (typically 3mm)
  trimWidth: number; // Final trim width in mm (e.g., 152.4 for 6")
  trimHeight: number; // Final trim height in mm (e.g., 228.6 for 9")
  paperWeightGSM: number; // Paper weight for spine calculation
}

const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  bleedMM: 3,
  trimWidth: 152.4, // 6 inches
  trimHeight: 228.6, // 9 inches
  paperWeightGSM: 80, // Standard book paper
};

// Calculate spine width based on page count and paper weight
const calculateSpineWidth = (pageCount: number, paperGSM: number): number => {
  // Approximate formula: pages * paper thickness
  // 80gsm paper ≈ 0.05mm per sheet (2 pages)
  const sheetsNeeded = Math.ceil(pageCount / 2);
  const thicknessPerSheet = paperGSM <= 80 ? 0.05 : paperGSM <= 100 ? 0.06 : 0.07;
  return Math.max(sheetsNeeded * thicknessPerSheet, 3); // Minimum 3mm spine
};

// Draw trim marks (crop marks) at corners
const drawTrimMarks = (
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number,
  bleed: number,
  markLength: number = 5
) => {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);

  const trimLeft = bleed;
  const trimRight = pageWidth - bleed;
  const trimTop = bleed;
  const trimBottom = pageHeight - bleed;

  // Top-left corner
  doc.line(trimLeft - markLength, trimTop, trimLeft - 1, trimTop);
  doc.line(trimLeft, trimTop - markLength, trimLeft, trimTop - 1);

  // Top-right corner
  doc.line(trimRight + 1, trimTop, trimRight + markLength, trimTop);
  doc.line(trimRight, trimTop - markLength, trimRight, trimTop - 1);

  // Bottom-left corner
  doc.line(trimLeft - markLength, trimBottom, trimLeft - 1, trimBottom);
  doc.line(trimLeft, trimBottom + 1, trimLeft, trimBottom + markLength);

  // Bottom-right corner
  doc.line(trimRight + 1, trimBottom, trimRight + markLength, trimBottom);
  doc.line(trimRight, trimBottom + 1, trimRight, trimBottom + markLength);
};

// Draw registration marks for color alignment
const drawRegistrationMarks = (
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number,
  bleed: number
) => {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);

  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  const markSize = 3;

  // Top center
  doc.circle(centerX, bleed / 2, 1.5, "S");
  doc.line(centerX - markSize, bleed / 2, centerX + markSize, bleed / 2);
  doc.line(centerX, bleed / 2 - markSize, centerX, bleed / 2 + markSize);

  // Bottom center
  doc.circle(centerX, pageHeight - bleed / 2, 1.5, "S");
  doc.line(centerX - markSize, pageHeight - bleed / 2, centerX + markSize, pageHeight - bleed / 2);
  doc.line(centerX, pageHeight - bleed / 2 - markSize, centerX, pageHeight - bleed / 2 + markSize);

  // Left center
  doc.circle(bleed / 2, centerY, 1.5, "S");
  doc.line(bleed / 2 - markSize, centerY, bleed / 2 + markSize, centerY);
  doc.line(bleed / 2, centerY - markSize, bleed / 2, centerY + markSize);

  // Right center
  doc.circle(pageWidth - bleed / 2, centerY, 1.5, "S");
  doc.line(pageWidth - bleed / 2 - markSize, centerY, pageWidth - bleed / 2 + markSize, centerY);
  doc.line(pageWidth - bleed / 2, centerY - markSize, pageWidth - bleed / 2, centerY + markSize);
};

// Calculate total page count for spine width
const calculatePageCount = (answers: Record<string, string>): number => {
  let pageCount = 4; // Cover, title page, dedication, TOC

  categories.forEach((category) => {
    const categoryQuestions = questions.filter((q) => q.category === category.id);
    const answeredQuestions = categoryQuestions.filter((q) => answers[q.id]?.trim());

    if (answeredQuestions.length > 0) {
      pageCount += 2; // Chapter title spread
      answeredQuestions.forEach((question) => {
        const answer = answers[question.id];
        if (answer?.trim()) {
          // Estimate pages based on word count (~250 words per page)
          const wordCount = answer.split(/\s+/).length;
          pageCount += Math.max(1, Math.ceil(wordCount / 250));
        }
      });
    }
  });

  pageCount += 1; // Final page
  return pageCount;
};

export const generatePrintReadyPDF = (
  answers: Record<string, string>,
  bookData: BookData = { title: "My Story" },
  settings: Partial<PrintSettings> = {}
) => {
  const printSettings = { ...DEFAULT_PRINT_SETTINGS, ...settings };
  const { bleedMM, trimWidth, trimHeight, paperWeightGSM } = printSettings;

  // Calculate dimensions with bleed
  const pageWidth = trimWidth + bleedMM * 2;
  const pageHeight = trimHeight + bleedMM * 2;

  // Calculate spine width
  const pageCount = calculatePageCount(answers);
  const spineWidth = calculateSpineWidth(pageCount, paperWeightGSM);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [pageWidth, pageHeight],
  });

  const margin = bleedMM + 15; // Bleed + safe margin
  const contentWidth = trimWidth - 30; // 15mm margins on each side
  let yPosition = margin + 10;

  // Helper to add new page with trim marks
  const addNewPage = () => {
    doc.addPage([pageWidth, pageHeight]);
    drawTrimMarks(doc, pageWidth, pageHeight, bleedMM);
    drawRegistrationMarks(doc, pageWidth, pageHeight, bleedMM);
    yPosition = margin + 10;
  };

  // Check if new page needed
  const checkNewPage = (requiredSpace: number = 30) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      addNewPage();
      return true;
    }
    return false;
  };

  // Add wrapped text with page break handling
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number = 6
  ): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      if (y + index * lineHeight > pageHeight - margin) {
        addNewPage();
        y = margin + 10;
      }
      doc.text(line, x, y + index * lineHeight);
    });
    return y + lines.length * lineHeight;
  };

  // ===== COVER SPREAD (Front + Spine + Back) =====
  const coverSpreadWidth = trimWidth * 2 + spineWidth + bleedMM * 2;
  doc.deletePage(1);
  doc.addPage([coverSpreadWidth, pageHeight]);

  // Background with bleed
  doc.setFillColor(bookData.coverColor || "#E86C5D");
  doc.rect(0, 0, coverSpreadWidth, pageHeight, "F");

  // Draw spine guides (dashed lines)
  doc.setDrawColor(255, 255, 255);
  doc.setLineDashPattern([2, 2], 0);
  doc.setLineWidth(0.25);
  const spineLeftEdge = bleedMM + trimWidth;
  const spineRightEdge = spineLeftEdge + spineWidth;
  doc.line(spineLeftEdge, 0, spineLeftEdge, pageHeight);
  doc.line(spineRightEdge, 0, spineRightEdge, pageHeight);
  doc.setLineDashPattern([], 0);

  // Front cover (right side)
  const frontCoverCenterX = spineRightEdge + trimWidth / 2;
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(bookData.title, trimWidth - 30);
  const titleY = pageHeight * 0.4;
  titleLines.forEach((line: string, i: number) => {
    doc.text(line, frontCoverCenterX, titleY + i * 12, { align: "center" });
  });

  if (bookData.subtitle) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(bookData.subtitle, frontCoverCenterX, titleY + titleLines.length * 12 + 15, {
      align: "center",
    });
  }

  // Spine text (rotated)
  if (spineWidth >= 5) {
    doc.setFontSize(Math.min(10, spineWidth * 0.8));
    doc.setFont("helvetica", "bold");
    const spineCenterX = spineLeftEdge + spineWidth / 2;
    const spineCenterY = pageHeight / 2;
    
    // Save state and rotate for spine text
    doc.text(bookData.title.substring(0, 40), spineCenterX, spineCenterY, {
      align: "center",
      angle: 90,
    });
  }

  // Back cover (left side)
  const backCoverCenterX = bleedMM + trimWidth / 2;
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Created with ECwriter", backCoverCenterX, pageHeight - 30, { align: "center" });

  // Draw trim marks on cover spread
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  // Outer corners
  doc.line(0, bleedMM, bleedMM - 1, bleedMM);
  doc.line(bleedMM, 0, bleedMM, bleedMM - 1);
  doc.line(coverSpreadWidth - bleedMM + 1, bleedMM, coverSpreadWidth, bleedMM);
  doc.line(coverSpreadWidth - bleedMM, 0, coverSpreadWidth - bleedMM, bleedMM - 1);
  doc.line(0, pageHeight - bleedMM, bleedMM - 1, pageHeight - bleedMM);
  doc.line(bleedMM, pageHeight, bleedMM, pageHeight - bleedMM + 1);
  doc.line(coverSpreadWidth - bleedMM + 1, pageHeight - bleedMM, coverSpreadWidth, pageHeight - bleedMM);
  doc.line(coverSpreadWidth - bleedMM, pageHeight, coverSpreadWidth - bleedMM, pageHeight - bleedMM + 1);

  // ===== INTERIOR PAGES =====
  // Title page
  addNewPage();
  doc.setFillColor(252, 250, 245);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  drawTrimMarks(doc, pageWidth, pageHeight, bleedMM);
  drawRegistrationMarks(doc, pageWidth, pageHeight, bleedMM);

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  const interiorCenterX = pageWidth / 2;
  doc.text(bookData.title, interiorCenterX, pageHeight * 0.4, { align: "center" });

  if (bookData.subtitle) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(bookData.subtitle, interiorCenterX, pageHeight * 0.4 + 15, { align: "center" });
  }

  // Dedication page
  if (bookData.dedication) {
    addNewPage();
    doc.setFillColor(252, 250, 245);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    drawTrimMarks(doc, pageWidth, pageHeight, bleedMM);
    drawRegistrationMarks(doc, pageWidth, pageHeight, bleedMM);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    const dedicationLines = doc.splitTextToSize(bookData.dedication, contentWidth * 0.7);
    const dedicationY = pageHeight * 0.4;
    dedicationLines.forEach((line: string, i: number) => {
      doc.text(line, interiorCenterX, dedicationY + i * 6, { align: "center" });
    });
  }

  // Table of Contents
  addNewPage();
  doc.setFillColor(252, 250, 245);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  drawTrimMarks(doc, pageWidth, pageHeight, bleedMM);
  drawRegistrationMarks(doc, pageWidth, pageHeight, bleedMM);

  yPosition = margin + 15;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Table of Contents", interiorCenterX, yPosition, { align: "center" });

  yPosition += 20;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  let chapterNum = 1;
  categories.forEach((category) => {
    const categoryQuestions = questions.filter((q) => q.category === category.id);
    const hasAnswers = categoryQuestions.some((q) => answers[q.id]?.trim());

    if (hasAnswers) {
      doc.setFont("helvetica", "bold");
      doc.text(`Chapter ${chapterNum}: ${category.title}`, margin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(category.subtitle, margin + 5, yPosition + 6);
      doc.setTextColor(30, 30, 30);
      yPosition += 18;
      chapterNum++;
    }
  });

  // Content chapters
  chapterNum = 1;
  categories.forEach((category) => {
    const categoryQuestions = questions.filter((q) => q.category === category.id);
    const answeredQuestions = categoryQuestions.filter((q) => answers[q.id]?.trim());

    if (answeredQuestions.length === 0) return;

    // Chapter title page
    addNewPage();
    doc.setFillColor(252, 250, 245);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    drawTrimMarks(doc, pageWidth, pageHeight, bleedMM);
    drawRegistrationMarks(doc, pageWidth, pageHeight, bleedMM);

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(60);
    doc.setFont("helvetica", "bold");
    doc.text(`${chapterNum}`, interiorCenterX, pageHeight * 0.35, { align: "center" });

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(24);
    doc.text(category.title, interiorCenterX, pageHeight * 0.5, { align: "center" });

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text(category.subtitle, interiorCenterX, pageHeight * 0.5 + 10, { align: "center" });

    // Chapter content
    addNewPage();
    doc.setFillColor(252, 250, 245);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    drawTrimMarks(doc, pageWidth, pageHeight, bleedMM);
    drawRegistrationMarks(doc, pageWidth, pageHeight, bleedMM);
    yPosition = margin + 10;

    answeredQuestions.forEach((question, qIndex) => {
      const answer = answers[question.id];
      if (!answer?.trim()) return;

      checkNewPage(40);

      // Question header
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      yPosition = addWrappedText(question.title, margin, yPosition, contentWidth, 5);
      yPosition += 3;

      // Answer text
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const paragraphs = answer.split("\n\n");
      paragraphs.forEach((paragraph) => {
        if (paragraph.trim()) {
          checkNewPage(15);
          yPosition = addWrappedText(paragraph.trim(), margin, yPosition, contentWidth, 5);
          yPosition += 4;
        }
      });

      yPosition += 8;

      // Separator
      if (qIndex < answeredQuestions.length - 1) {
        checkNewPage(12);
        doc.setDrawColor(220, 220, 220);
        doc.line(margin + 15, yPosition, pageWidth - margin - 15, yPosition);
        yPosition += 12;
      }
    });

    chapterNum++;
  });

  // Final page
  addNewPage();
  doc.setFillColor(252, 250, 245);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  drawTrimMarks(doc, pageWidth, pageHeight, bleedMM);
  drawRegistrationMarks(doc, pageWidth, pageHeight, bleedMM);

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.text("Created with ECwriter", interiorCenterX, pageHeight / 2, { align: "center" });

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(date, interiorCenterX, pageHeight / 2 + 8, { align: "center" });

  // Print specifications info
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text(
    `Print Specs: ${trimWidth}x${trimHeight}mm trim, ${bleedMM}mm bleed, ${spineWidth.toFixed(1)}mm spine, ${pageCount} pages`,
    interiorCenterX,
    pageHeight - margin,
    { align: "center" }
  );

  // Save
  const filename = `${bookData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_print_ready.pdf`;
  doc.save(filename);

  return {
    filename,
    pageCount,
    spineWidth,
    trimWidth,
    trimHeight,
    bleedMM,
  };
};

export { calculateSpineWidth, calculatePageCount };

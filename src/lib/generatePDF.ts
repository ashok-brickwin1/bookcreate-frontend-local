import jsPDF from "jspdf";
import { categories, questions } from "@/data/bookQuestions";

interface BookData {
  title: string;
  subtitle?: string;
  dedication?: string;
  coverColor?: string;
  bookType?: string;
}

export const generateBookPDF = (
  answers: Record<string, string>,
  bookData: BookData = { title: "My Story" }
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Helper to add new page if needed
  const checkNewPage = (requiredSpace: number = 30) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper to add wrapped text
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number = 7
  ): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      if (y + index * lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, x, y + index * lineHeight);
    });
    return y + lines.length * lineHeight;
  };

  // ===== COVER PAGE =====
  // Background gradient effect (simplified)
  doc.setFillColor(bookData.coverColor || "#E86C5D");
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative elements
  doc.setFillColor(255, 255, 255);
  doc.circle(pageWidth * 0.8, pageHeight * 0.2, 60, "F");
  doc.circle(pageWidth * 0.2, pageHeight * 0.8, 40, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(bookData.title, contentWidth);
  const titleY = pageHeight * 0.4;
  titleLines.forEach((line: string, i: number) => {
    doc.text(line, pageWidth / 2, titleY + i * 15, { align: "center" });
  });

  // Subtitle
  if (bookData.subtitle) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(bookData.subtitle, pageWidth / 2, titleY + titleLines.length * 15 + 15, {
      align: "center",
    });
  }

  // Book type badge
  if (bookData.bookType) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const typeLabel = bookData.bookType.replace("_", " ").toUpperCase();
    doc.text(typeLabel, pageWidth / 2, pageHeight - 40, { align: "center" });
  }

  // ===== DEDICATION PAGE =====
  if (bookData.dedication) {
    doc.addPage();
    doc.setFillColor(252, 250, 245);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    
    const dedicationY = pageHeight * 0.4;
    const dedicationLines = doc.splitTextToSize(bookData.dedication, contentWidth * 0.7);
    dedicationLines.forEach((line: string, i: number) => {
      doc.text(line, pageWidth / 2, dedicationY + i * 7, { align: "center" });
    });
  }

  // ===== TABLE OF CONTENTS =====
  doc.addPage();
  doc.setFillColor(252, 250, 245);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  yPosition = margin + 20;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Table of Contents", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 30;
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");

  let chapterNum = 1;
  categories.forEach((category) => {
    const categoryQuestions = questions.filter((q) => q.category === category.id);
    const hasAnswers = categoryQuestions.some((q) => answers[q.id]?.trim());

    if (hasAnswers) {
      doc.setFont("helvetica", "bold");
      doc.text(`Chapter ${chapterNum}: ${category.title}`, margin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(category.subtitle, margin + 5, yPosition + 7);
      doc.setTextColor(30, 30, 30);
      yPosition += 20;
      chapterNum++;
    }
  });

  // ===== CONTENT CHAPTERS =====
  chapterNum = 1;
  categories.forEach((category) => {
    const categoryQuestions = questions.filter((q) => q.category === category.id);
    const answeredQuestions = categoryQuestions.filter((q) => answers[q.id]?.trim());

    if (answeredQuestions.length === 0) return;

    // Chapter title page
    doc.addPage();
    doc.setFillColor(252, 250, 245);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Chapter number
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(72);
    doc.setFont("helvetica", "bold");
    doc.text(`${chapterNum}`, pageWidth / 2, pageHeight * 0.35, { align: "center" });

    // Chapter title
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(28);
    doc.text(category.title, pageWidth / 2, pageHeight * 0.5, { align: "center" });

    // Chapter subtitle
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.text(category.subtitle, pageWidth / 2, pageHeight * 0.5 + 12, { align: "center" });

    // Chapter content
    doc.addPage();
    doc.setFillColor(252, 250, 245);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    yPosition = margin;

    answeredQuestions.forEach((question, qIndex) => {
      const answer = answers[question.id];
      if (!answer?.trim()) return;

      checkNewPage(50);

      // Question as section header
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      yPosition = addWrappedText(question.title, margin, yPosition, contentWidth, 6);
      yPosition += 4;

      // Answer text
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      const paragraphs = answer.split("\n\n");
      paragraphs.forEach((paragraph) => {
        if (paragraph.trim()) {
          checkNewPage(20);
          yPosition = addWrappedText(paragraph.trim(), margin, yPosition, contentWidth, 6);
          yPosition += 6;
        }
      });

      yPosition += 10;

      // Separator between questions (except last)
      if (qIndex < answeredQuestions.length - 1) {
        checkNewPage(15);
        doc.setDrawColor(220, 220, 220);
        doc.line(margin + 20, yPosition, pageWidth - margin - 20, yPosition);
        yPosition += 15;
      }
    });

    chapterNum++;
  });

  // ===== FINAL PAGE =====
  doc.addPage();
  doc.setFillColor(252, 250, 245);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.text("Created with ECwriter", pageWidth / 2, pageHeight / 2, { align: "center" });

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(date, pageWidth / 2, pageHeight / 2 + 10, { align: "center" });

  // Save the PDF
  const filename = `${bookData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
  doc.save(filename);

  return filename;
};
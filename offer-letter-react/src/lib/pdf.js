import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/* PDF export — screenshots each .page element and places it on its own PDF page.
 * RENDER_SCALE 3 + JPEG 0.95 keeps the text sharp while the file stays small
 * enough for email attachments and the backend's upload limit. */
const PX_TO_MM = 25.4 / 96;
const RENDER_SCALE = 3;
const JPEG_QUALITY = 0.95;

async function renderPagesToPdf(pageEls) {
  if (!pageEls || pageEls.length === 0) {
    throw new Error('Nothing to export — generate the letter first.');
  }
  // Make sure the Carlito/Calibri font has loaded before the snapshot
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  let pdf = null;
  for (const pageEl of pageEls) {
    const canvas = await html2canvas(pageEl, {
      scale: RENDER_SCALE,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });

    const widthMm = (canvas.width / RENDER_SCALE) * PX_TO_MM;
    const heightMm = (canvas.height / RENDER_SCALE) * PX_TO_MM;
    const imgData = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

    if (!pdf) {
      pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [widthMm, heightMm] });
    } else {
      pdf.addPage([widthMm, heightMm], 'portrait');
    }
    pdf.addImage(imgData, 'JPEG', 0, 0, widthMm, heightMm);
  }
  return pdf;
}

export async function buildLetterPdfBlob(pageEls) {
  const pdf = await renderPagesToPdf(pageEls);
  return pdf.output('blob');
}

export async function downloadLetterPdf(pageEls, fileName) {
  const pdf = await renderPagesToPdf(pageEls);
  pdf.save(fileName);
}

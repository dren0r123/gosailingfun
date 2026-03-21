import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generatePdfCertificateStream(
  clientFullName: string,
  certificateIdentifier: string,
  templateDesignId: number | string,
): Promise<Buffer> {
  const assetsDirectoryPath = path.join(process.cwd(), 'src', 'assets');
  const fontsDirectoryPath = path.join(process.cwd(), 'src', 'fonts');

  const backgroundPdfPath = path.join(assetsDirectoryPath, `certificate_front_${templateDesignId}.pdf`);
  const fontFilePath = path.join(fontsDirectoryPath, 'Roboto-Regular.ttf');

  let pdfDoc: PDFDocument;

  if (fs.existsSync(backgroundPdfPath)) {
    const existingPdfBytes = await fs.promises.readFile(backgroundPdfPath);
    pdfDoc = await PDFDocument.load(existingPdfBytes);
  } else {
    // Fallback if template doesn't exist
    pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([297.64, 420.94]); // A6 size
  }

  pdfDoc.registerFontkit(fontkit);

  let customFont;
  if (fs.existsSync(fontFilePath)) {
    const fontBytes = await fs.promises.readFile(fontFilePath);
    customFont = await pdfDoc.embedFont(fontBytes);
  } else {
    customFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  }

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  // A6 scale factors based on A4 original: 595.28 width, 841.89 height
  // Since A6 is half of A4 dimensions: 297.64 x 420.94
  // So scale is approximately 0.5

  const fontSizeName = 12; // 24 / 2
  const fontSizeId = 8; // 16 / 2

  const nameWidth = customFont.widthOfTextAtSize(clientFullName, fontSizeName);
  const nameX = (width - nameWidth) / 2;
  const nameY = height - 200; // Original was 400 from top out of 842. So 400/842 = ~47.5%. In A6, height is 421. 421 - 200 = 221 from bottom.

  firstPage.drawText(clientFullName, {
    x: nameX,
    y: nameY,
    size: fontSizeName,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  const idText = `Сертификат №: ${certificateIdentifier}`;
  const idWidth = customFont.widthOfTextAtSize(idText, fontSizeId);
  const idX = (width - idWidth) / 2;
  const idY = nameY - 20; // 20 units below name

  firstPage.drawText(idText, {
    x: idX,
    y: idY,
    size: fontSizeId,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

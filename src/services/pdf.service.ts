import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import { ERROR_MESSAGES } from '../const';

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
    throw new Error(ERROR_MESSAGES.TEMPLATE_NOT_FOUND);
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

  const fontSizeName = 12;
  const fontSizeId = 8;

  const maxNameWidth = width - 40; // 20 margin on each side
  const words = clientFullName.split(' ');
  const nameLines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const lineWidth = customFont.widthOfTextAtSize(currentLine + ' ' + word, fontSizeName);
    if (lineWidth < maxNameWidth) {
      currentLine += ' ' + word;
    } else {
      nameLines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    nameLines.push(currentLine);
  }

  let currentY = height - 200;
  const lineHeightName = customFont.heightAtSize(fontSizeName) + 4;

  for (const line of nameLines) {
    const lineWidth = customFont.widthOfTextAtSize(line, fontSizeName);
    const lineX = (width - lineWidth) / 2;

    firstPage.drawText(line, {
      x: lineX,
      y: currentY,
      size: fontSizeName,
      font: customFont,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeightName;
  }

  const idText = `Сертификат №: ${certificateIdentifier}`;
  const idWidth = customFont.widthOfTextAtSize(idText, fontSizeId);
  const idX = (width - idWidth) / 2;
  const idY = currentY + lineHeightName - 20; // 20 units below the last line of the name

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

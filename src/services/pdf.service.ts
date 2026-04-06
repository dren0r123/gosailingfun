import fontkit from '@pdf-lib/fontkit';
import fileSystem from 'fs';
import path from 'path';
import { PDFDocument, PDFFont, PDFPage, rgb } from 'pdf-lib';

import { ERROR_MESSAGES } from '../const';
import { AppError } from '../errors';

export async function generatePdfCertificateStream(
  clientFullName: string,
  certificateCode: string,
  templateIdentifier: number | string,
): Promise<Buffer> {
  const assetsDirectoryPath = path.join(process.cwd(), 'src', 'assets');
  const fontsDirectoryPath = path.join(process.cwd(), 'src', 'fonts');

  const backgroundPdfFilePath = path.join(assetsDirectoryPath, `certificate_back.pdf`);
  const frontPdfFilePath = path.join(assetsDirectoryPath, `certificate_front_${templateIdentifier}.pdf`);
  const customFontFilePath = path.join(fontsDirectoryPath, 'Lobster-Regular.ttf');

  if (!fileSystem.existsSync(backgroundPdfFilePath) || !fileSystem.existsSync(frontPdfFilePath)) {
    throw new AppError(400, ERROR_MESSAGES.TEMPLATE_NOT_FOUND);
  }
  const existingPdfFileBytes = await fileSystem.promises.readFile(backgroundPdfFilePath);
  const pdfDocumentInstance = await PDFDocument.load(existingPdfFileBytes);

  pdfDocumentInstance.registerFontkit(fontkit);

  if (!fileSystem.existsSync(customFontFilePath)) {
    throw new AppError(500, ERROR_MESSAGES.FONT_NOT_FOUND);
  }
  const fontFileBytes = await fileSystem.promises.readFile(customFontFilePath);
  const embeddedCustomFont = await pdfDocumentInstance.embedFont(fontFileBytes, { subset: true });

  const documentPagesList = pdfDocumentInstance.getPages();
  const targetPdfPage = documentPagesList[0];
  const { width: pageWidth, height: pageHeight } = targetPdfPage.getSize();

  const clientNameFontSize = 13;
  const certificateIdentifierFontSize = 10;

  // Отрисовка номера сертификата справа вверху
  const certText = `Сертификат №: ${certificateCode}`;
  const certTextWidth = embeddedCustomFont.widthOfTextAtSize(certText, certificateIdentifierFontSize);
  targetPdfPage.drawText(certText, {
    x: pageWidth - certTextWidth - 30,
    y: pageHeight - 30,
    size: certificateIdentifierFontSize,
    font: embeddedCustomFont,
    color: rgb(0, 0, 0),
  });

  // Установка стартовой позиции Y ближе к верхнему краю страницы (под приветственным текстом)
  let currentVerticalPosition = pageHeight - 104;

  const maximumNameTextWidth = pageWidth - 80;
  const formattedNameLinesArray = [
    ...splitTextIntoLines(
      `Уважаемый, ${clientFullName.trim()}`,
      embeddedCustomFont,
      clientNameFontSize,
      maximumNameTextWidth,
    ),
    `Ждем вас на морской прогулке`,
  ];

  const clientNameLineHeight = embeddedCustomFont.heightAtSize(clientNameFontSize);

  for (const singleTextLine of formattedNameLinesArray) {
    drawCenteredText(targetPdfPage, singleTextLine, embeddedCustomFont, clientNameFontSize, currentVerticalPosition);
    currentVerticalPosition -= clientNameLineHeight;
  }

  // Загружаем лицевую сторону, копируем первую страницу и вставляем ее в начало (индекс 0)
  const frontPdfBytes = await fileSystem.promises.readFile(frontPdfFilePath);
  const frontPdfDoc = await PDFDocument.load(frontPdfBytes);
  const [frontPageCopied] = await pdfDocumentInstance.copyPages(frontPdfDoc, [0]);
  pdfDocumentInstance.insertPage(0, frontPageCopied);

  const finalPdfFileBytes = await pdfDocumentInstance.save();
  return Buffer.from(finalPdfFileBytes);
}

/**
 * Разбивает строку на массив строк (перенос по словам), чтобы текст не выходил за указанную ширину
 */
function splitTextIntoLines(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  return text.split(' ').reduce((lines: string[], word: string) => {
    if (lines.length === 0) {
      return [word];
    }

    const lastIndex = lines.length - 1;
    const currentLine = lines[lastIndex];
    const testLine = `${currentLine} ${word}`;

    if (font.widthOfTextAtSize(testLine, fontSize) < maxWidth) {
      lines[lastIndex] = testLine;
    } else {
      lines.push(word);
    }

    return lines;
  }, []);
}

/**
 * Отрисовывает текст по центру страницы по горизонтали
 */
function drawCenteredText(page: PDFPage, text: string, font: PDFFont, fontSize: number, yPosition: number): void {
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const xPosition = (page.getSize().width - textWidth) / 2;

  page.drawText(text, {
    x: xPosition,
    y: yPosition,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });
}

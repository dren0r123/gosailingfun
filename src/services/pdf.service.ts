import fontkit from '@pdf-lib/fontkit';
import fileSystem from 'fs';
import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';

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
  const customFontFilePath = path.join(fontsDirectoryPath, 'Roboto-Regular.ttf');

  let pdfDocumentInstance: PDFDocument;

  if (fileSystem.existsSync(backgroundPdfFilePath)) {
    const existingPdfFileBytes = await fileSystem.promises.readFile(backgroundPdfFilePath);
    pdfDocumentInstance = await PDFDocument.load(existingPdfFileBytes);
  } else {
    throw new AppError(400, ERROR_MESSAGES.TEMPLATE_NOT_FOUND);
  }

  pdfDocumentInstance.registerFontkit(fontkit);

  let embeddedCustomFont;
  if (fileSystem.existsSync(customFontFilePath)) {
    const fontFileBytes = await fileSystem.promises.readFile(customFontFilePath);
    embeddedCustomFont = await pdfDocumentInstance.embedFont(fontFileBytes);
  } else {
    throw new AppError(500, ERROR_MESSAGES.FONT_NOT_FOUND);
  }

  const documentPagesList = pdfDocumentInstance.getPages();
  const targetPdfPage = documentPagesList[0];
  const { width: pageWidth, height: pageHeight } = targetPdfPage.getSize();

  const clientNameFontSize = 14;
  const certificateIdentifierFontSize = 10;

  // Установка стартовой позиции Y ближе к верхнему краю страницы (под приветственным текстом)
  let currentVerticalPosition = pageHeight - 102;

  // Отрисовка номера сертификата (первая пустая строка)
  const certificateIdentifierText = `Сертификат №: ${certificateCode}`;
  const certificateIdentifierWidth = embeddedCustomFont.widthOfTextAtSize(
    certificateIdentifierText,
    certificateIdentifierFontSize,
  );
  const identifierHorizontalPosition = (pageWidth - certificateIdentifierWidth) / 2;

  targetPdfPage.drawText(certificateIdentifierText, {
    x: identifierHorizontalPosition,
    y: currentVerticalPosition,
    size: certificateIdentifierFontSize,
    font: embeddedCustomFont,
    color: rgb(0, 0, 0),
  });

  // Смещение координаты Y вниз для перехода на вторую пустую строку
  currentVerticalPosition -= 19;

  // Отрисовка имени клиента с алгоритмом переноса строк
  const maximumNameTextWidth = pageWidth - 80;
  const clientNameWordsArray = clientFullName.split(' ');
  const formattedNameLinesArray: string[] = [];
  let currentTextLine = clientNameWordsArray[0] || '';

  for (let wordIndex = 1; wordIndex < clientNameWordsArray.length; wordIndex++) {
    const currentWord = clientNameWordsArray[wordIndex];
    const currentLineWidth = embeddedCustomFont.widthOfTextAtSize(
      currentTextLine + ' ' + currentWord,
      clientNameFontSize,
    );

    if (currentLineWidth < maximumNameTextWidth) {
      currentTextLine += ' ' + currentWord;
    } else {
      formattedNameLinesArray.push(currentTextLine);
      currentTextLine = currentWord;
    }
  }

  if (currentTextLine) {
    formattedNameLinesArray.push(currentTextLine);
  }

  const clientNameLineHeight = embeddedCustomFont.heightAtSize(clientNameFontSize) + 6;

  for (const singleTextLine of formattedNameLinesArray) {
    const singleLineWidth = embeddedCustomFont.widthOfTextAtSize(singleTextLine, clientNameFontSize);
    const horizontalCenterPosition = (pageWidth - singleLineWidth) / 2;

    targetPdfPage.drawText(singleTextLine, {
      x: horizontalCenterPosition,
      y: currentVerticalPosition,
      size: clientNameFontSize,
      font: embeddedCustomFont,
      color: rgb(0, 0, 0),
    });

    currentVerticalPosition -= clientNameLineHeight;
  }

  const finalPdfFileBytes = await pdfDocumentInstance.save();
  return Buffer.from(finalPdfFileBytes);
}

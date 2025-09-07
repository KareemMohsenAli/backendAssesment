declare module 'pdfkit' {
  import { Readable } from 'stream';

  interface PDFDocumentOptions {
    size?: string | [number, number];
    margins?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    info?: {
      Title?: string;
      Author?: string;
      Subject?: string;
      Keywords?: string;
      Creator?: string;
      Producer?: string;
      CreationDate?: Date;
      ModDate?: Date;
    };
  }

  class PDFDocument extends Readable {
    constructor(options?: PDFDocumentOptions);
    
    pipe(destination: NodeJS.WritableStream): this;
    fontSize(size: number): this;
    text(text: string, x?: number, y?: number, options?: any): this;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    stroke(): this;
    addPage(): this;
    end(): void;
    
    on(event: 'end', listener: () => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
  }

  export = PDFDocument;
  export default PDFDocument;
}

import * as fs from 'fs';
import * as path from 'path';
import * as csvWriter from 'csv-writer';
import PDFDocument = require('pdfkit');
import { Employee } from '../../modules/employee/models/Employee';

export interface ExportOptions {
  format: 'csv' | 'pdf';
  filename?: string;
  departmentId?: number;
}

export class ExportService {
  private static readonly EXPORT_DIR = path.join(process.cwd(), 'exports');

  public static async exportEmployees(
    employees: Employee[],
    options: ExportOptions
  ): Promise<string> {
    // Ensure exports directory exists
    if (!fs.existsSync(this.EXPORT_DIR)) {
      fs.mkdirSync(this.EXPORT_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = options.filename || `employees-export-${timestamp}`;

    switch (options.format) {
      case 'csv':
        return this.exportToCSV(employees, filename);
      case 'pdf':
        return this.exportToPDF(employees, filename);
      default:
        throw new Error('Unsupported export format');
    }
  }

  private static async exportToCSV(employees: Employee[], filename: string): Promise<string> {
    const filePath = path.join(this.EXPORT_DIR, `${filename}.csv`);

    const csvWriterInstance = csvWriter.createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'salary', title: 'Salary' },
        { id: 'departmentName', title: 'Department' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'updatedAt', title: 'Updated At' },
      ],
    });

    const csvData = employees.map(employee => ({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      salary: employee.salary,
      departmentName: employee.Department?.name || 'N/A',
      createdAt: employee.createdAt?.toISOString().split('T')[0] || 'N/A',
      updatedAt: employee.updatedAt?.toISOString().split('T')[0] || 'N/A',
    }));

    await csvWriterInstance.writeRecords(csvData);
    return filePath;
  }

  private static async exportToPDF(employees: Employee[], filename: string): Promise<string> {
    const filePath = path.join(this.EXPORT_DIR, `${filename}.pdf`);
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath));

    // Add title
    doc.fontSize(20).text('Employee Report', 50, 50);
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 80);
    doc.text(`Total Employees: ${employees.length}`, 50, 100);

    let yPosition = 130;

    // Add table headers
    doc.fontSize(10);
    doc.text('ID', 50, yPosition);
    doc.text('Name', 100, yPosition);
    doc.text('Email', 200, yPosition);
    doc.text('Salary', 300, yPosition);
    doc.text('Department', 400, yPosition);

    yPosition += 20;

    // Add separator line
    doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();

    yPosition += 10;

    // Add employee data
    employees.forEach((employee, index) => {
      if (yPosition > 750) {
        doc.addPage();
        yPosition = 50;
      }

      doc.text(employee.id.toString(), 50, yPosition);
      doc.text(employee.name, 100, yPosition);
      doc.text(employee.email, 200, yPosition);
      doc.text(employee.salary.toString(), 300, yPosition);
      doc.text(employee.Department?.name || 'N/A', 400, yPosition);

      yPosition += 15;
    });

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => resolve(filePath));
      doc.on('error', reject);
    });
  }

  public static getExportFilePath(filename: string): string {
    return path.join(this.EXPORT_DIR, filename);
  }

  public static deleteExportFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

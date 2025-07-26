'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Participant, Expense, Settlement, Currency } from '@/lib/types';
import { exportToPDF, generateMarkdownReport, ExportData } from '@/lib/pdf-export';
import { toast } from 'sonner';

interface ExportButtonProps {
  participants: Participant[];
  expenses: Expense[];
  settlements: Settlement[];
  currency: Currency;
}

export function ExportButton({ participants, expenses, settlements, currency }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportData: ExportData = {
    participants,
    expenses,
    settlements,
    currency,
    exportDate: new Date()
  };

  const handleExportPDF = async () => {
    if (participants.length === 0) {
      toast.error('No data to export', {
        description: 'Add participants and expenses first'
      });
      return;
    }

    setIsExporting(true);
    try {
      await exportToPDF(exportData);
      toast.success('PDF exported successfully!', {
        description: 'Your expense report has been downloaded'
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', {
        description: 'There was an error generating the PDF'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMarkdown = () => {
    if (participants.length === 0) {
      toast.error('No data to export', {
        description: 'Add participants and expenses first'
      });
      return;
    }

    try {
      const markdown = generateMarkdownReport(exportData);
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `splitwise-report-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Markdown exported successfully!', {
        description: 'Your expense report has been downloaded'
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', {
        description: 'There was an error generating the markdown file'
      });
    }
  };

  const hasData = participants.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasData || isExporting}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleExportPDF}
          disabled={!hasData || isExporting}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportMarkdown}
          disabled={!hasData || isExporting}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Export as Markdown
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
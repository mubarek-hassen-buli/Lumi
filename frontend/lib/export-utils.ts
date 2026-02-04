import { saveAs } from 'file-saver';

/**
 * Exports an HTML string to a PDF file using jsPDF and html2canvas.
 * This captures the visual styling of the document.
 * We use dynamic imports to ensure these aren't evaluated during SSR.
 */
export const exportToPdf = async (elementId: string, fileName: string) => {
    if (typeof window === 'undefined') return;

    try {
        const [jsPDF, html2canvas] = await Promise.all([
            import('jspdf').then(m => m.jsPDF),
            import('html2canvas').then(m => m.default)
        ]);

        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found for PDF export');
            return;
        }

        const canvas = await html2canvas(element, {
            scale: 2, // Higher resolution
            useCORS: true,
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4'
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};

/**
 * Exports an HTML string to a DOCX file by calling our Server Route Handler.
 * This is the optimal way for Next.js to handle Node-specific conversion libraries.
 */
export const exportToDocx = async (htmlContent: string, fileName: string) => {
    try {
        const response = await fetch('/api/export/docx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                html: htmlContent,
                title: fileName,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || 'Failed to generate document');
        }

        const blob = await response.blob();
        saveAs(blob, `${fileName}.docx`);
    } catch (error) {
        console.error('Error exporting DOCX:', error);
        throw error;
    }
};

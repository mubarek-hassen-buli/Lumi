import { NextRequest, NextResponse } from 'next/server';
import htmlToDocx from 'html-to-docx';

export async function POST(req: NextRequest) {
    try {
        const { html, title } = await req.json();

        if (!html) {
            return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
        }

        // Professional full HTML structure for the converter
        const fullHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>${title || 'Document'}</title>
                <style>
                    body { font-family: 'Times New Roman', serif; line-height: 1.5; }
                    h1 { color: #000; text-align: center; }
                    h2 { margin-top: 20pt; }
                    p { margin-bottom: 10pt; }
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        const docxBlob = await htmlToDocx(fullHtml, undefined, {
            margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
            },
            footer: true,
            pageNumber: true,
        });

        // Return the binary data as a downloadable file
        return new NextResponse(docxBlob, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${title || 'document'}.docx"`,
            },
        });
    } catch (error: any) {
        console.error('[DOCX_EXPORT_ERROR]', error);
        return NextResponse.json({ error: 'Failed to generate DOCX', details: error.message }, { status: 500 });
    }
}

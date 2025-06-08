import fs from 'fs/promises';
import puppeteer from 'puppeteer';

export default async function generatePdf(req, res) {
    const { exempleNumber } = req.query;
    //const templatePath = path.join(__dirname, '../data/', `${exempleNumber}.html`);
    const htmlContent = await fs.readFile(`./data/exemple${exempleNumber}.html`, 'utf8');

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });

    const page = await browser.newPage();

    // Configuration de la page
    /*await page.setViewport({ width: 1200, height: 800 });*/

    // Charge le contenu HTML
    await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 30000
    });

    // Attend que les styles soient appliqués
    await page.evaluate(() => {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    });

    // Options par défaut pour le PDF
    const pdfOptions = {
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            bottom: '20mm',
            left: '15mm',
            right: '15mm'
        },
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
        <div style="font-size: 10px; color: #666; text-align: center; width: 100%;">
          Page <span class="pageNumber"></span> sur <span class="totalPages"></span>
        </div>
        `
    };

    // Génère le PDF
    const pdfBuffer = await page.pdf(pdfOptions);
    await browser.close();

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
        'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);

}
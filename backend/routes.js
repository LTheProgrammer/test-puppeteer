import express from 'express';
import generatePdf from './controller.js';

const router = express.Router();

// Route pour lister les templates disponibles
router.get('/api/generatePDF', generatePdf);

export default router;
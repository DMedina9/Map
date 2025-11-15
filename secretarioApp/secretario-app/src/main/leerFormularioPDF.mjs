import * as fs from 'node:fs';
import { PDFDocument } from 'pdf-lib';

// Import required utilities
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the file path
const __dirname = dirname(__filename);

async function leerFormularioPDF(rutaArchivo) {
  // Leer el archivo PDF
  const pdfBytes = fs.readFileSync(rutaArchivo);

  // Cargar el documento PDF
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Obtener los campos del formulario
  const form = pdfDoc.getForm();
  const campos = form.getFields();
console.log(`Número de campos: ${campos.length}`);

  // Iterar sobre los campos y extraer información
  campos.forEach((campo) => {
    const nombreCampo = campo.getName();
    const valorCampo = campo.getText && campo.getText() || 'Sin valor';
    console.log(`Campo: ${nombreCampo}, Valor: ${valorCampo}`);
  });
}
leerFormularioPDF(`C:\\Users\\DanielMedina\\Desktop\\Maps\\Map\\secretarioApp\\secretario-app\\resources\\PDF\\S-88_S.pdf`)
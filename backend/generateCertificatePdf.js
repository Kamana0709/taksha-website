const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');

function escapeLatex(str) {
  if (typeof str !== 'string') return '';
  // 1. Backslash must be escaped first
  let escaped = str.replace(/\\/g, '\\textbackslash{}');

  // 2. Escape other special characters
  escaped = escaped.replace(/([&%$#_{}])/g, '\\$1');

  // 3. Escape tilde and caret
  escaped = escaped.replace(/~/g, '\\textasciitilde{}');
  escaped = escaped.replace(/\^/g, '\\textasciicircum{}');

  return escaped;
}

/**
 * Generates a certificate PDF using xelatex.
 * 
 * @param {Object} data 
 * @param {string} data.name 
 * @param {string} data.role 
 * @param {string} data.startDate 
 * @param {string} data.endDate 
 * @param {string} data.certificateId
 * @param {string} destPath - The final path to copy the generated PDF to.
 * @returns {Promise<string>} The path to the final PDF.
 */
function generateCertificatePdf(data, destPath) {
  return new Promise((resolve, reject) => {
    let tmpDir;
    try {
      const templatePath = path.join(__dirname, 'Taksha_Certificate_Simple.tex');
      const templateContent = fs.readFileSync(templatePath, 'utf8');

      // Escape inputs
      const eName = escapeLatex(data.name);
      const eRole = escapeLatex(data.role);
      const eStartDate = escapeLatex(data.startDate);
      const eEndDate = escapeLatex(data.endDate);
      const eCertId = escapeLatex(data.certificateId);

      // Targeted replace of the \newcommand lines
      let newContent = templateContent
        .replace(/\\newcommand\{\\certID\}\{.*\}/, `\\newcommand{\\certID}{${eCertId}}`)
        .replace(/\\newcommand\{\\udyamNumber\}\{.*\}/, `\\newcommand{\\udyamNumber}{UDYAM-OD-19-0177339}`)
        .replace(/\\newcommand\{\\recipientName\}\{.*\}/, `\\newcommand{\\recipientName}{${eName}}`)
        .replace(/\\newcommand\{\\roleTitle\}\{.*\}/, `\\newcommand{\\roleTitle}{${eRole}}`)
        .replace(/\\newcommand\{\\dateStart\}\{.*\}/, `\\newcommand{\\dateStart}{${eStartDate}}`)
        .replace(/\\newcommand\{\\dateEnd\}\{.*\}/, `\\newcommand{\\dateEnd}{${eEndDate}}`);

      // Create a unique temp directory
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cert-'));

      // Write the modified .tex file
      const texFile = path.join(tmpDir, 'certificate.tex');
      fs.writeFileSync(texFile, newContent, 'utf8');

      // Copy assets
      const logoSrc = path.join(__dirname, 'assets', 'certificate', 'logo.png');
      const stampSrc = path.join(__dirname, 'assets', 'certificate', 'stamp.png');
      fs.copyFileSync(logoSrc, path.join(tmpDir, 'logo.png'));
      fs.copyFileSync(stampSrc, path.join(tmpDir, 'stamp.png'));

      // Copy fonts folder too, since the .tex template loads Poppins via a
      // path relative to the xelatex working directory (this tmpDir)
      const fontsSrc = path.join(__dirname, 'assets', 'fonts', 'Poppins');
      const fontsDest = path.join(tmpDir, 'assets', 'fonts', 'Poppins');
      fs.mkdirSync(fontsDest, { recursive: true });
      fs.cpSync(fontsSrc, fontsDest, { recursive: true });

      // Spawn xelatex
      // Execute twice to ensure coordinates and references resolve properly (standard for tikz)
      const args = [
        '-interaction=nonstopmode',
        '-halt-on-error',
        `-output-directory=${tmpDir}`,
        texFile
      ];

      // We run xelatex once; if tikz remember picture requires two passes, we should run it twice.
      // The template uses remember picture, so usually two runs are needed for proper alignment.
      const runXelatex = () => {
        return new Promise((res, rej) => {
          execFile('xelatex', args, { timeout: 20000, cwd: tmpDir }, (error, stdout, stderr) => {
            if (error) {
              const logFile = path.join(tmpDir, 'certificate.log');
              let logContent = 'No log file generated.';
              if (fs.existsSync(logFile)) {
                logContent = fs.readFileSync(logFile, 'utf8');
              }
              rej(new Error(`xelatex failed: ${error.message}\n\nLaTeX Log:\n${logContent.slice(-2000)}`));
            } else {
              res();
            }
          });
        });
      };

      runXelatex()
        .then(() => runXelatex()) // Second pass for tikz coordinates
        .then(() => {
          const pdfPath = path.join(tmpDir, 'certificate.pdf');
          if (!fs.existsSync(pdfPath)) {
            throw new Error('PDF was not generated despite success exit code.');
          }

          // Ensure destination directory exists
          const destDir = path.dirname(destPath);
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }

          // Copy final PDF to the destination
          fs.copyFileSync(pdfPath, destPath);
          resolve(destPath);
        })
        .catch(reject)
        .finally(() => {
          if (tmpDir) {
            fs.rm(tmpDir, { recursive: true, force: true }, () => { });
          }
        });

    } catch (err) {
      if (tmpDir) {
        fs.rm(tmpDir, { recursive: true, force: true }, () => { });
      }
      reject(err);
    }
  });
}

module.exports = { generateCertificatePdf, escapeLatex };
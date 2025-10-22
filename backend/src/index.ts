import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { spawn } from 'child_process';
import PDFDocument from 'pdfkit';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Store latest results
let latestResults: any = null;

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  console.log(`File uploaded: ${req.file.originalname}`);
  res.json({ 
    filePath: req.file.path,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

app.post('/form-teams', async (req, res) => {
  const { filePath, teamSize } = req.body;
  
  if (!filePath || !teamSize) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Uploaded file not found' });
  }

  console.log(`Processing teams with size: ${teamSize}`);

  // Try different Python commands (Windows and Unix friendly)
  const pythonCommands: { cmd: string; args: string[] }[] = [
    { cmd: 'py', args: ['-3'] }, // Windows launcher for Python 3
    { cmd: 'python3', args: [] },
    { cmd: 'python', args: [] },
    { cmd: 'py', args: [] }
  ];
  let pythonScript = path.join(__dirname, '../../model/predict_teams.py');
  
  // Check if the Python script exists
  if (!fs.existsSync(pythonScript)) {
    return res.status(500).json({ error: 'Python model script not found' });
  }

  const runPythonScript = (pythonCmd: { cmd: string; args: string[] }) => {
    return new Promise((resolve, reject) => {
      const spawnArgs = [...pythonCmd.args, pythonScript, filePath, teamSize.toString()];
      const python = spawn(pythonCmd.cmd, spawnArgs, {
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
      });
      let dataString = '';
      let errorString = '';

      python.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      python.stderr.on('data', (data) => {
        errorString += data.toString();
        console.error(`Python Error: ${data}`);
      });

      python.on('close', (code) => {
        if (code === 0) {
          try {
            let jsonText = '';
            const trimmed = (dataString || '').toString().trim();

            // Fast path: whole stdout is JSON
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
              jsonText = trimmed;
            } else {
              // Try to find a JSON-looking line
              const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
              const jsonLikeLine = [...lines].reverse().find(l => l.startsWith('{') && l.endsWith('}'));
              if (jsonLikeLine) {
                jsonText = jsonLikeLine;
              } else {
                // Fallback: slice from first { to last }
                const firstIdx = trimmed.indexOf('{');
                const lastIdx = trimmed.lastIndexOf('}');
                if (firstIdx !== -1 && lastIdx !== -1 && lastIdx > firstIdx) {
                  jsonText = trimmed.slice(firstIdx, lastIdx + 1);
                }
              }
            }

            if (!jsonText) {
              throw new Error('No JSON found in Python output');
            }

            const results = JSON.parse(jsonText);
            resolve(results);
          } catch (error) {
            reject(new Error(`Failed to parse Python output: ${String(error)}\nSTDOUT: ${dataString}\nSTDERR: ${errorString}`));
          }
        } else {
          reject(new Error(`Python script failed with code ${code}: ${errorString}`));
        }
      });

      python.on('error', (error) => {
        reject(new Error(`Failed to start Python: ${error.message}`));
      });
    });
  };

  // Try each Python command
  for (const pythonCmd of pythonCommands) {
    try {
      const results = await runPythonScript(pythonCmd);
      latestResults = results;
      console.log('Team formation successful');
      return res.json(results);
    } catch (error) {
      console.log(`Failed with ${pythonCmd.cmd} ${pythonCmd.args.join(' ')}:`, error);
      continue;
    }
  }

  res.status(500).json({ 
    error: 'Failed to run Python script. Ensure Python 3 is installed and accessible (try running: "py -3 --version" on Windows or "python3 --version").'
  });
});

app.get('/results', (req, res) => {
  if (!latestResults) {
    return res.status(404).json({ error: 'No results available' });
  }
  res.json(latestResults);
});

app.post('/download', (req, res) => {
  if (!latestResults || !latestResults.teams) {
    return res.status(404).json({ error: 'No results available to download' });
  }

  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=team_assignments.pdf');
  
  doc.pipe(res);
  
  // Add title and header
  doc.fontSize(24).text('Smart Team Formation Results', { align: 'center' });
  doc.moveDown();
  
  // Add summary
  doc.fontSize(14).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
  doc.text(`Total Teams: ${latestResults.teams?.length || 0}`, { align: 'center' });
  doc.text(`Total Students: ${latestResults.total_students || 0}`, { align: 'center' });
  doc.moveDown(2);

  // Add teams
  latestResults.teams.forEach((team: any, index: number) => {
    doc.fontSize(18).text(`Team ${team.team_number}`, { 
      underline: true
    });
    doc.moveDown(0.5);
    
    team.members.forEach((member: any, memberIndex: number) => {
      const memberName = member.name || `Student ${member.id || memberIndex + 1}`;
      const memberEmail = member.email_id ? ` (${member.email_id})` : '';
      
      doc.fontSize(12).text(`• ${memberName}${memberEmail}`, {
        indent: 20
      });
    });
    
    doc.moveDown(1.5);
  });

  // Add footer
  doc.fontSize(10).text('Generated by Smart Team Formation System', { 
    align: 'center'
  });

  doc.end();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

app.listen(port, () => {
  console.log(`🚀 Smart Team Formation Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
});
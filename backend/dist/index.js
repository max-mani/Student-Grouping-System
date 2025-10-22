"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Configure multer for file upload
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../uploads');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only CSV files are allowed'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});
// Store latest results
let latestResults = null;
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
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(404).json({ error: 'Uploaded file not found' });
    }
    console.log(`Processing teams with size: ${teamSize}`);
    // Try different Python commands
    const pythonCommands = ['python3', 'python', 'py'];
    let pythonScript = path_1.default.join(__dirname, '../../model/predict_teams.py');
    // Check if the Python script exists
    if (!fs_1.default.existsSync(pythonScript)) {
        return res.status(500).json({ error: 'Python model script not found' });
    }
    const runPythonScript = (pythonCmd) => {
        return new Promise((resolve, reject) => {
            const python = (0, child_process_1.spawn)(pythonCmd, [pythonScript, filePath, teamSize.toString()]);
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
                        const results = JSON.parse(dataString);
                        resolve(results);
                    }
                    catch (error) {
                        reject(new Error(`Failed to parse Python output: ${error}`));
                    }
                }
                else {
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
        }
        catch (error) {
            console.log(`Failed with ${pythonCmd}:`, error);
            continue;
        }
    }
    res.status(500).json({
        error: 'Failed to run Python script. Please ensure Python is installed and accessible.'
    });
});
app.get('/results', (req, res) => {
    if (!latestResults) {
        return res.status(404).json({ error: 'No results available' });
    }
    res.json(latestResults);
});
app.post('/download', (req, res) => {
    var _a;
    if (!latestResults || !latestResults.teams) {
        return res.status(404).json({ error: 'No results available to download' });
    }
    const doc = new pdfkit_1.default({
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
    doc.text(`Total Teams: ${((_a = latestResults.teams) === null || _a === void 0 ? void 0 : _a.length) || 0}`, { align: 'center' });
    doc.text(`Total Students: ${latestResults.total_students || 0}`, { align: 'center' });
    doc.moveDown(2);
    // Add teams
    latestResults.teams.forEach((team, index) => {
        doc.fontSize(18).text(`Team ${team.team_number}`, {
            underline: true
        });
        doc.moveDown(0.5);
        team.members.forEach((member, memberIndex) => {
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
app.use((error, req, res, next) => {
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

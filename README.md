<<<<<<< HEAD
# Smart Team Formation System

An AI-powered student grouping system that creates optimal teams based on skills, performance, and compatibility using machine learning clustering algorithms.

## ✅ Current Status

- **Data Processing**: Fixed missing values in processed_students.csv (180 missing values resolved)
- **Model Training**: Successfully recreated clustering model with corrected data
- **Web Interface**: Backend and frontend running without errors
- **Team Formation**: Successfully generates 169 teams from 500 students
- **File Management**: Cleaned up old files and maintained new model files

## 🚀 Features

- **AI-Powered Team Formation**: Uses K-means clustering to create balanced teams
- **Modern Web Interface**: Beautiful, responsive UI with drag-and-drop file upload
- **Data Visualization**: Generates elbow plots, PCA scatter plots, and team skill bar charts
- **PDF Export**: Download team assignments as professional PDF reports
- **Real-time Processing**: Fast team formation with progress indicators
- **Skill Analysis**: Analyzes student skills and performance metrics

## 🏗️ Architecture

```
student_grouping_system/
├── frontend/          # React + TypeScript frontend
├── backend/           # Node.js + Express backend
├── model/             # Python ML models and scripts
├── student_team_clustering/  # Clustering analysis and visualizations
└── data/              # Sample datasets
```

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- TailwindCSS for styling
- Axios for API calls
- Vite for build tooling

### Backend
- Node.js with Express
- TypeScript
- Multer for file uploads
- PDFKit for PDF generation
- Child process for Python integration

### Machine Learning
- Python 3.8+
- scikit-learn for clustering
- pandas for data processing
- matplotlib/seaborn for visualizations
- joblib for model persistence

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- Python 3.8+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student_grouping_system
   ```

2. **Install Python dependencies**
   ```bash
   pip install pandas scikit-learn matplotlib seaborn joblib numpy
   ```

3. **Install Node.js dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   ```

4. **Prepare the dataset**
   ```bash
   # Convert the dataset to proper format (handles missing values)
   python convert_levels.py
   
   # Generate clustering model and visualizations
   cd student_team_clustering
   python cluster_students.py
   
   # Copy model files to main model directory
   cd ..
   copy student_team_clustering\team_model.pkl model\team_model.pkl
   copy student_team_clustering\scaler.pkl model\scaler.pkl
   ```

## 🚀 Running the Application

### Development Mode
```bash
# Start both frontend and backend
npm run dev
```

### Individual Services
```bash
# Backend only (port 5000)
cd backend && npm run dev

# Frontend only (port 5173)
cd frontend && npm run dev
```

## 📊 Data Processing Pipeline

1. **Data Conversion**: `convert_levels.py` converts binary values to High/Medium/Low levels and handles missing values
   - Fills missing Student Id values with sequential numbers
   - Fills missing Quiz values with median
   - Handles all other missing values appropriately
2. **Clustering Analysis**: `cluster_students.py` performs K-means clustering and generates visualizations
3. **Model Training**: Creates `team_model.pkl` and `scaler.pkl` for team formation
4. **Web Interface**: Upload CSV files and generate teams through the web interface

## 🎯 Usage

1. **Upload Data**: Upload a CSV file with student information
2. **Configure Teams**: Set the desired team size (2-8 members)
3. **Generate Teams**: Click "Generate Optimal Teams" to run the ML algorithm
4. **View Results**: See the formed teams with member details
5. **Download PDF**: Export team assignments as a PDF report

## 📈 Visualizations Generated

- **Elbow Plot**: Determines optimal number of clusters
- **PCA Scatter Plot**: 2D visualization of student clusters
- **Team Skill Bar Charts**: Shows skill distribution across teams

## 🔧 API Endpoints

- `POST /upload` - Upload CSV file
- `POST /form-teams` - Generate team assignments
- `GET /results` - Get latest team results
- `POST /download` - Download PDF report
- `GET /health` - Health check

## 📁 File Structure

```
├── convert_levels.py              # Data preprocessing script
├── cleanup_old_files.py          # Cleanup utility
├── processed_students.csv         # Original dataset
├── processed_students_levels.csv # Processed dataset
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadSection.tsx
│   │   │   └── ResultsSection.tsx
│   │   └── App.tsx
│   └── public/favicon.svg
├── backend/                      # Node.js backend
│   ├── src/index.ts
│   └── uploads/                   # File upload directory
├── model/                        # ML models
│   ├── predict_teams.py
│   ├── team_model.pkl
│   └── scaler.pkl
└── student_team_clustering/      # Analysis scripts
    ├── cluster_students.py
    ├── clustered_teams.csv
    ├── elbow_plot.png
    ├── pca_scatter_plot.png
    └── team_skill_bar_charts.png
```

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds and glass-morphism effects
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Drag & Drop**: Easy file upload with visual feedback
- **Loading States**: Progress indicators and animations
- **Error Handling**: User-friendly error messages
- **Accessibility**: Keyboard navigation and screen reader support

## 🔍 Machine Learning Details

### Clustering Algorithm
- **Algorithm**: K-means clustering
- **Features**: Student skills and performance metrics
- **Preprocessing**: Label encoding and standardization
- **Optimization**: Elbow method for optimal cluster count

### Feature Engineering
- **Skills**: Adaptability, Communication, Leadership, etc.
- **Performance**: Quiz scores, assignments, projects
- **Encoding**: High/Medium/Low levels for categorical features

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Start production server
cd backend && npm start
```

### Docker (Optional)
```dockerfile
# Add Dockerfile for containerized deployment
FROM node:18-alpine
# ... Docker configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔧 Recent Fixes

- **Fixed Missing Values**: Resolved 180 missing values in processed_students.csv
- **Updated convert_levels.py**: Now properly handles missing Student Id and Quiz values
- **Recreated Models**: Generated new clustering model with corrected data
- **Fixed Unicode Issues**: Removed emoji characters from Python scripts for Windows compatibility
- **File Cleanup**: Removed old model files and maintained current versions
- **Fixed PostCSS Configuration**: Updated TailwindCSS v4 PostCSS integration
- **Fixed ES Module Issues**: Converted configuration files to proper ES module syntax

## 🔮 Future Enhancements

- [ ] Advanced clustering algorithms (DBSCAN, Hierarchical)
- [ ] Team diversity metrics
- [ ] Conflict resolution for team preferences
- [ ] Integration with LMS systems
- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for better education through technology**
#   S t u d e n t - G r o u p i n g - S y s t e m 
 
 
=======
# 🎓 Smart Team Formation System

An **AI-powered student grouping system** that creates optimal teams based on skills, performance, and compatibility using **machine learning clustering algorithms**.

---

## ✅ Current Status

- **Data Processing**: Fixed missing values in `processed_students.csv` (180 missing values resolved)  
- **Model Training**: Successfully recreated clustering model with corrected data  
- **Web Interface**: Backend and frontend running without errors  
- **Team Formation**: Successfully generates 169 teams from 500 students  
- **File Management**: Cleaned up old files and maintained new model files  

---

## 🚀 Features

- 🤖 **AI-Powered Team Formation** – Uses K-means clustering to create balanced teams  
- 💻 **Modern Web Interface** – Responsive UI with drag-and-drop upload  
- 📊 **Data Visualization** – Generates elbow plots, PCA scatter plots, and team skill charts  
- 📄 **PDF Export** – Download professional PDF reports of team assignments  
- ⚡ **Real-time Processing** – Fast clustering with progress indicators  
- 🧠 **Skill Analysis** – Analyzes and compares skill distributions  

---

## 🏗️ Architecture

```
student_grouping_system/
├── frontend/                # React + TypeScript frontend
├── backend/                 # Node.js + Express backend
├── model/                   # Python ML models and scripts
├── student_team_clustering/ # Clustering analysis and visualizations
└── data/                    # Sample datasets
```

---

## 🛠️ Technology Stack

### Frontend
- React 18 + TypeScript  
- TailwindCSS for styling  
- Axios for API requests  
- Vite for build tooling  

### Backend
- Node.js + Express  
- TypeScript  
- Multer for file uploads  
- PDFKit for PDF generation  
- Child process for Python integration  

### Machine Learning
- Python 3.8+  
- scikit-learn for clustering  
- pandas for data preprocessing  
- matplotlib / seaborn for visualization  
- joblib for model persistence  

---

## 📦 Installation

### Prerequisites
- Node.js 16+  
- Python 3.8+  
- npm or yarn  

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/max-mani/Student-Grouping-System.git
   cd student_grouping_system
   ```

2. **Install Python dependencies**
   ```bash
   pip install pandas scikit-learn matplotlib seaborn joblib numpy
   ```

3. **Install Node.js dependencies**
   ```bash
   # Root dependencies
   npm install

   # Backend dependencies
   cd backend && npm install

   # Frontend dependencies
   cd ../frontend && npm install
   ```

4. **Prepare the dataset**
   ```bash
   # Convert dataset and handle missing values
   python convert_levels.py

   # Train clustering model and generate visualizations
   cd student_team_clustering
   python cluster_students.py

   # Copy generated models
   cd ..
   copy student_team_clustering\team_model.pkl model\team_model.pkl
   copy student_team_clustering\scaler.pkl model\scaler.pkl
   ```

---

## 🚀 Running the Application

### Development Mode
```bash
# Start both frontend and backend
npm run dev
```

### Run Individually
```bash
# Backend only (port 5000)
cd backend && npm run dev

# Frontend only (port 5173)
cd frontend && npm run dev
```

---

## 📊 Data Processing Pipeline

### Data Conversion – `convert_levels.py`
- Converts binary data to High/Medium/Low and fills missing values  
- Auto-fills missing Student IDs  
- Fills missing Quiz values with median  
- Handles categorical and numerical missing values  

### Clustering Analysis – `cluster_students.py`
- Performs K-means clustering and generates visualizations  
- Creates `team_model.pkl` and `scaler.pkl`  

### Web Interface
- Upload CSV, generate teams, and view/download results  

---

## 🎯 Usage

1. Upload a CSV file with student data  
2. Set desired team size (2–8 members)  
3. Click **Generate Optimal Teams**  
4. View generated teams with details  
5. Download team assignments as PDF  

---

## 📈 Visualizations Generated

- **Elbow Plot** – Finds optimal cluster count  
- **PCA Scatter Plot** – Visual 2D clustering  
- **Team Skill Bar Charts** – Displays skill balance  

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|--------------|
| POST | `/upload` | Upload CSV file |
| POST | `/form-teams` | Generate team assignments |
| GET | `/results` | Retrieve latest team results |
| POST | `/download` | Download PDF report |
| GET | `/health` | Check server status |

---

## 📁 File Structure

```
├── convert_levels.py
├── cleanup_old_files.py
├── processed_students.csv
├── processed_students_levels.csv
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadSection.tsx
│   │   │   └── ResultsSection.tsx
│   │   └── App.tsx
│   └── public/favicon.svg
├── backend/
│   ├── src/index.ts
│   └── uploads/
├── model/
│   ├── predict_teams.py
│   ├── team_model.pkl
│   └── scaler.pkl
└── student_team_clustering/
    ├── cluster_students.py
    ├── clustered_teams.csv
    ├── elbow_plot.png
    ├── pca_scatter_plot.png
    └── team_skill_bar_charts.png
```

---

## 🎨 UI/UX Features

- Gradient backgrounds with glassmorphism  
- Responsive across all devices  
- Drag-and-drop file upload with animations  
- Real-time progress indicators  
- Friendly error messages  
- Accessible for all users  

---

## 🔍 Machine Learning Details

### Algorithm
K-means clustering

### Features
- Skills + Performance metrics  
- Preprocessing: Label encoding, standardization  
- Optimization: Elbow method  

### Feature Engineering
- Skills: Adaptability, Communication, Leadership, etc.  
- Performance: Quiz, Assignments, Projects  
- Categorical encoding: High/Medium/Low  

---

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Start production server
cd backend && npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
# ... Docker configuration here
```

---

## 🤝 Contributing

1. Fork the repository  
2. Create a new feature branch  
3. Make your changes  
4. Add tests (if applicable)  
5. Submit a pull request  

---

## 📄 License

This project is licensed under the **MIT License**.  
See the LICENSE file for details.

---

## 🆘 Support

For support or questions:
- Open an issue in the repository  
- Check the documentation  
- Review API endpoints  

---

## 🔧 Recent Fixes

- Fixed 180 missing values in dataset  
- Updated `convert_levels.py` for better preprocessing  
- Recreated clustering model with clean data  
- Removed emoji characters for Windows compatibility  
- Cleaned old model files  
- Fixed PostCSS config for Tailwind v4  
- Fixed ES module compatibility issues  

---

## 🔮 Future Enhancements

- Add advanced clustering (DBSCAN, Hierarchical)  
- Team diversity metrics  
- Conflict resolution system  
- LMS integration  
- Real-time collaboration features  
- Analytics dashboard  

---

**Built with ❤️ for better education through technology**
>>>>>>> 9a4e9ee0fde9e1ab5e35d8edf5b8bac7690fb7ee

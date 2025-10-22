import { useState } from 'react';
import axios from 'axios';

interface Team {
  team_number: number;
  members: any[];
}

interface UploadSectionProps {
  onTeamsGenerated: (teams: Team[]) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onTeamsGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [teamSize, setTeamSize] = useState<number>(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Generate teams
      const teamsResponse = await axios.post('http://localhost:5000/form-teams', {
        filePath: uploadResponse.data.filePath,
        teamSize,
      });

      if (teamsResponse.data.success) {
        onTeamsGenerated(teamsResponse.data.teams);
      } else {
        setError(teamsResponse.data.error || 'Failed to generate teams');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">Upload Student Data</h2>
          <p className="text-gray-600">Upload your CSV file and configure team settings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Student Data File
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 scale-105'
                  : file
                  ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:scale-102'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {file ? (
                <div className="space-y-2">
                  <svg className="w-8 h-8 text-emerald-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-emerald-600 font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">Click to change file</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div>
                    <p className="text-lg font-medium text-gray-700">Drop your CSV file here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                  </div>
                  <p className="text-xs text-gray-400">Supports CSV files with student data</p>
                </div>
              )}
            </div>
          </div>

          {/* Team Size Configuration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Team Configuration
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Team Size</label>
                <div className="relative">
                  <input
                    type="number"
                    min="2"
                    max="8"
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 rounded-lg border border-purple-200">
                <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Recommended: 3-5 members per team</span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <svg className="w-4 h-4 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full flex items-center justify-center px-6 py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              loading || !file
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Data & Forming Teams...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Optimal Teams
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadSection;
import { useState } from 'react';
import axios from 'axios';

interface Team {
  team_number: number;
  members: any[];
  justification?: string;
}

interface ResultsSectionProps {
  teams: Team[];
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ teams }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await axios.post('http://localhost:5000/download', {}, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'team_assignments.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (!teams.length) {
    return null;
  }

  const totalStudents = teams.reduce((acc, team) => acc + team.members.length, 0);

  return (
    <div className="max-w-7xl mx-auto mt-20">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 rounded-full mb-6 shadow-xl">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
          Team Formation Complete!
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Successfully created {teams.length} teams with {totalStudents} students
        </p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg mb-4 mx-auto">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{teams.length}</h3>
            <p className="text-gray-600">Teams Created</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg mb-4 mx-auto">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalStudents}</h3>
            <p className="text-gray-600">Students Assigned</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mb-4 mx-auto">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{Math.round(totalStudents / teams.length)}</h3>
            <p className="text-gray-600">Avg Team Size</p>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className={`inline-flex items-center px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
            downloading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {downloading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating PDF...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Team Assignments
            </>
          )}
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {teams.map((team, index) => (
          <div
            key={team.team_number}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                  index % 4 === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                  index % 4 === 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                  index % 4 === 2 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                  'bg-gradient-to-r from-orange-500 to-red-500'
                }`}>
                  {team.team_number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Team {team.team_number}</h3>
                  <p className="text-sm text-gray-500">{team.members.length} members</p>
                </div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-3">
              {team.members.map((member, memberIndex) => (
                <div
                  key={memberIndex}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                    memberIndex % 4 === 0 ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                    memberIndex % 4 === 1 ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                    memberIndex % 4 === 2 ? 'bg-gradient-to-r from-emerald-400 to-green-400' :
                    'bg-gradient-to-r from-orange-400 to-red-400'
                  }`}>
                    {member.name ? member.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {member.name || `Student ${member.id || memberIndex + 1}`}
                    </p>
                    {member.email_id && (
                      <p className="text-xs text-gray-500 truncate">{member.email_id}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Team Skills Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Team Diversity</span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < 4 ? 'bg-green-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Team Justification */}
            {team.justification && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold text-blue-800 mb-1">Team Formation Rationale</h4>
                      <p className="text-xs text-blue-700 leading-relaxed">{team.justification}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsSection;
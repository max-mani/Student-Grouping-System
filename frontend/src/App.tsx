import { useState } from 'react'
import UploadSection from './components/UploadSection'
import ResultsSection from './components/ResultsSection'

interface Team {
  team_number: number;
  members: any[];
}

function App() {
  const [teams, setTeams] = useState<Team[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23A855F7%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
      
      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 rounded-full mb-6 shadow-xl animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Smart Team Formation
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              AI-powered student grouping system that creates optimal teams based on skills, performance, and compatibility
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <div className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-emerald-50 to-green-50 px-5 py-3 rounded-full border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                <svg className="w-3 h-3 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Machine Learning</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-3 rounded-full border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <svg className="w-3 h-3 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Skill Analysis</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-purple-50 to-pink-50 px-5 py-3 rounded-full border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <svg className="w-3 h-3 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Balanced Teams</span>
              </div>
            </div>
          </header>

          <UploadSection onTeamsGenerated={setTeams} />
          <ResultsSection teams={teams} />
        </div>
      </div>
    </div>
  )
}

export default App

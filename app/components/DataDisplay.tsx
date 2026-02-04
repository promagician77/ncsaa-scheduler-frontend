'use client';

import { useState, useEffect, useRef } from 'react';

interface SchedulingData {
  success: boolean;
  rules: any;
  teams: any[];
  facilities: any[];
  schools: any[];
  divisions: any[];
  clusters: any[];
  tiers: any[];
  summary: any;
}

// Cache data outside component to persist across re-renders
let cachedData: SchedulingData | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function DataDisplay() {
  const [data, setData] = useState<SchedulingData | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch if we don't have cached data or cache is expired
    const now = Date.now();
    const isCacheValid = cachedData && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION;
    
    if (!isCacheValid && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchData();
    } else if (isCacheValid) {
      // Use cached data immediately
      setData(cachedData);
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8001/api/data');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Store in cache
      cachedData = result;
      cacheTimestamp = Date.now();
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh data (optional - can be used for refresh button)
  const refreshData = async () => {
    // Clear cache
    cachedData = null;
    cacheTimestamp = null;
    hasFetchedRef.current = false;
    await fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading scheduling data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Data</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const tabs = [
    { id: 'summary', label: 'Summary', icon: '📊' },
    { id: 'rules', label: 'Scheduling Rules', icon: '📋' },
    { id: 'divisions', label: 'Divisions', icon: '🏀' },
    { id: 'teams', label: 'Teams', icon: '👥' },
    { id: 'schools', label: 'Schools', icon: '🏫' },
    { id: 'facilities', label: 'Facilities', icon: '🏟️' },
    { id: 'clusters', label: 'Geographic Clusters', icon: '📍' },
    { id: 'tiers', label: 'Competitive Tiers', icon: '🏆' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Scheduling Information
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View all data used for schedule generation
              {cachedData && cacheTimestamp && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-500">
                  (Cached - Last updated: {new Date(cacheTimestamp).toLocaleTimeString()})
                </span>
              )}
            </p>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            title="Refresh data from Google Sheets"
          >
            <span>🔄</span>
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'summary' && <SummaryTab data={data} />}
            {activeTab === 'rules' && <RulesTab rules={data.rules} />}
            {activeTab === 'divisions' && <DivisionsTab divisions={data.divisions} />}
            {activeTab === 'teams' && <TeamsTab teams={data.teams} />}
            {activeTab === 'schools' && <SchoolsTab schools={data.schools} />}
            {activeTab === 'facilities' && <FacilitiesTab facilities={data.facilities} />}
            {activeTab === 'clusters' && <ClustersTab clusters={data.clusters} />}
            {activeTab === 'tiers' && <TiersTab tiers={data.tiers} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Summary Tab Component
function SummaryTab({ data }: { data: SchedulingData }) {
  const stats = [
    { label: 'Total Teams', value: data.summary.total_teams, icon: '👥', color: 'blue' },
    { label: 'Total Schools', value: data.summary.total_schools, icon: '🏫', color: 'green' },
    { label: 'Total Facilities', value: data.summary.total_facilities, icon: '🏟️', color: 'purple' },
    { label: 'Divisions', value: data.summary.total_divisions, icon: '🏀', color: 'orange' },
    { label: 'Estimated Games', value: data.summary.total_estimated_games, icon: '🎯', color: 'red' }
  ];

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 shadow-sm"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${getColorClasses(stat.color)}`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
          📅 Season Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Season Start:</span>
            <span className="ml-2 text-blue-900 dark:text-blue-100">{data.rules.season_start}</span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Season End:</span>
            <span className="ml-2 text-blue-900 dark:text-blue-100">{data.rules.season_end}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Rules Tab Component
function RulesTab({ rules }: { rules: any }) {
  const ruleGroups = [
    {
      title: 'Season Period',
      icon: '📅',
      rules: [
        { label: 'Start Date', value: rules.season_start },
        { label: 'End Date', value: rules.season_end },
        { label: 'No Games on Sunday', value: rules.no_games_on_sunday ? 'Yes' : 'No' }
      ]
    },
    {
      title: 'Game Timing',
      icon: '⏰',
      rules: [
        { label: 'Game Duration', value: `${rules.game_duration_minutes} minutes` },
        { label: 'Weeknight Games', value: rules.weeknight_time },
        { label: 'Saturday Games', value: rules.saturday_time },
        { label: 'Weeknight Slots Required', value: rules.weeknight_slots_required }
      ]
    },
    {
      title: 'Game Frequency',
      icon: '🎯',
      rules: [
        { label: 'Games Per Team', value: rules.games_per_team },
        { label: 'Max Games in 7 Days', value: rules.max_games_per_7_days },
        { label: 'Max Games in 14 Days', value: rules.max_games_per_14_days },
        { label: 'Max Doubleheaders Per Season', value: rules.max_doubleheaders_per_season }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {ruleGroups.map((group, index) => (
        <div key={index} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2 text-2xl">{group.icon}</span>
            {group.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.rules.map((rule, ruleIndex) => (
              <div key={ruleIndex} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rule.label}:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{rule.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {rules.holidays && rules.holidays.length > 0 && (
        <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2 text-2xl">🎉</span>
            Holidays (No Games)
          </h3>
          <div className="flex flex-wrap gap-2">
            {rules.holidays.map((holiday: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg text-sm font-medium"
              >
                {holiday}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Divisions Tab Component
function DivisionsTab({ divisions }: { divisions: any[] }) {
  const getDivisionColor = (name: string) => {
    const colors: any = {
      "ES K-1 REC": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "ES 2-3 REC": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "ES BOY'S COMP": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "ES GIRL'S COMP": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      "BOY'S JV": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      "GIRL'S JV": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
    };
    return colors[name] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {divisions.map((division, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-sm"
        >
          <div className={`inline-block px-4 py-2 rounded-lg mb-4 ${getDivisionColor(division.name)}`}>
            <span className="font-semibold">{division.name}</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Teams:</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{division.team_count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Games:</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{division.estimated_games}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Teams Tab Component (continued in next file due to length)
function TeamsTab({ teams }: { teams: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState('all');

  const divisions = ['all', ...Array.from(new Set(teams.map(t => t.division)))];
  
  const filteredTeams = teams.filter(team => {
    const matchesSearch = searchTerm === '' ||
      team.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.coach_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = filterDivision === 'all' || team.division === filterDivision;
    return matchesSearch && matchesDivision;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search teams or coaches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          value={filterDivision}
          onChange={(e) => setFilterDivision(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {divisions.map(div => (
            <option key={div} value={div}>
              {div === 'all' ? 'All Divisions' : div}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Showing {filteredTeams.length} of {teams.length} teams
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">School</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Division</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Coach</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cluster</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tier</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
            {filteredTeams.map((team, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{team.school}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{team.division}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{team.coach_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{team.cluster || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{team.tier || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Schools Tab
function SchoolsTab({ schools }: { schools: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schools.map((school, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{school.name}</h3>
          <div className="space-y-2 mb-4">
            {school.cluster && (
              <div className="flex items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400 mr-2">📍</span>
                <span className="text-gray-700 dark:text-gray-300">Cluster: {school.cluster}</span>
              </div>
            )}
            {school.tier && (
              <div className="flex items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400 mr-2">🏆</span>
                <span className="text-gray-700 dark:text-gray-300">Tier: {school.tier}</span>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">{school.teams.length} team(s)</span>
            <div className="mt-2 space-y-1">
              {school.teams.map((team: any, teamIndex: number) => (
                <div key={teamIndex} className="text-xs text-gray-600 dark:text-gray-400">
                  • {team.division} - Coach {team.coach}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Facilities Tab
function FacilitiesTab({ facilities }: { facilities: any[] }) {
  return (
    <div className="space-y-4">
      {facilities.map((facility, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{facility.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{facility.address}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium">
              {facility.max_courts} Court{facility.max_courts > 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{facility.max_courts}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Courts</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{facility.available_dates_count}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Available Dates</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{facility.unavailable_dates_count}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Blocked Dates</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl">{facility.has_8ft_rims ? '✅' : '❌'}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">8ft Rims</div>
            </div>
          </div>
          
          {facility.notes && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <span className="font-medium">Note:</span> {facility.notes}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Clusters Tab
function ClustersTab({ clusters }: { clusters: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {clusters.map((cluster, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-sm text-center"
        >
          <div className="text-4xl mb-3">📍</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{cluster.name}</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{cluster.school_count}</div>
              <div className="text-xs text-blue-700 dark:text-blue-300">Schools</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{cluster.team_count}</div>
              <div className="text-xs text-green-700 dark:text-green-300">Teams</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Tiers Tab
function TiersTab({ tiers }: { tiers: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tiers.map((tier, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-sm text-center"
        >
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{tier.name}</h3>
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{tier.school_count}</div>
              <div className="text-xs text-purple-700 dark:text-purple-300">Schools</div>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{tier.team_count}</div>
              <div className="text-xs text-indigo-700 dark:text-indigo-300">Teams</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

interface Team {
  id: string;
  school_name: string;
  division: string;
  coach_name: string;
  coach_email: string;
  home_facility: string | null;
  tier: string | null;
  cluster: string | null;
  rivals: string[];
  do_not_play: string[];
}

interface Facility {
  name: string;
  address: string;
  max_courts: number;
  has_8ft_rims: boolean;
  notes: string;
  available_dates_count: number;
  unavailable_dates_count: number;
  available_dates: string[];
  unavailable_dates: string[];
}

interface School {
  name: string;
  cluster: string | null;
  tier: string | null;
  teams: Array<{
    id: string;
    division: string;
    coach_name: string;
    coach_email: string;
  }>;
}

interface ScheduleInfoData {
  teams: { [division: string]: Team[] };
  facilities: Facility[];
  schools: School[];
  rankings: {
    tiers: string[];
    clusters: string[];
    divisions: string[];
  };
  scheduling_rules: {
    season: {
      start_date: string;
      end_date: string;
    };
    game_duration: {
      minutes: number;
    };
    time_rules: {
      weeknight: {
        start_time: string;
        end_time: string;
        slots: number;
      };
      saturday: {
        start_time: string;
        end_time: string;
      };
      no_sunday_games: boolean;
    };
    frequency_rules: {
      max_games_per_7_days: number;
      max_games_per_14_days: number;
      max_doubleheaders_per_season: number;
      doubleheader_break_minutes: number;
    };
    holidays: string[];
    divisions: string[];
    recreational_divisions: string[];
    es_k1_rec_special: {
      priority_sites: string[];
    };
    priority_weights: { [key: string]: number };
  };
  summary: {
    total_teams: number;
    total_facilities: number;
    total_schools: number;
    teams_by_division: { [division: string]: number };
  };
}

export default function ScheduleInfo() {
  const [info, setInfo] = useState<ScheduleInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'teams' | 'facilities' | 'schools' | 'rankings' | 'rules'>('teams');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/info');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load information');
        console.error('Error loading info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading information...</p>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 font-medium">Error:</p>
          <p className="text-red-600 dark:text-red-300">{error || 'Failed to load information'}</p>
        </div>
      </div>
    );
  }

  const divisions = Object.keys(info.teams).sort();
  const filteredTeams = selectedDivision === 'all' 
    ? Object.values(info.teams).flat()
    : (info.teams[selectedDivision] || []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Teams</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{info.summary.total_teams}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Facilities</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{info.summary.total_facilities}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Schools</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{info.summary.total_schools}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Divisions</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{divisions.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px px-6">
          {[
            { id: 'teams', label: 'Teams', icon: '👥' },
            { id: 'facilities', label: 'Facilities', icon: '🏟️' },
            { id: 'schools', label: 'Schools', icon: '🏫' },
            { id: 'rankings', label: 'Rankings', icon: '📊' },
            { id: 'rules', label: 'Scheduling Rules', icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Teams</h2>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Divisions</option>
                {divisions.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Team ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">School</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Division</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Coach</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cluster</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Home Facility</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTeams.map((team, idx) => (
                    <tr key={team.id} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{team.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{team.school_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {team.division}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{team.coach_name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{team.coach_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{team.tier || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{team.cluster || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{team.home_facility || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Facilities Tab */}
        {activeTab === 'facilities' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {info.facilities.map((facility) => (
                <div key={facility.name} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{facility.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Address:</span> {facility.address}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Max Courts:</span> {facility.max_courts}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">8ft Rims:</span> {facility.has_8ft_rims ? 'Yes' : 'No'}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Available Dates:</span> {facility.available_dates_count}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Unavailable Dates:</span> {facility.unavailable_dates_count}
                    </div>
                    {facility.notes && (
                      <div className="text-gray-600 dark:text-gray-300 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Notes:</span> {facility.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schools Tab */}
        {activeTab === 'schools' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Schools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {info.schools.map((school) => (
                <div key={school.name} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{school.name}</h3>
                  <div className="space-y-2 text-sm mb-4">
                    {school.tier && (
                      <div className="text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Tier:</span> {school.tier}
                      </div>
                    )}
                    {school.cluster && (
                      <div className="text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Cluster:</span> {school.cluster}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teams ({school.teams.length}):</div>
                    <div className="space-y-1">
                      {school.teams.map((team) => (
                        <div key={team.id} className="text-sm text-gray-600 dark:text-gray-400">
                          • {team.division} - {team.coach_name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rankings Tab */}
        {activeTab === 'rankings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Rankings & Classifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Competitive Tiers</h3>
                <div className="space-y-2">
                  {info.rankings.tiers.map((tier, idx) => (
                    <div key={tier} className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 flex items-center justify-center text-sm font-semibold mr-3">
                        {idx + 1}
                      </span>
                      <span className="text-gray-900 dark:text-white">{tier}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Geographic Clusters</h3>
                <div className="space-y-2">
                  {info.rankings.clusters.map((cluster) => (
                    <div key={cluster} className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-3"></span>
                      <span className="text-gray-900 dark:text-white">{cluster}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Divisions</h3>
                <div className="space-y-2">
                  {info.rankings.divisions.map((division) => (
                    <div key={division} className="text-gray-900 dark:text-white">
                      • {division}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Scheduling Rules</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Season Information */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Season Dates</h3>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Start:</span> {info.scheduling_rules.season.start_date}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">End:</span> {info.scheduling_rules.season.end_date}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Game Duration:</span> {info.scheduling_rules.game_duration.minutes} minutes
                  </div>
                </div>
              </div>

              {/* Time Rules */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Time Rules</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Weeknights (Mon-Fri):</div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {info.scheduling_rules.time_rules.weeknight.start_time} - {info.scheduling_rules.time_rules.weeknight.end_time}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      {info.scheduling_rules.time_rules.weeknight.slots} time slots
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Saturday:</div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {info.scheduling_rules.time_rules.saturday.start_time} - {info.scheduling_rules.time_rules.saturday.end_time}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Sunday Games:</span> {info.scheduling_rules.time_rules.no_sunday_games ? 'Not Allowed' : 'Allowed'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Frequency Rules */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Game Frequency Rules</h3>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Max games per 7 days:</span> {info.scheduling_rules.frequency_rules.max_games_per_7_days}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Max games per 14 days:</span> {info.scheduling_rules.frequency_rules.max_games_per_14_days}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Max doubleheaders per season:</span> {info.scheduling_rules.frequency_rules.max_doubleheaders_per_season}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Doubleheader break:</span> {info.scheduling_rules.frequency_rules.doubleheader_break_minutes} minutes
                  </div>
                </div>
              </div>

              {/* Holidays */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Holidays (No Games)</h3>
                <div className="space-y-1 text-sm">
                  {info.scheduling_rules.holidays.map((holiday) => (
                    <div key={holiday} className="text-gray-600 dark:text-gray-300">
                      • {holiday}
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Rules */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Special Rules</h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recreational Divisions:</div>
                    <div className="flex flex-wrap gap-2">
                      {info.scheduling_rules.recreational_divisions.map((div) => (
                        <span key={div} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                          {div}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">ES K-1 REC Priority Sites:</div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      {info.scheduling_rules.es_k1_rec_special.priority_sites.map((site) => (
                        <div key={site}>• {site}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

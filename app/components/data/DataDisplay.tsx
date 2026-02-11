"use client";

import { useState } from 'react';
import { Card, CardTitle, Loading, Alert, Button, Badge, Tabs, TabPanel } from '@/app/components/ui';
import { useSchedulingData } from '@/app/lib/hooks';
import { getStatColor, getDivisionColor } from '@/app/lib/utils';
import type { SchedulingData, Division, Facility, School, Cluster, Tier } from '@/app/types';

export default function DataDisplay() {
  const { data, isLoading, error, refetch, lastUpdated } = useSchedulingData();
  const [activeTab, setActiveTab] = useState('summary');

  if (isLoading) {
    return <Loading message="Loading scheduling data..." />;
  }

  if (error || !data) {
    return (
      <Card>
        <Alert variant="error" title="Error Loading Data">
          {error || 'Failed to load data'}
        </Alert>
        <Button onClick={refetch} variant="primary" className="mt-4">
          Retry
        </Button>
      </Card>
    );
  }

  const tabs = [
    { id: 'summary', label: 'Summary', icon: '📊' },
    { id: 'rules', label: 'Scheduling Rules', icon: '📋' },
    { id: 'divisions', label: 'Divisions', icon: '🏀' },
    { id: 'teams', label: 'Teams', icon: '👥' },
    { id: 'schools', label: 'Schools', icon: '🏫' },
    { id: 'facilities', label: 'Facilities', icon: '🏟️' },
    { id: 'clusters', label: 'Geographic Clusters', icon: '📍' },
    { id: 'tiers', label: 'Competitive Tiers', icon: '🏆' },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Scheduling Information</CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View all data used for schedule generation
              {lastUpdated && (
                <span className="ml-2 text-sm text-gray-500">
                  (Last updated: {new Date(lastUpdated).toLocaleTimeString()})
                </span>
              )}
            </p>
          </div>
          <Button onClick={refetch} variant="secondary" size="sm">
            <span className="mr-2">🔄</span>
            Refresh
          </Button>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex justify-center">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <TabPanel value="summary" activeValue={activeTab}>
        <SummaryTab data={data} />
      </TabPanel>

      <TabPanel value="rules" activeValue={activeTab}>
        <RulesTab rules={data.rules} />
      </TabPanel>

      <TabPanel value="divisions" activeValue={activeTab}>
        <DivisionsTab divisions={data.divisions} />
      </TabPanel>

      <TabPanel value="teams" activeValue={activeTab}>
        <TeamsTab teams={data.teams} />
      </TabPanel>

      <TabPanel value="schools" activeValue={activeTab}>
        <SchoolsTab schools={data.schools} />
      </TabPanel>

      <TabPanel value="facilities" activeValue={activeTab}>
        <FacilitiesTab facilities={data.facilities} />
      </TabPanel>

      <TabPanel value="clusters" activeValue={activeTab}>
        <ClustersTab clusters={data.clusters} />
      </TabPanel>

      <TabPanel value="tiers" activeValue={activeTab}>
        <TiersTab tiers={data.tiers} />
      </TabPanel>
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
    { label: 'Estimated Games', value: data.summary.total_estimated_games, icon: '🎯', color: 'red' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            padding="md"
            hover
            className="text-center transition-transform hover:scale-105"
          >
            <div
              className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${getStatColor(stat.color)}`}
            >
              <span className="text-3xl">{stat.icon}</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</div>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center">
          <span className="mr-2 text-2xl">📅</span>
          Season Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <span className="text-blue-700 dark:text-blue-300 font-medium mr-2">Season Start:</span>
            <Badge variant="info">{data.rules.season_start}</Badge>
          </div>
          <div className="flex items-center">
            <span className="text-blue-700 dark:text-blue-300 font-medium mr-2">Season End:</span>
            <Badge variant="info">{data.rules.season_end}</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Rules Tab Component
function RulesTab({ rules }: { rules: SchedulingData['rules'] }) {
  const ruleGroups = [
    {
      title: 'Season Period',
      icon: '📅',
      rules: [
        { label: 'Start Date', value: rules.season_start },
        { label: 'End Date', value: rules.season_end },
        { label: 'No Games on Sunday', value: rules.no_games_on_sunday ? 'Yes' : 'No' },
      ],
    },
    {
      title: 'Game Timing',
      icon: '⏰',
      rules: [
        { label: 'Game Duration', value: `${rules.game_duration_minutes} minutes` },
        { label: 'Weeknight Games', value: rules.weeknight_time },
        { label: 'Saturday Games', value: rules.saturday_time },
        { label: 'Weeknight Slots Required', value: rules.weeknight_slots_required },
      ],
    },
    {
      title: 'Game Frequency',
      icon: '🎯',
      rules: [
        { label: 'Games Per Team', value: rules.games_per_team },
        { label: 'Max Games in 7 Days', value: rules.max_games_per_7_days },
        { label: 'Max Games in 14 Days', value: rules.max_games_per_14_days },
        { label: 'Max Doubleheaders Per Season', value: rules.max_doubleheaders_per_season },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {ruleGroups.map((group, index) => (
        <Card key={index}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-3 text-2xl">{group.icon}</span>
            {group.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.rules.map((rule, ruleIndex) => (
              <div
                key={ruleIndex}
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {rule.label}:
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{rule.value}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {rules.holidays && rules.holidays.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-3 text-2xl">🎉</span>
            Holidays (No Games)
          </h3>
          <div className="flex flex-wrap gap-2">
            {rules.holidays.map((holiday, index) => (
              <Badge key={index} variant="danger" size="md">
                {holiday}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// Divisions Tab Component
function DivisionsTab({ divisions }: { divisions: Division[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {divisions.map((division, index) => (
        <Card key={index} padding="md" hover className="transition-transform hover:scale-105">
          <Badge className={`${getDivisionColor(division.name)} mb-4`} size="md">
            {division.name}
          </Badge>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Teams:</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {division.team_count}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Games:</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {division.estimated_games}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Teams Tab Component
function TeamsTab({ teams }: { teams: SchedulingData['teams'] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState('all');

  const divisions = ['all', ...Array.from(new Set(teams.map((t) => t.division)))];

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      searchTerm === '' ||
      team.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.coach_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = filterDivision === 'all' || team.division === filterDivision;
    return matchesSearch && matchesDivision;
  });

  return (
    <Card>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search teams or coaches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <select
          value={filterDivision}
          onChange={(e) => setFilterDivision(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
        >
          {divisions.map((div) => (
            <option key={div} value={div}>
              {div === 'all' ? 'All Divisions' : div}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Showing <span className="font-semibold">{filteredTeams.length}</span> of{' '}
        <span className="font-semibold">{teams.length}</span> teams
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                School
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Division
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Coach
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Cluster
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Tier
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTeams.map((team, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                  {team.school}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getDivisionColor(team.division)} size="sm">
                    {team.division}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {team.coach_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {team.cluster || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {team.tier || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// Schools Tab
function SchoolsTab({ schools }: { schools: School[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schools.map((school, index) => (
        <Card key={index} padding="md" hover className="transition-transform hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{school.name}</h3>
          <div className="space-y-2 mb-4">
            {school.cluster && (
              <div className="flex items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400 mr-2">📍</span>
                <Badge variant="success" size="sm">
                  {school.cluster}
                </Badge>
              </div>
            )}
            {school.tier && (
              <div className="flex items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400 mr-2">🏆</span>
                <Badge variant="warning" size="sm">
                  {school.tier}
                </Badge>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {school.teams.length} team(s)
            </span>
            <div className="mt-2 space-y-1">
              {school.teams.map((team, teamIndex) => (
                <div key={teamIndex} className="text-xs text-gray-600 dark:text-gray-400">
                  • {team.division} - Coach {team.coach || team.coach_name}
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Facilities Tab
function FacilitiesTab({ facilities }: { facilities: Facility[] }) {
  return (
    <div className="space-y-4">
      {facilities.map((facility, index) => (
        <Card key={index} hover>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{facility.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{facility.address}</p>
            </div>
            <Badge variant="primary" size="md">
              {facility.max_courts} Court{facility.max_courts > 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {facility.max_courts}
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">Courts</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-lg">
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {facility.available_dates_count}
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">Available</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30 rounded-lg">
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                {facility.unavailable_dates_count}
              </div>
              <div className="text-xs text-red-700 dark:text-red-300">Blocked</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-lg">
              <div className="text-3xl">{facility.has_8ft_rims ? '✅' : '❌'}</div>
              <div className="text-xs text-purple-700 dark:text-purple-300">8ft Rims</div>
            </div>
          </div>

          {facility.notes && (
            <Alert variant="warning" className="text-sm">
              <strong>Note:</strong> {facility.notes}
            </Alert>
          )}
        </Card>
      ))}
    </div>
  );
}

// Clusters Tab
function ClustersTab({ clusters }: { clusters: Cluster[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {clusters.map((cluster, index) => (
        <Card
          key={index}
          padding="md"
          hover
          className="text-center transition-transform hover:scale-105"
        >
          <div className="text-5xl mb-4">📍</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{cluster.name}</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-lg">
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {cluster.school_count}
              </div>
              <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Schools</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-lg">
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {cluster.team_count}
              </div>
              <div className="text-xs font-medium text-green-700 dark:text-green-300">Teams</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Tiers Tab
function TiersTab({ tiers }: { tiers: Tier[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tiers.map((tier, index) => (
        <Card
          key={index}
          padding="md"
          hover
          className="text-center transition-transform hover:scale-105"
        >
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{tier.name}</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-lg">
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {tier.school_count}
              </div>
              <div className="text-xs font-medium text-purple-700 dark:text-purple-300">Schools</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/30 rounded-lg">
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">
                {tier.team_count}
              </div>
              <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Teams</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

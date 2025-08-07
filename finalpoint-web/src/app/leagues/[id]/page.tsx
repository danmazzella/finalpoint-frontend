'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { leaguesAPI, activityAPI, League, f1racesAPI } from '@/lib/api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface CurrentRace {
  weekNumber: number;
  raceName: string;
  raceDate: string;
  status: string;
}

export default function LeagueDetailPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const params = useParams();
  const router = useRouter();
  const leagueId = params.id as string;

  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [showStandings, setShowStandings] = useState(false);
  const [currentRace, setCurrentRace] = useState<CurrentRace | null>(null);
  const [loadingCurrentRace, setLoadingCurrentRace] = useState(false);

  useEffect(() => {
    if (user) {
      loadLeague();
      loadCurrentRace();
      loadRecentActivity(parseInt(leagueId));
      loadLeagueStats(parseInt(leagueId));
    }
  }, [user, leagueId]);

  const loadLeague = async () => {
    try {
      setLoading(true);
      const response = await leaguesAPI.getLeague(parseInt(leagueId));
      if (response.data.success) {
        setLeague(response.data.data);
        setIsMember(response.data.data.isMember);
        // Load recent activity after league is loaded
        loadRecentActivity(parseInt(leagueId));
        // Load stats
        loadLeagueStats(parseInt(leagueId));
      }
    } catch (error) {
      console.error('Error loading league:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivity = async (leagueId: number) => {
    try {
      setActivityLoading(true);

      const response = await activityAPI.getRecentActivity(leagueId, 10);

      if (response.data.success) {
        setRecentActivity(response.data.data);
      }
    } catch (error: any) {
      console.error('Error loading recent activity:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  const loadLeagueMembers = async (leagueId: number) => {
    try {
      const response = await leaguesAPI.getLeagueMembers(leagueId);
      if (response.data.success) {
        setMembers(response.data.data);
      }
    } catch (error: any) {
      console.error('Error loading league members:', error);
      showToast('Failed to load league members', 'error');
    }
  };

  const loadLeagueStandings = async (leagueId: number) => {
    try {
      const response = await leaguesAPI.getLeagueStandings(leagueId);
      if (response.data.success) {
        setStandings(response.data.data);
      }
    } catch (error: any) {
      console.error('Error loading league standings:', error);
      showToast('Failed to load league standings', 'error');
    }
  };

  const loadLeagueStats = async (leagueId: number) => {
    try {
      const response = await leaguesAPI.getLeagueStats(leagueId);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      console.error('Error loading league stats:', error);
    }
  };

  const loadCurrentRace = async () => {
    try {
      setLoadingCurrentRace(true);
      const response = await f1racesAPI.getCurrentRace();
      if (response.data.success) {
        setCurrentRace(response.data.data);
      }
    } catch (error) {
      console.error('Error loading current race:', error);
    } finally {
      setLoadingCurrentRace(false);
    }
  };

  const joinLeague = async () => {
    if (!league) return;

    try {
      setJoining(true);
      const response = await leaguesAPI.joinLeague(league.id);
      if (response.data.success) {
        showToast('Successfully joined the league!', 'success');
        // Update membership status and refresh activity
        setIsMember(true);
        loadRecentActivity(parseInt(leagueId));
        loadLeagueStats(parseInt(leagueId));
      }
    } catch (error: any) {
      console.error('Error joining league:', error);
      showToast(error.response?.data?.message || 'Failed to join league. Please try again.', 'error');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">League not found</h1>
            <p className="text-gray-600 mt-2">The league you're looking for doesn't exist.</p>
            <Link
              href="/leagues"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
            >
              Back to Leagues
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{league.name}</h1>
              <p className="text-gray-600">Season {league.seasonYear}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/leagues"
                className="text-gray-600 hover:text-gray-700 font-medium"
              >
                All Leagues
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions and League Stats - Left Side */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href={`/picks?league=${league.id}`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
                >
                  Make Picks
                </Link>
                {!isMember && (
                  <button
                    onClick={joinLeague}
                    disabled={joining}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {joining ? 'Joining...' : 'Join League'}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (!showStandings) {
                      loadLeagueStandings(parseInt(leagueId));
                    }
                    setShowStandings(!showStandings);
                    setShowMembers(false);

                    // Scroll to standings section after a brief delay to allow content to render
                    if (!showStandings) {
                      setTimeout(() => {
                        const standingsElement = document.getElementById('league-standings');
                        if (standingsElement) {
                          standingsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {showStandings ? 'Hide Standings' : 'View Standings'}
                </button>
                <button
                  onClick={() => {
                    if (!showMembers) {
                      loadLeagueMembers(parseInt(leagueId));
                    }
                    setShowMembers(!showMembers);
                    setShowStandings(false);

                    // Scroll to members section after a brief delay to allow content to render
                    if (!showMembers) {
                      setTimeout(() => {
                        const membersElement = document.getElementById('league-members');
                        if (membersElement) {
                          membersElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {showMembers ? 'Hide Members' : 'View Members'}
                </button>
                <Link
                  href={`/leagues/${leagueId}/results/${currentRace?.weekNumber || 1}`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {loadingCurrentRace ? 'Loading...' : 'View Results'}
                </Link>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  League Settings
                </button>
              </div>
            </div>

            {/* League Stats */}
            <div className="bg-white shadow rounded-lg p-6 mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">League Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Picks</span>
                  <span className="text-sm font-medium text-gray-900">{stats?.totalPicks || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Correct Picks</span>
                  <span className="text-sm font-medium text-gray-900">{stats?.correctPicks || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Accuracy</span>
                  <span className="text-sm font-medium text-gray-900">{stats?.overallAccuracy || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Average Points</span>
                  <span className="text-sm font-medium text-gray-900">{stats?.averagePoints || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* League Info and Recent Activity - Right Side */}
          <div className="lg:col-span-2">
            {/* League Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">League Information</h2>
                {league.joinCode && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/joinleague/${league.joinCode}`;
                        navigator.clipboard.writeText(shareUrl);
                        showToast('Invite link copied! Share it with friends to join your league.', 'success');
                      }}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Invite Friends
                    </button>
                    <button
                      onClick={() => {
                        if (league.joinCode) {
                          navigator.clipboard.writeText(league.joinCode);
                          showToast('Join code copied to clipboard!', 'success');
                        }
                      }}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Code
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">League Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{league.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Season</dt>
                  <dd className="mt-1 text-sm text-gray-900">{league.seasonYear}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Members</dt>
                  <dd className="mt-1 text-sm text-gray-900">{league.memberCount || 1} member{league.memberCount !== 1 ? 's' : ''}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Your Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isMember
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {isMember ? 'Member' : 'Not a Member'}
                    </span>
                  </dd>
                </div>
                {league.joinCode && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Join Code</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className="font-mono tracking-widest bg-gray-100 px-2 py-1 rounded">
                        {league.joinCode}
                      </span>
                    </dd>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg p-6 mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              {activityLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading activity...</p>
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 mb-2">Found {recentActivity.length} activities</div>
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${activity.activityType === 'pick_created' ? 'bg-green-100' :
                          activity.activityType === 'pick_changed' ? 'bg-blue-100' :
                            activity.activityType === 'user_joined' ? 'bg-purple-100' :
                              'bg-pink-100'
                          }`}>
                          <svg className={`h-4 w-4 ${activity.activityType === 'pick_created' ? 'text-green-600' :
                            activity.activityType === 'pick_changed' ? 'text-blue-600' :
                              activity.activityType === 'user_joined' ? 'text-purple-600' :
                                'text-pink-600'
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {activity.activityType === 'pick_created' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : activity.activityType === 'pick_changed' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            ) : activity.activityType === 'user_joined' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.activityType === 'user_joined' ? (
                            `${activity.userName} joined the league`
                          ) : (
                            `${activity.userName} ${activity.activityType === 'pick_created' ? 'made a pick' : 'changed their pick'} for Week ${activity.weekNumber}`
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.activityType === 'pick_created' ? (
                            `Picked ${activity.driverName} (${activity.driverTeam})`
                          ) : activity.activityType === 'pick_changed' ? (
                            `Changed from ${activity.previousDriverName} (${activity.previousDriverTeam}) to ${activity.driverName} (${activity.driverTeam})`
                          ) : activity.activityType === 'user_joined' ? (
                            `Welcome to the league!`
                          ) : (
                            `Picked ${activity.driverName} (${activity.driverTeam})`
                          )}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                  <p className="mt-1 text-sm text-gray-500">Activity will appear here as members make picks.</p>
                </div>
              )}
            </div>

            {/* League Members */}
            {showMembers && (
              <div id="league-members" className="bg-white shadow rounded-lg p-6 mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">League Members</h2>
                {members.length > 0 ? (
                  <div className="space-y-3">
                    {members.map((member, index) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                            <span className="text-pink-600 font-medium text-sm">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.role === 'Owner'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {member.role}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
                    <p className="mt-1 text-sm text-gray-500">Members will appear here once they join the league.</p>
                  </div>
                )}
              </div>
            )}

            {/* League Standings */}
            {showStandings && (
              <div id="league-standings" className="bg-white shadow rounded-lg p-6 mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">League Standings</h2>
                {standings.length > 0 ? (
                  <div className="space-y-3">
                    {standings.map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-100' :
                            index === 1 ? 'bg-gray-100' :
                              index === 2 ? 'bg-orange-100' : 'bg-gray-100'
                            }`}>
                            <span className={`font-medium text-sm ${index === 0 ? 'text-yellow-600' :
                              index === 1 ? 'text-gray-600' :
                                index === 2 ? 'text-orange-600' : 'text-gray-600'
                              }`}>
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{player.name}</p>
                            <p className="text-xs text-gray-500">
                              {player.totalPicks} picks • {player.correctPicks} correct
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{player.totalPoints} pts</p>
                          <p className="text-xs text-gray-500">{player.accuracy}% accuracy</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No standings available</h3>
                    <p className="mt-1 text-sm text-gray-500">Standings will appear here once picks are made.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 
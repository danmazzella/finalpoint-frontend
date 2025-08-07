import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { leaguesAPI, picksAPI, f1racesAPI } from '../services/apiService';

interface League {
    id: number;
    name: string;
    ownerId: number;
    seasonYear: number;
    memberCount?: number;
    joinCode?: string;
    isMember?: boolean;
}

interface LeagueMember {
    id: number;
    name: string;
    role: string;
    joinedAt: string;
}

interface LeagueStanding {
    id: number;
    name: string;
    totalPoints: number;
    totalPicks: number;
    correctPicks: number;
    accuracy: number;
}

interface CurrentRace {
    weekNumber: number;
    raceName: string;
    raceDate: string;
    status: string;
}

interface LeagueStats {
    totalPicks: number;
    correctPicks: number;
    overallAccuracy: number;
    averagePoints: number;
}

const LeagueDetailScreen = ({ route, navigation }: any) => {
    const { leagueId } = route.params;

    const [league, setLeague] = useState<League | null>(null);
    const [members, setMembers] = useState<LeagueMember[]>([]);
    const [standings, setStandings] = useState<LeagueStanding[]>([]);
    const [stats, setStats] = useState<LeagueStats | null>(null);
    const [currentRace, setCurrentRace] = useState<CurrentRace | null>(null);
    const [loading, setLoading] = useState(true);
    const [showMembers, setShowMembers] = useState(false);
    const [showStandings, setShowStandings] = useState(false);
    const [loadingCurrentRace, setLoadingCurrentRace] = useState(false);

    useEffect(() => {
        loadLeagueData();
    }, [leagueId]);

    const loadLeagueData = async () => {
        try {
            setLoading(true);
            const [leagueResponse, currentRaceResponse] = await Promise.all([
                leaguesAPI.getLeague(leagueId),
                f1racesAPI.getCurrentRace()
            ]);

            if (leagueResponse.data.success) {
                setLeague(leagueResponse.data.data);
            }

            if (currentRaceResponse.data.success) {
                setCurrentRace(currentRaceResponse.data.data);
            }
        } catch (error) {
            console.error('Error loading league data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadLeagueMembers = async () => {
        try {
            const response = await leaguesAPI.getLeagueMembers(leagueId);
            if (response.data.success) {
                setMembers(response.data.data);
            }
        } catch (error) {
            console.error('Error loading league members:', error);
        }
    };

    const loadLeagueStandings = async () => {
        try {
            const response = await leaguesAPI.getLeagueStandings(leagueId);
            if (response.data.success) {
                setStandings(response.data.data);
            }
        } catch (error) {
            console.error('Error loading league standings:', error);
        }
    };

    const loadLeagueStats = async () => {
        try {
            const response = await leaguesAPI.getLeagueStats(leagueId);
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error loading league stats:', error);
        }
    };

    const shareLeague = () => {
        if (league?.joinCode) {
            const shareUrl = `https://yourapp.com/joinleague/${league.joinCode}`;
            Alert.alert(
                'Share League',
                `Share this link with friends to invite them to join ${league.name}:`,
                [
                    {
                        text: 'Copy Link', onPress: () => {
                            Alert.alert('Link copied to clipboard!');
                        }
                    },
                    { text: 'Cancel', style: 'cancel' }
                ]
            );
        }
    };

    const navigateToResults = () => {
        if (currentRace) {
            navigation.navigate('RaceResults', {
                leagueId,
                weekNumber: currentRace.weekNumber
            });
        } else {
            navigation.navigate('RaceResults', {
                leagueId,
                weekNumber: 1
            });
        }
    };

    const navigateToPicks = () => {
        navigation.navigate('Picks', { leagueId });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#e91e63" />
            </View>
        );
    }

    if (!league) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>League not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.leagueName}>{league.name}</Text>
                <Text style={styles.leagueSubtitle}>Season {league.seasonYear}</Text>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={navigateToPicks}
                    >
                        <Text style={styles.primaryButtonText}>Make Picks</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={navigateToResults}
                    >
                        <Text style={styles.secondaryButtonText}>
                            {loadingCurrentRace ? 'Loading...' : 'View Results'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => {
                            if (!showMembers) {
                                loadLeagueMembers();
                            }
                            setShowMembers(!showMembers);
                            setShowStandings(false);
                        }}
                    >
                        <Text style={styles.secondaryButtonText}>
                            {showMembers ? 'Hide Members' : 'View Members'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => {
                            if (!showStandings) {
                                loadLeagueStandings();
                            }
                            setShowStandings(!showStandings);
                            setShowMembers(false);
                        }}
                    >
                        <Text style={styles.secondaryButtonText}>
                            {showStandings ? 'Hide Standings' : 'View Standings'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.shareButton}
                        onPress={shareLeague}
                    >
                        <Text style={styles.shareButtonText}>Invite Friends</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* League Stats */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>League Stats</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Total Picks</Text>
                        <Text style={styles.statValue}>{stats?.totalPicks || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Correct Picks</Text>
                        <Text style={styles.statValue}>{stats?.correctPicks || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Accuracy</Text>
                        <Text style={styles.statValue}>{stats?.overallAccuracy || 0}%</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Avg Points</Text>
                        <Text style={styles.statValue}>{stats?.averagePoints || 0}</Text>
                    </View>
                </View>
            </View>

            {/* League Information */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>League Information</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>League Name</Text>
                        <Text style={styles.infoValue}>{league.name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Season</Text>
                        <Text style={styles.infoValue}>{league.seasonYear}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Members</Text>
                        <Text style={styles.infoValue}>
                            {league.memberCount || 1} member{league.memberCount !== 1 ? 's' : ''}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Status</Text>
                        <Text style={styles.infoValue}>Active</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Your Status</Text>
                        <Text style={styles.infoValue}>
                            {league.isMember ? 'Member' : 'Not a Member'}
                        </Text>
                    </View>
                    {league.joinCode && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Join Code</Text>
                            <Text style={styles.infoValue}>{league.joinCode}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* League Members */}
            {showMembers && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>League Members</Text>
                    {members.length > 0 ? (
                        members.map((member) => (
                            <View key={member.id} style={styles.memberCard}>
                                <View style={styles.memberInfo}>
                                    <View style={styles.memberAvatar}>
                                        <Text style={styles.memberInitial}>
                                            {member.name.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={styles.memberDetails}>
                                        <Text style={styles.memberName}>{member.name}</Text>
                                        <Text style={styles.memberRole}>{member.role}</Text>
                                    </View>
                                </View>
                                <Text style={styles.memberDate}>
                                    {new Date(member.joinedAt).toLocaleDateString()}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No members found</Text>
                    )}
                </View>
            )}

            {/* League Standings */}
            {showStandings && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>League Standings</Text>
                    {standings.length > 0 ? (
                        standings.map((player, index) => (
                            <View key={player.id} style={styles.standingCard}>
                                <View style={styles.standingInfo}>
                                    <View style={[styles.standingPosition,
                                    index === 0 ? styles.firstPlace :
                                        index === 1 ? styles.secondPlace :
                                            index === 2 ? styles.thirdPlace : styles.otherPlace
                                    ]}>
                                        <Text style={styles.standingPositionText}>{index + 1}</Text>
                                    </View>
                                    <View style={styles.standingDetails}>
                                        <Text style={styles.standingName}>{player.name}</Text>
                                        <Text style={styles.standingStats}>
                                            {player.totalPicks} picks • {player.correctPicks} correct
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.standingPoints}>
                                    <Text style={styles.standingPointsText}>{player.totalPoints} pts</Text>
                                    <Text style={styles.standingAccuracy}>{player.accuracy}% accuracy</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No standings available</Text>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginTop: 50,
    },
    header: {
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    leagueName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    leagueSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    section: {
        backgroundColor: 'white',
        margin: 10,
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    actionButtons: {
        gap: 10,
    },
    primaryButton: {
        backgroundColor: '#e91e63',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    secondaryButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    shareButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    shareButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    statItem: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    infoContainer: {
        gap: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    memberCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginBottom: 10,
    },
    memberInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    memberInitial: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    memberDetails: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    memberRole: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    memberDate: {
        fontSize: 12,
        color: '#999',
    },
    standingCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginBottom: 10,
    },
    standingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    standingPosition: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    firstPlace: {
        backgroundColor: '#FFD700',
    },
    secondPlace: {
        backgroundColor: '#C0C0C0',
    },
    thirdPlace: {
        backgroundColor: '#CD7F32',
    },
    otherPlace: {
        backgroundColor: '#e0e0e0',
    },
    standingPositionText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    standingDetails: {
        flex: 1,
    },
    standingName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    standingStats: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    standingPoints: {
        alignItems: 'flex-end',
    },
    standingPointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    standingAccuracy: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 20,
    },
});

export default LeagueDetailScreen;

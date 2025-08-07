import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { picksAPI, f1racesAPI } from '../services/apiService';

interface RaceResult {
    id: number;
    userId: number;
    userName: string;
    driverId: number;
    driverName: string;
    driverTeam: string;
    actualP10DriverId: number;
    actualP10DriverName: string;
    actualP10DriverTeam: string;
    positionDifference: number;
    isCorrect: boolean;
    points: number;
}

interface RaceResultsData {
    leagueId: number;
    weekNumber: number;
    actualP10DriverId: number;
    actualP10DriverName: string;
    actualP10DriverTeam: string;
    totalPicks: number;
    correctPicks: number;
    results: RaceResult[];
}

interface Race {
    id: number;
    weekNumber: number;
    raceName: string;
    status: string;
}

const RaceResultsScreen = ({ route, navigation }: any) => {
    const { leagueId, weekNumber } = route.params;

    const [results, setResults] = useState<RaceResultsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [races, setRaces] = useState<Race[]>([]);
    const [selectedWeek, setSelectedWeek] = useState(parseInt(weekNumber));
    const [showWeekSelector, setShowWeekSelector] = useState(false);

    useEffect(() => {
        loadData();
    }, [leagueId, selectedWeek]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [racesResponse, resultsResponse] = await Promise.all([
                f1racesAPI.getAllRaces(),
                picksAPI.getRaceResults(leagueId, selectedWeek)
            ]);

            if (racesResponse.data.success) {
                setRaces(racesResponse.data.data);
            }

            if (resultsResponse.data.success) {
                setResults(resultsResponse.data.data);
            }
        } catch (error) {
            console.error('Error loading race results:', error);
            Alert.alert('Error', 'Failed to load race results');
        } finally {
            setLoading(false);
        }
    };

    const handleWeekChange = (week: number) => {
        setSelectedWeek(week);
        setShowWeekSelector(false);
        navigation.setParams({ weekNumber: week });
    };

    const getPositionDifferenceText = (difference: number) => {
        if (difference === 0) return 'Correct!';
        if (difference === 1) return '1 position off';
        return `${difference} positions off`;
    };

    const getPositionDifferenceColor = (difference: number) => {
        if (difference === 0) return '#4CAF50';
        if (difference <= 2) return '#FF9800';
        if (difference <= 5) return '#FF5722';
        return '#F44336';
    };

    const getCurrentRace = () => {
        return races.find(race => race.weekNumber === selectedWeek);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#e91e63" />
            </View>
        );
    }

    if (!results) {
        const currentRace = getCurrentRace();
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>No Race Results Available</Text>
                    <Text style={styles.subtitle}>
                        {currentRace ? currentRace.raceName : `Week ${selectedWeek}`}
                    </Text>
                </View>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        No results are available for this race yet. The race may not have finished or results haven't been entered.
                    </Text>
                </View>
            </View>
        );
    }

    const currentRace = getCurrentRace();

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Race Results</Text>
                <Text style={styles.subtitle}>
                    {currentRace ? currentRace.raceName : `Week ${results.weekNumber}`}
                </Text>
            </View>

            {/* Week Navigation */}
            <View style={styles.weekNavigation}>
                <TouchableOpacity
                    style={styles.weekButton}
                    onPress={() => setShowWeekSelector(!showWeekSelector)}
                >
                    <Text style={styles.weekButtonText}>Week {selectedWeek}</Text>
                    <Text style={styles.weekButtonIcon}>▼</Text>
                </TouchableOpacity>
            </View>

            {/* Week Selector */}
            {showWeekSelector && (
                <View style={styles.weekSelector}>
                    {races.map((race) => (
                        <TouchableOpacity
                            key={race.weekNumber}
                            style={[
                                styles.weekOption,
                                race.weekNumber === selectedWeek && styles.selectedWeekOption
                            ]}
                            onPress={() => handleWeekChange(race.weekNumber)}
                        >
                            <Text style={[
                                styles.weekOptionText,
                                race.weekNumber === selectedWeek && styles.selectedWeekOptionText
                            ]}>
                                Week {race.weekNumber} - {race.raceName}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Results Summary */}
            <View style={styles.summarySection}>
                <Text style={styles.sectionTitle}>Results Summary</Text>
                <View style={styles.summaryStats}>
                    <View style={styles.summaryStat}>
                        <Text style={styles.summaryStatLabel}>Total Picks</Text>
                        <Text style={styles.summaryStatValue}>{results.totalPicks}</Text>
                    </View>
                    <View style={styles.summaryStat}>
                        <Text style={styles.summaryStatLabel}>Correct Picks</Text>
                        <Text style={styles.summaryStatValue}>{results.correctPicks}</Text>
                    </View>
                    <View style={styles.summaryStat}>
                        <Text style={styles.summaryStatLabel}>P10 Driver</Text>
                        <Text style={styles.summaryStatValue}>
                            {results.actualP10DriverName}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Results List */}
            <View style={styles.resultsSection}>
                <Text style={styles.sectionTitle}>Player Results</Text>
                {results.results.map((result, index) => (
                    <View key={result.id || index} style={styles.resultCard}>
                        <View style={styles.resultHeader}>
                            <View style={styles.positionBadge}>
                                <Text style={styles.positionText}>{index + 1}</Text>
                            </View>
                            <View style={styles.playerInfo}>
                                <Text style={styles.playerName}>{result.userName}</Text>
                                <Text style={styles.playerPick}>
                                    Picked: {result.driverName} ({result.driverTeam})
                                </Text>
                            </View>
                            <View style={styles.pointsContainer}>
                                <Text style={styles.pointsText}>{result.points} pts</Text>
                            </View>
                        </View>

                        {result.positionDifference !== null && (
                            <View style={styles.resultDetails}>
                                <View style={[
                                    styles.differenceBadge,
                                    { backgroundColor: getPositionDifferenceColor(result.positionDifference) }
                                ]}>
                                    <Text style={styles.differenceText}>
                                        {getPositionDifferenceText(result.positionDifference)}
                                    </Text>
                                </View>
                                <Text style={styles.actualP10Text}>
                                    P10: {result.actualP10DriverName} ({result.actualP10DriverTeam})
                                </Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>
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
    header: {
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    weekNavigation: {
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    weekButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    weekButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    weekButtonIcon: {
        fontSize: 12,
        color: '#666',
    },
    weekSelector: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    weekOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    selectedWeekOption: {
        backgroundColor: '#e91e63',
    },
    weekOptionText: {
        fontSize: 14,
        color: '#333',
    },
    selectedWeekOptionText: {
        color: 'white',
        fontWeight: 'bold',
    },
    summarySection: {
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
    summaryStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryStat: {
        flex: 1,
        alignItems: 'center',
    },
    summaryStatLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    summaryStatValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    resultsSection: {
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
    resultCard: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    positionBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    positionText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    playerPick: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    pointsContainer: {
        alignItems: 'flex-end',
    },
    pointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    resultDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    differenceBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    differenceText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    actualP10Text: {
        fontSize: 12,
        color: '#666',
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default RaceResultsScreen;

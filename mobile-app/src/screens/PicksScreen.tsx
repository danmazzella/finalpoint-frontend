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
import { picksAPI, driversAPI, leaguesAPI, f1racesAPI } from '../services/apiService';

interface Driver {
  id: number;
  name: string;
  team: string;
  driverNumber: number;
  country: string;
}

interface Pick {
  id: number;
  leagueId: number;
  weekNumber: number;
  driverId: number;
  driverName: string;
  driverTeam: string;
  isLocked: boolean;
  points: number;
}

interface League {
  id: number;
  name: string;
  seasonYear: number;
  memberCount?: number;
}

interface CurrentRace {
  weekNumber: number;
  raceName: string;
  raceDate: string;
  status: string;
}

const PicksScreen = ({ route }: any) => {
  const { leagueId: routeLeagueId } = route?.params || {};

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(routeLeagueId || null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [currentRace, setCurrentRace] = useState<CurrentRace | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [driversResponse, leaguesResponse, currentRaceResponse] = await Promise.all([
        driversAPI.getDrivers(),
        leaguesAPI.getLeagues(),
        f1racesAPI.getCurrentRace()
      ]);

      if (driversResponse.data.success) {
        setDrivers(driversResponse.data.data);
      }

      if (leaguesResponse.data.success) {
        setLeagues(leaguesResponse.data.data);
        // If no league is selected and we have leagues, select the first one
        if (!selectedLeague && leaguesResponse.data.data.length > 0) {
          setSelectedLeague(leaguesResponse.data.data[0].id);
        }
      }

      if (currentRaceResponse.data.success) {
        setCurrentRace(currentRaceResponse.data.data);
        setCurrentWeek(currentRaceResponse.data.data.weekNumber);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const makePick = async (driverId: number) => {
    if (!selectedLeague) {
      Alert.alert('Error', 'Please select a league first');
      return;
    }

    try {
      setSubmitting(true);
      const response = await picksAPI.makePick(selectedLeague, currentWeek, driverId);
      if (response.data.success) {
        Alert.alert('Success', 'Pick submitted successfully!');
        setSelectedDriver(driverId);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit pick. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrentPick = () => {
    // This would need to be implemented with actual pick data
    return null as Pick | null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  const currentPick = getCurrentPick();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Make Your P10 Pick</Text>
        <Text style={styles.subtitle}>Week {currentWeek} - 2025 F1 Season</Text>
      </View>

      {/* League Selection */}
      <View style={styles.leagueSection}>
        <Text style={styles.sectionTitle}>Select League</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.leagueScroll}>
          {leagues.map((league) => (
            <TouchableOpacity
              key={league.id}
              style={[
                styles.leagueCard,
                selectedLeague === league.id && styles.selectedLeagueCard
              ]}
              onPress={() => setSelectedLeague(league.id)}
            >
              <Text style={[
                styles.leagueName,
                selectedLeague === league.id && styles.selectedLeagueName
              ]}>
                {league.name}
              </Text>
              <Text style={styles.leagueDetails}>
                {league.memberCount || 1} member{league.memberCount !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Current Race Info */}
      {currentRace && (
        <View style={styles.raceInfoSection}>
          <Text style={styles.sectionTitle}>Current Race</Text>
          <View style={styles.raceCard}>
            <Text style={styles.raceName}>{currentRace.raceName}</Text>
            <Text style={styles.raceDate}>
              {new Date(currentRace.raceDate).toLocaleDateString()}
            </Text>
            <Text style={styles.raceStatus}>Status: {currentRace.status}</Text>
          </View>
        </View>
      )}

      {/* Current Pick Status */}
      {currentPick ? (
        <View style={styles.currentPickSection}>
          <Text style={styles.sectionTitle}>Your Current Pick</Text>
          <View style={styles.currentPickCard}>
            <Text style={styles.currentPickDriver}>{currentPick.driverName}</Text>
            <Text style={styles.currentPickTeam}>{currentPick.driverTeam}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.noPickSection}>
          <Text style={styles.sectionTitle}>No Pick Made Yet</Text>
          <Text style={styles.noPickText}>
            Select a driver below to make your P10 prediction for this week's race.
          </Text>
        </View>
      )}

      {/* Driver Selection */}
      <View style={styles.driversSection}>
        <Text style={styles.sectionTitle}>Select Your P10 Driver</Text>
        <ScrollView style={styles.driversList}>
          {drivers.map((driver) => (
            <TouchableOpacity
              key={driver.id}
              style={[
                styles.driverCard,
                selectedDriver === driver.id && styles.selectedDriverCard
              ]}
              onPress={() => {
                setSelectedDriver(driver.id);
                makePick(driver.id);
              }}
              disabled={submitting}
            >
              <View style={styles.driverInfo}>
                <Text style={styles.driverNumber}>#{driver.driverNumber}</Text>
                <View style={styles.driverDetails}>
                  <Text style={styles.driverName}>{driver.name}</Text>
                  <Text style={styles.driverTeam}>{driver.team}</Text>
                  <Text style={styles.driverCountry}>{driver.country}</Text>
                </View>
              </View>
              {selectedDriver === driver.id && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedIndicatorText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
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
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  currentPickCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  currentPickDriver: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  currentPickTeam: {
    fontSize: 14,
    color: '#666',
  },
  noPickSection: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noPickText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  driversGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  driverCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDriverCard: {
    backgroundColor: '#e91e63',
  },
  leagueSection: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leagueScroll: {
    paddingVertical: 5,
  },
  leagueCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    width: 150,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedLeagueCard: {
    backgroundColor: '#e0e0e0',
    borderColor: '#ccc',
  },
  leagueName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedLeagueName: {
    color: '#007bff',
  },
  leagueDetails: {
    fontSize: 12,
    color: '#666',
  },
  raceInfoSection: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  raceCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  raceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  raceDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  raceStatus: {
    fontSize: 14,
    color: '#007bff',
  },
  currentPickSection: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  driversSection: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  driversList: {
    // No specific styles needed for ScrollView, content will be handled by driverCards
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  driverDetails: {
    marginLeft: 10,
  },
  driverNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 10,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  driverTeam: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  driverCountry: {
    fontSize: 12,
    color: '#999',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4caf50',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  selectedIndicatorText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PicksScreen; 
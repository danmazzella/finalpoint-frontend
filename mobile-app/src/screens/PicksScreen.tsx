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
import { picksAPI, driversAPI } from '../services/apiService';

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
  isLocked: boolean;
  points: number;
}

const PicksScreen = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [driversResponse, picksResponse] = await Promise.all([
        driversAPI.getDrivers(),
        picksAPI.getUserPicks(1) // Assuming league ID 1 for now
      ]);

      if (driversResponse.data.success) {
        setDrivers(driversResponse.data.data);
      }

      if (picksResponse.data.success) {
        setPicks(picksResponse.data.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const makePick = async (driverId: number) => {
    try {
      const response = await picksAPI.makePick(1, currentWeek, driverId); // Assuming league ID 1
      if (response.data.success) {
        Alert.alert('Success', 'Pick submitted successfully!');
        setSelectedDriver(driverId);
        loadData(); // Refresh picks
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit pick. Please try again.');
    }
  };

  const getCurrentPick = () => {
    return picks.find(pick => pick.weekNumber === currentWeek);
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

      <ScrollView style={styles.content}>
        {currentPick ? (
          <View style={styles.currentPickCard}>
            <Text style={styles.currentPickTitle}>Your Current Pick</Text>
            <Text style={styles.currentPickDriver}>{currentPick.driverName}</Text>
            <Text style={styles.currentPickStatus}>
              {currentPick.isLocked ? 'Locked' : 'Can be changed'}
            </Text>
          </View>
        ) : (
          <View style={styles.noPickCard}>
            <Text style={styles.noPickText}>No pick made for Week {currentWeek}</Text>
            <Text style={styles.noPickSubtext}>Select a driver below to make your P10 prediction</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Your P10 Driver</Text>
          <Text style={styles.sectionSubtitle}>
            Choose which driver you think will finish in 10th place
          </Text>
        </View>

        <View style={styles.driversGrid}>
          {drivers.map((driver) => (
            <TouchableOpacity
              key={driver.id}
              style={[
                styles.driverCard,
                selectedDriver === driver.id && styles.selectedDriverCard,
                currentPick?.driverId === driver.id && styles.currentPickDriverCard,
              ]}
              onPress={() => {
                if (!currentPick?.isLocked) {
                  setSelectedDriver(driver.id);
                  makePick(driver.id);
                }
              }}
              disabled={currentPick?.isLocked}
            >
              <Text style={styles.driverNumber}>#{driver.driverNumber}</Text>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverTeam}>{driver.team}</Text>
              <Text style={styles.driverCountry}>{driver.country}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  currentPickTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  currentPickDriver: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  currentPickStatus: {
    fontSize: 12,
    color: '#666',
  },
  noPickCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  noPickText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e65100',
    marginBottom: 4,
  },
  noPickSubtext: {
    fontSize: 14,
    color: '#666',
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
    padding: 12,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDriverCard: {
    backgroundColor: '#e91e63',
  },
  currentPickDriverCard: {
    backgroundColor: '#4caf50',
  },
  driverNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  driverTeam: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  driverCountry: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
});

export default PicksScreen; 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Linking,
} from 'react-native';
import { leaguesAPI } from '../services/apiService';

interface League {
  id: number;
  name: string;
  ownerId: number;
  seasonYear: number;
  memberCount?: number;
  joinCode?: string;
  isMember?: boolean;
}

const LeaguesScreen = ({ navigation }: any) => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newLeagueName, setNewLeagueName] = useState('');

  useEffect(() => {
    loadLeagues();
  }, []);

  const loadLeagues = async () => {
    try {
      setLoading(true);
      const response = await leaguesAPI.getLeagues();
      if (response.data.success) {
        setLeagues(response.data.data);
      }
    } catch (error) {
      console.error('Error loading leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLeague = async () => {
    if (!newLeagueName.trim()) {
      Alert.alert('Error', 'Please enter a league name');
      return;
    }

    try {
      const response = await leaguesAPI.createLeague(newLeagueName.trim());
      if (response.data.success) {
        Alert.alert('Success', 'League created successfully!');
        setModalVisible(false);
        setNewLeagueName('');
        loadLeagues();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create league. Please try again.');
    }
  };

  const shareLeague = (league: League) => {
    if (league.joinCode) {
      const shareUrl = `https://yourapp.com/joinleague/${league.joinCode}`;
      Alert.alert(
        'Share League',
        `Share this link with friends to invite them to join ${league.name}:`,
        [
          {
            text: 'Copy Link', onPress: () => {
              // In a real app, you'd use Clipboard API
              Alert.alert('Link copied to clipboard!');
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const navigateToLeagueDetail = (league: League) => {
    // Navigate to league detail screen
    navigation.navigate('LeagueDetail', { leagueId: league.id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Leagues</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createButtonText}>Create League</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {leagues.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>You haven't joined any leagues yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Create a new league or join an existing one to start making P10 predictions!
            </Text>
          </View>
        ) : (
          leagues.map((league) => (
            <TouchableOpacity
              key={league.id}
              style={styles.leagueCard}
              onPress={() => navigateToLeagueDetail(league)}
            >
              <View style={styles.leagueInfo}>
                <Text style={styles.leagueName}>{league.name}</Text>
                <Text style={styles.leagueDetails}>
                  Season {league.seasonYear} • {league.memberCount || 1} member{league.memberCount !== 1 ? 's' : ''}
                </Text>
                {league.isMember ? (
                  <View style={styles.memberBadge}>
                    <Text style={styles.memberBadgeText}>Member</Text>
                  </View>
                ) : (
                  <View style={styles.joinBadge}>
                    <Text style={styles.joinBadgeText}>Join</Text>
                  </View>
                )}
              </View>
              <View style={styles.leagueActions}>
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={() => shareLeague(league)}
                >
                  <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Create League Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New League</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter league name"
              value={newLeagueName}
              onChangeText={setNewLeagueName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonCreate}
                onPress={createLeague}
              >
                <Text style={styles.modalButtonCreateText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#e91e63',
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 15,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  leagueCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leagueInfo: {
    flex: 1,
  },
  leagueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  leagueDetails: {
    fontSize: 14,
    color: '#666',
  },
  memberBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  memberBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  joinBadge: {
    backgroundColor: '#FF9800',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  joinBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  leagueActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    padding: 8,
    paddingHorizontal: 12,
  },
  shareButtonText: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonCreate: {
    flex: 1,
    backgroundColor: '#e91e63',
    borderRadius: 8,
    padding: 12,
    marginLeft: 10,
    alignItems: 'center',
  },
  modalButtonCreateText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LeaguesScreen; 
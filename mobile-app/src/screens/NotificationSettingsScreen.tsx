import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

interface NotificationPreferences {
    emailReminders: boolean;
    emailScoreUpdates: boolean;
    pushReminders: boolean;
    pushScoreUpdates: boolean;
}

const NotificationSettingsScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        emailReminders: true,
        emailScoreUpdates: true,
        pushReminders: true,
        pushScoreUpdates: true,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/preferences`, {
                headers: {
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setPreferences(data.data);
                }
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
            Alert.alert('Error', 'Failed to load notification preferences');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const savePreferences = async () => {
        setIsSaving(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                },
                body: JSON.stringify(preferences),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    Alert.alert('Success', 'Notification preferences updated successfully!');
                } else {
                    Alert.alert('Error', data.error || 'Failed to update preferences');
                }
            } else {
                Alert.alert('Error', 'Failed to update notification preferences');
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
            Alert.alert('Error', 'Failed to save notification preferences');
        } finally {
            setIsSaving(false);
        }
    };

    const testNotification = async (type: 'email' | 'push') => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                },
                body: JSON.stringify({ type }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    Alert.alert('Success', `Test ${type} notification sent successfully!`);
                } else {
                    Alert.alert('Error', data.error || `Failed to send test ${type} notification`);
                }
            } else {
                Alert.alert('Error', `Failed to send test ${type} notification`);
            }
        } catch (error) {
            console.error('Error sending test notification:', error);
            Alert.alert('Error', `Failed to send test ${type} notification`);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#e91e63" />
                <Text style={styles.loadingText}>Loading notification settings...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notification Settings</Text>
                <Text style={styles.headerSubtitle}>Manage your notification preferences</Text>
            </View>

            {/* Email Notifications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Email Notifications</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Race Reminders</Text>
                        <Text style={styles.settingDescription}>
                            Get reminded 5, 3, and 1 day before races if you haven't made picks
                        </Text>
                    </View>
                    <Switch
                        value={preferences.emailReminders}
                        onValueChange={(value) => handlePreferenceChange('emailReminders', value)}
                        trackColor={{ false: '#e0e0e0', true: '#e91e63' }}
                        thumbColor={preferences.emailReminders ? '#fff' : '#f4f3f4'}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Score Updates</Text>
                        <Text style={styles.settingDescription}>
                            Get notified when your scores are updated after races
                        </Text>
                    </View>
                    <Switch
                        value={preferences.emailScoreUpdates}
                        onValueChange={(value) => handlePreferenceChange('emailScoreUpdates', value)}
                        trackColor={{ false: '#e0e0e0', true: '#e91e63' }}
                        thumbColor={preferences.emailScoreUpdates ? '#fff' : '#f4f3f4'}
                    />
                </View>
            </View>

            {/* Push Notifications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Push Notifications</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Race Reminders</Text>
                        <Text style={styles.settingDescription}>
                            Get reminded 5, 3, and 1 day before races if you haven't made picks
                        </Text>
                    </View>
                    <Switch
                        value={preferences.pushReminders}
                        onValueChange={(value) => handlePreferenceChange('pushReminders', value)}
                        trackColor={{ false: '#e0e0e0', true: '#e91e63' }}
                        thumbColor={preferences.pushReminders ? '#fff' : '#f4f3f4'}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Score Updates</Text>
                        <Text style={styles.settingDescription}>
                            Get notified when your scores are updated after races
                        </Text>
                    </View>
                    <Switch
                        value={preferences.pushScoreUpdates}
                        onValueChange={(value) => handlePreferenceChange('pushScoreUpdates', value)}
                        trackColor={{ false: '#e0e0e0', true: '#e91e63' }}
                        thumbColor={preferences.pushScoreUpdates ? '#fff' : '#f4f3f4'}
                    />
                </View>
            </View>

            {/* Test Notifications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Test Notifications</Text>
                <Text style={styles.sectionDescription}>
                    Send test notifications to verify your settings are working correctly
                </Text>

                <View style={styles.testButtons}>
                    <TouchableOpacity
                        style={styles.testButton}
                        onPress={() => testNotification('email')}
                    >
                        <Text style={styles.testButtonText}>Test Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.testButton}
                        onPress={() => testNotification('push')}
                    >
                        <Text style={styles.testButtonText}>Test Push</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Save Button */}
            <View style={styles.saveSection}>
                <TouchableOpacity
                    style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                    onPress={savePreferences}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Preferences</Text>
                    )}
                </TouchableOpacity>
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
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    header: {
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        backgroundColor: 'white',
        marginTop: 20,
        padding: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    testButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    testButton: {
        flex: 1,
        backgroundColor: '#e91e63',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    testButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    saveSection: {
        padding: 20,
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#e91e63',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default NotificationSettingsScreen;

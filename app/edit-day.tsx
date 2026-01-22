import { useState, useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface Activities {
  reading: boolean;
  exercising: boolean;
  music: boolean;
}

export default function EditDayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();

  const [activities, setActivities] = useState<Activities>({
    reading: false,
    exercising: false,
    music: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadActivities = async () => {
    try {
      const value = await AsyncStorage.getItem(date);
      if (value !== null) {
        setActivities(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load the day's activities from AsyncStorage on mount
  useEffect(() => {
    loadActivities();
  }, [date]);

  const toggleActivity = async (activity: keyof Activities) => {
    try {
      const newActivities = {
        ...activities,
        [activity]: !activities[activity],
      };
      if (date) {
        await AsyncStorage.setItem(date, JSON.stringify(newActivities));
        setActivities(newActivities);
      }
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Edit Day' }} />
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  const isUnlocked = Object.values(activities).some(value => value);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: date || 'Edit Day' }} />

      <ThemedView style={styles.statusContainer}>
        <IconSymbol
          name={isUnlocked ? 'lock.open.fill' : 'lock.fill'}
          size={60}
          color={isUnlocked ? '#0a7ea4' : '#687076'}
        />
        <ThemedText type="title" style={styles.title}>
          {isUnlocked ? 'Unlocked' : 'Locked'}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, activities.reading && styles.buttonActive]}
          onPress={() => toggleActivity('reading')}
        >
          <IconSymbol
            name="book.fill"
            size={40}
            color={activities.reading ? '#fff' : '#0a7ea4'}
          />
          <ThemedText style={[styles.buttonLabel, activities.reading && styles.buttonLabelActive]}>
            Reading
          </ThemedText>
        </Pressable>

        <Pressable
          style={[styles.button, activities.exercising && styles.buttonActive]}
          onPress={() => toggleActivity('exercising')}
        >
          <IconSymbol
            name="figure.run"
            size={40}
            color={activities.exercising ? '#fff' : '#0a7ea4'}
          />
          <ThemedText style={[styles.buttonLabel, activities.exercising && styles.buttonLabelActive]}>
            Exercise
          </ThemedText>
        </Pressable>

        <Pressable
          style={[styles.button, activities.music && styles.buttonActive]}
          onPress={() => toggleActivity('music')}
        >
          <IconSymbol
            name="music.note"
            size={40}
            color={activities.music ? '#fff' : '#0a7ea4'}
          />
          <ThemedText style={[styles.buttonLabel, activities.music && styles.buttonLabelActive]}>
            Music
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusContainer: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 60,
  },
  title: {
    marginBottom: 0,
  },
  buttonContainer: {
    gap: 20,
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#0a7ea4',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  buttonActive: {
    backgroundColor: '#0a7ea4',
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
  buttonLabelActive: {
    color: '#fff',
  },
});

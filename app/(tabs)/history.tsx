import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface Activities {
  reading: boolean;
  exercising: boolean;
  music: boolean;
}

interface DayData {
  date: string;
  activities: Activities;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadHistory = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      // Filter for date keys (YYYY-MM-DD format)
      const dateKeys = keys.filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key));

      const historyData: DayData[] = [];
      for (const key of dateKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          historyData.push({
            date: key,
            activities: JSON.parse(value),
          });
        }
      }

      // Sort by date descending (newest first)
      historyData.sort((a, b) => b.date.localeCompare(a.date));
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reload history when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDayPress = (date: string) => {
    router.push(`/edit-day?date=${date}`);
  };

  const renderDay = ({ item }: { item: DayData }) => {
    const { reading, exercising, music } = item.activities;
    const hasAnyActivity = reading || exercising || music;

    return (
      <Pressable
        style={styles.dayRow}
        onPress={() => handleDayPress(item.date)}
      >
        <ThemedView style={styles.dayRowContent}>
          <ThemedView style={styles.dateContainer}>
            <IconSymbol
              name={hasAnyActivity ? 'lock.open.fill' : 'lock.fill'}
              size={24}
              color={hasAnyActivity ? '#0a7ea4' : '#687076'}
            />
            <ThemedText type="defaultSemiBold" style={styles.dateText}>
              {item.date}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.activitiesContainer}>
            <IconSymbol
              name="book.fill"
              size={20}
              color={reading ? '#0a7ea4' : '#d0d0d0'}
            />
            <IconSymbol
              name="figure.run"
              size={20}
              color={exercising ? '#0a7ea4' : '#d0d0d0'}
            />
            <IconSymbol
              name="music.note"
              size={20}
              color={music ? '#0a7ea4' : '#d0d0d0'}
            />
          </ThemedView>
        </ThemedView>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>History</ThemedText>

      {history.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No history yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Complete activities to start tracking your progress
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={history}
          renderItem={renderDay}
          keyExtractor={item => item.date}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 12,
  },
  dayRow: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  dayRowContent: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontSize: 16,
  },
  activitiesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});

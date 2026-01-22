import { useState, useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const STORAGE_KEY = '@counter_value';

export default function HomeScreen() {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load the counter value from AsyncStorage on mount
  useEffect(() => {
    loadCounter();
  }, []);

  const loadCounter = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) {
        setCount(parseInt(value, 10));
      }
    } catch (error) {
      console.error('Error loading counter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCounter = async (newValue: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newValue.toString());
      setCount(newValue);
    } catch (error) {
      console.error('Error saving counter:', error);
    }
  };

  const increment = () => {
    saveCounter(count + 1);
  };

  const decrement = () => {
    saveCounter(count - 1);
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
      <ThemedText type="title" style={styles.title}>Counter</ThemedText>

      <ThemedView style={styles.counterContainer}>
        <ThemedText style={styles.counterText}>{count}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={decrement}>
          <ThemedText style={styles.buttonText}>-</ThemedText>
        </Pressable>

        <Pressable style={styles.button} onPress={increment}>
          <ThemedText style={styles.buttonText}>+</ThemedText>
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
  title: {
    marginBottom: 40,
  },
  counterContainer: {
    marginBottom: 40,
  },
  counterText: {
    fontSize: 72,
    fontWeight: 'bold',
    lineHeight: 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: '#0a7ea4',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 48,
  },
});

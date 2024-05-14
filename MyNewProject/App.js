import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Card from './src/assets/components/tinderCard';
import users from './TinderAssets/assets/data/users';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  const frontCardStyle = useAnimatedStyle(() => {
    const rotation = `${translateX.value / 10}deg`; // Card rotation based on swipe
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: rotation }
      ],
    };
  });

  const backCardStyle = useAnimatedStyle(() => {
    // Scale the next card based on the front card's movement
    let normalizedTranslateX = Math.min(Math.abs(translateX.value) / Dimensions.get('window').width, 1);
    let scale = 0.8 + 0.2 * normalizedTranslateX; // Start at 80% scale and grow to 100%
    return {
      transform: [{ scale }]
    };
  });

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) < 100) { // Threshold to snap back
        translateX.value = withSpring(0);
      } else {
        // Add logic to handle card removal or transition
        translateX.value = withSpring(Dimensions.get('window').width * Math.sign(event.translationX));
      }
    });

  return (
    <GestureHandlerRootView style={styles.pageContainer}>
      <Animated.View style={[styles.cardContainer, backCardStyle]}>
        <Card user={users[(currentIndex + 1) % users.length]} /> {/* Cycle through users for the back card */}
      </Animated.View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.cardContainer, frontCardStyle]}>
          <Card user={users[currentIndex]} /> {/* Display the front card */}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Light grey background
  },
  cardContainer: {
    width: '95%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Overlay cards
  }
});

export default App;


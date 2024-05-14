import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';
import Card from './src/assets/components';
import users from './src/assets/data/users';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);


  const currentProfile = users[currentIndex];
  const nextProfile = users[currentIndex + 1]

 
const {width: screenWidth} = useWindowDimensions();
const hiddenTranslateX = 2 * screenWidth


const cardStyle = useAnimatedStyle(() => {
  const rotation = `${translateX.value / 10}deg`;
  return {
    transform: [
      { translateX: translateX.value },
      { rotate: rotation }, // -60deg 0deg 60deg
    ],
  };
});

const nextCardStyle = useAnimatedStyle(() => {
  let normalizedTranslateX = Math.min(Math.abs(translateX.value) / 300, 1);
  let cardScale = 0.8 + 0.2 * normalizedTranslateX;
  return {
    transform: [{ scale: cardScale }],
  };
});

  const gesture = Gesture.Pan()
  .onUpdate((event) => {
    translateX.value = event.translationX;
  })
  .onEnd((event) => {
    if (Math.abs(event.velocityX) < 800 && Math.abs(event.translationX) < 145) {
      translateX.value = withSpring(0);
      return;
    }
    // Make card dissolve
    if (translateX.value > 0) {
      translateX.value = withSpring(hiddenTranslateX);
    } else {
      translateX.value = withSpring(-hiddenTranslateX);
      
    }
  });

  return (
    <GestureHandlerRootView style={styles.pageContainer}>
    <View style={styles.nextCardContainer}>
      <Animated.View style={[styles.animatedCard, nextCardStyle]}>
        <Card user={nextProfile} />
      </Animated.View>
    </View>
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.animatedCard, cardStyle]}>
        <Card user={currentProfile} />
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
  animatedCard: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Overlay cards
  },
  nextCardContainer:{
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',

  }
});

export default App;


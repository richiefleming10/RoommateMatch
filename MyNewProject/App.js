import { useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useEffect } from 'react';

const App = () =>{
  const hiddenTranslateX = 500; // Adjust based on your hidden position
  const currentIndex = useSharedValue(0);
  const translateX = useSharedValue(0);
  const setNextIndex = (index) => {
    // Your logic to set the next index
  };
  const setCurrentIndex = (index) => {
    currentIndex.value = index;
  };

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
        runOnJS(setCurrentIndex)(currentIndex.value + 1);
      }
    });

  useEffect(() => {
    console.log('currentIndex changed:', currentIndex.value);
    translateX.value = 0;
    setNextIndex(currentIndex.value + 1);
  }, [currentIndex.value]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[{ transform: [{ translateX: translateX.value }] }]}>
        {/* Your card content */}
      </Animated.View>
    </GestureDetector>
  );
};
  const styles = StyleSheet.create({
    pageContainer: {
      justifyContent: 'center',
      alignItems : 'center',
      flex: 1},
    animatedCard: {
      width: '100%',
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    nextCardContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    
    
    }
  });


  export default App;
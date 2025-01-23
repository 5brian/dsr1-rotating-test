import { Animated, View, StyleSheet, Easing } from "react-native";
import { useEffect, useRef } from "react";

export default function Index() {
  // Rotation animation for the square
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Ball position and velocity
  const ballPosition = useRef(new Animated.ValueXY({ x: 150, y: 150 })).current;
  const velocity = useRef({ x: 250, y: 400 });
  const lastUpdate = useRef(Date.now());
  const ballRadius = 20;
  const boundarySize = 300;

  // Track position using a ref and listener
  const positionRef = useRef({ x: 150, y: 150 });

  useEffect(() => {
    const listenerId = ballPosition.addListener((value) => {
      positionRef.current = value;
    });
    return () => ballPosition.removeListener(listenerId);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  // Ball movement effect
  useEffect(() => {
    const moveBall = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdate.current;
      lastUpdate.current = now;

      const deltaSeconds = deltaTime / 1000;
      const currentX = positionRef.current.x;
      const currentY = positionRef.current.y;

      let newX = currentX + velocity.current.x * deltaSeconds;
      let newY = currentY + velocity.current.y * deltaSeconds;

      // Horizontal collision
      if (newX < ballRadius || newX > boundarySize - ballRadius) {
        velocity.current.x *= -1;
        newX = newX < ballRadius ? ballRadius : boundarySize - ballRadius;
      }

      // Vertical collision
      if (newY < ballRadius || newY > boundarySize - ballRadius) {
        velocity.current.y *= -1;
        newY = newY < ballRadius ? ballRadius : boundarySize - ballRadius;
      }

      ballPosition.setValue({ x: newX, y: newY });
      requestAnimationFrame(moveBall);
    };

    moveBall();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.square,
          {
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.boundary}>
          <Animated.View
            style={[
              styles.ball,
              {
                transform: [
                  { translateX: ballPosition.x },
                  { translateY: ballPosition.y },
                ],
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  square: {
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: "#000",
  },
  boundary: {
    width: 300,
    height: 300,
    overflow: "hidden",
    position: "relative",
  },
  ball: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "yellow",
    position: "absolute",
    left: -20, // Center the ball relative to its position
    top: -20,
  },
});

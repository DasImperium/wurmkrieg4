/**
 * Wurm Krieg 3 - Game Loop Hook
 * 
 * This hook provides a game loop for smooth animations and updates.
 * 
 * @author DasImperium
 * @version 1.0.0
 */

import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing a game loop
 * 
 * @param {Function} updateFunction - Function to call on each frame
 * @param {boolean} active - Whether the game loop is active
 * @param {number} targetFPS - Target frames per second (default: 60)
 * @returns {Object} Game loop controls
 */
export const useGameLoop = (updateFunction, active = true, targetFPS = 60) => {
  const loopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const accumulatedTimeRef = useRef(0);
  const targetFrameTime = 1000 / targetFPS;
  
  /**
   * Game loop function
   */
  const gameLoop = useCallback((timestamp) => {
    if (!active) {
      loopRef.current = null;
      return;
    }
    
    // Calculate time since last frame
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    // Accumulate time for fixed timestep
    accumulatedTimeRef.current += deltaTime;
    
    // Execute update function with fixed timestep
    while (accumulatedTimeRef.current >= targetFrameTime) {
      updateFunction(targetFrameTime);
      accumulatedTimeRef.current -= targetFrameTime;
    }
    
    // Continue the loop
    loopRef.current = requestAnimationFrame(gameLoop);
  }, [updateFunction, active, targetFPS]);
  
  /**
   * Start the game loop
   */
  const start = useCallback(() => {
    if (loopRef.current) {
      // Already running
      return;
    }
    
    lastTimeRef.current = performance.now();
    accumulatedTimeRef.current = 0;
    loopRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);
  
  /**
   * Stop the game loop
   */
  const stop = useCallback(() => {
    if (loopRef.current) {
      cancelAnimationFrame(loopRef.current);
      loopRef.current = null;
    }
  }, []);
  
  /**
   * Toggle the game loop
   */
  const toggle = useCallback(() => {
    if (loopRef.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);
  
  return {
    start,
    stop,
    toggle,
    isRunning: loopRef.current !== null,
  };
};

/**
 * Custom hook for managing animations
 * 
 * @param {number} duration - Animation duration in milliseconds
 * @param {Function} onComplete - Callback when animation completes
 * @returns {Object} Animation controls
 */
export const useAnimation = (duration = 1000, onComplete = null) => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(0);
  
  /**
   * Start animation
   */
  const start = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setProgress(0);
    startTimeRef.current = performance.now();
    
    const animate = (timestamp) => {
      const elapsed = timestamp - startTimeRef.current;
      const newProgress = Math.min(elapsed / duration, 1);
      
      setProgress(newProgress);
      
      if (newProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [duration, isAnimating, onComplete]);
  
  /**
   * Stop animation
   */
  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);
  
  return {
    isAnimating,
    progress,
    start,
    stop,
  };
};

export default {
  useGameLoop,
  useAnimation,
};

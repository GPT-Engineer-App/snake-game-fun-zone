import { Box, Container, useToast } from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { FaArrowRight, FaArrowLeft, FaArrowUp, FaArrowDown } from "react-icons/fa";

const gridSize = 20;
const gridCount = 15;

const getRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * gridCount),
    y: Math.floor(Math.random() * gridCount),
  };
};

const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const Index = () => {
  const [snake, setSnake] = useState([{ x: 8, y: 8 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState({ x: 0, y: 1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [bgColor, setBgColor] = useState("gray.200");
  const toast = useToast();

  const handleKeyDown = useCallback((event) => {
    if (directions[event.key]) {
      setDirection(directions[event.key]);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isGameOver) {
      toast({
        title: "Game Over",
        description: `You reached level ${level}!`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        let head = { ...newSnake[newSnake.length - 1] };
        head.x += direction.x;
        head.y += direction.y;

        // Check wall collision
        if (head.x >= gridCount || head.x < 0 || head.y >= gridCount || head.y < 0) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        newSnake.push(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomPosition());
          setLevel((prevLevel) => prevLevel + 1);
          setBgColor(`hsl(${Math.random() * 360}, 70%, 80%)`);
        } else {
          newSnake.shift();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 200 - (level * 5 > 150 ? 150 : level * 5));
    return () => clearInterval(interval);
  }, [direction, food, isGameOver, level]);

  return (
    <Container maxW="container.md" height="100vh" centerContent>
      <Box width={`${gridSize * gridCount}px`} height={`${gridSize * gridCount}px`} bg={bgColor} position="relative">
        {snake.map((segment, index) => (
          <Box key={index} position="absolute" top={`${segment.y * gridSize}px`} left={`${segment.x * gridSize}px`} width={`${gridSize}px`} height={`${gridSize}px`} bg="green.500" />
        ))}
        <Box position="absolute" top={`${food.y * gridSize}px`} left={`${food.x * gridSize}px`} width={`${gridSize}px`} height={`${gridSize}px`} bg="red.500" />
      </Box>
    </Container>
  );
};

export default Index;

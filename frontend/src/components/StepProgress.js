import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Circle,
  Divider,
  useColorModeValue,
  keyframes,
  useToken,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

const pulse = keyframes`
  0% { transform: scale(0.95); }
  50% { transform: scale(1.05); }
  100% { transform: scale(0.95); }
`;

const StepProgress = ({ 
  steps, 
  currentStep, 
  isLoading = false,
  error = null 
}) => {
  const activeColor = useColorModeValue('brand.500', 'brand.300');
  const completedColor = useColorModeValue('green.500', 'green.300');
  const errorColor = useColorModeValue('red.500', 'red.300');
  const inactiveColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [brand500] = useToken('colors', ['brand.500']);

  const getStepStatus = (index) => {
    if (error && index === currentStep) return 'error';
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'inactive';
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed': return completedColor;
      case 'active': return activeColor;
      case 'error': return errorColor;
      default: return inactiveColor;
    }
  };

  const getStepAnimation = (status) => {
    if (status === 'active' && isLoading) {
      return `${pulse} 2s ease-in-out infinite`;
    }
    return 'none';
  };

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      width="100%"
    >
      <HStack spacing={0} align="center" width="100%">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const stepColor = getStepColor(status);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <VStack spacing={2} flex={isLast ? 'none' : 1}>
                <Circle
                  size="40px"
                  bg={status === 'inactive' ? 'transparent' : stepColor}
                  borderWidth={status === 'inactive' ? '2px' : '0'}
                  borderColor={inactiveColor}
                  color={status === 'inactive' ? textColor : 'white'}
                  animation={getStepAnimation(status)}
                  position="relative"
                  transition="all 0.2s"
                >
                  {status === 'completed' ? (
                    <CheckIcon />
                  ) : (
                    <Text fontWeight="bold">{index + 1}</Text>
                  )}
                  
                  {/* Pulse Effect */}
                  {status === 'active' && isLoading && (
                    <Circle
                      position="absolute"
                      top="-4px"
                      left="-4px"
                      right="-4px"
                      bottom="-4px"
                      bg={`${brand500}20`}
                      animation={`${pulse} 2s ease-in-out infinite`}
                    />
                  )}
                </Circle>
                
                <VStack spacing={0} maxW="120px">
                  <Text
                    fontSize="sm"
                    fontWeight={status === 'active' ? 'bold' : 'medium'}
                    color={status === 'active' ? activeColor : textColor}
                    textAlign="center"
                  >
                    {step.title}
                  </Text>
                  {(status === 'active' || status === 'error') && step.description && (
                    <Text
                      fontSize="xs"
                      color={status === 'error' ? errorColor : 'gray.500'}
                      textAlign="center"
                    >
                      {status === 'error' ? error : step.description}
                    </Text>
                  )}
                </VStack>
              </VStack>
              
              {!isLast && (
                <Divider
                  flex={1}
                  borderColor={index < currentStep ? completedColor : inactiveColor}
                  borderWidth={index < currentStep ? '2px' : '1px'}
                  transition="all 0.2s"
                />
              )}
            </React.Fragment>
          );
        })}
      </HStack>
    </Box>
  );
};

export default StepProgress;

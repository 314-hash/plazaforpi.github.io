import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  VStack,
  Text,
  useColorModeValue,
  Box,
} from '@chakra-ui/react';
import StepProgress from './StepProgress';

const getDefaultSteps = (type) => {
  switch (type) {
    case 'listing':
      return [
        { title: 'Approval', description: 'Approve marketplace contract' },
        { title: 'Upload', description: 'Upload item metadata to IPFS' },
        { title: 'Listing', description: 'Create marketplace listing' },
        { title: 'Confirmation', description: 'Waiting for confirmation' },
      ];
    case 'purchase':
      return [
        { title: 'Approval', description: 'Approve payment token' },
        { title: 'Purchase', description: 'Submit purchase transaction' },
        { title: 'Transfer', description: 'Transfer item ownership' },
        { title: 'Confirmation', description: 'Waiting for confirmation' },
      ];
    case 'auction':
      return [
        { title: 'Approval', description: 'Approve bid amount' },
        { title: 'Bidding', description: 'Place your bid' },
        { title: 'Verification', description: 'Verify bid placement' },
        { title: 'Confirmation', description: 'Waiting for confirmation' },
      ];
    default:
      return [];
  }
};

const TransactionProgress = ({
  isOpen,
  type = 'listing',
  currentStep = 0,
  isLoading = false,
  error = null,
  customSteps = null,
  message = '',
}) => {
  const steps = customSteps || getDefaultSteps(type);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Modal
      isOpen={isOpen}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size="xl"
      isCentered
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px)"
      />
      <ModalContent
        bg={bgColor}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        mx={4}
      >
        <ModalBody p={6}>
          <VStack spacing={6}>
            <StepProgress
              steps={steps}
              currentStep={currentStep}
              isLoading={isLoading}
              error={error}
            />
            
            {message && (
              <Box
                p={4}
                bg={useColorModeValue('white', 'gray.800')}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                width="100%"
              >
                <Text
                  fontSize="sm"
                  color={useColorModeValue('gray.600', 'gray.300')}
                  textAlign="center"
                >
                  {message}
                </Text>
              </Box>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TransactionProgress;

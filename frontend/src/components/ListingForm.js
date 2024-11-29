import React, { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Button,
  useToast,
  Select,
} from '@chakra-ui/react';
import { useTransactionProgress } from '../hooks/useTransactionProgress';
import TransactionProgress from './TransactionProgress';

const ListingForm = ({ onSubmit, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });

  const toast = useToast();
  const progress = useTransactionProgress('listing');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handlePriceChange = (value) => {
    setFormData(prev => ({ ...prev, price: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      progress.start();

      // Step 1: Contract Approval
      progress.updateMessage('Requesting contract approval...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate contract approval
      progress.nextStep('Contract approved successfully!');

      // Step 2: Upload to IPFS
      progress.updateMessage('Uploading image to IPFS...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate IPFS upload
      progress.nextStep('Image uploaded to IPFS!');

      // Step 3: Create Listing
      progress.updateMessage('Creating marketplace listing...');
      await onSubmit(formData);
      progress.nextStep('Listing created successfully!');

      // Step 4: Confirmation
      progress.updateMessage('Waiting for blockchain confirmation...');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate confirmation
      progress.complete('Your item has been listed successfully!');

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        image: null,
      });

      toast({
        title: 'Success!',
        description: 'Your item has been listed on the marketplace.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      progress.fail(error.message);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        as="form"
        onSubmit={handleSubmit}
        p={6}
        bg="white"
        borderRadius="xl"
        shadow="sm"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter item title"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your item"
              rows={4}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Price (π)</FormLabel>
            <NumberInput
              value={formData.price}
              onChange={handlePriceChange}
              min={0}
            >
              <NumberInputField placeholder="Enter price in Pi" />
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Select category"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              p={1}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            isDisabled={!formData.title || !formData.price || !formData.image}
          >
            List Item
          </Button>
        </VStack>
      </Box>

      <TransactionProgress
        isOpen={progress.isOpen}
        type={progress.type}
        currentStep={progress.currentStep}
        isLoading={progress.isLoading}
        error={progress.error}
        message={progress.message}
      />
    </>
  );
};

export default ListingForm;

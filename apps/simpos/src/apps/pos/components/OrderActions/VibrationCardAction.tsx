import React from 'react';

import {
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Button,
  Portal,
  Flex,
  Grid,
  useDisclosure,
} from '@chakra-ui/react';
import { IconTag } from '../../../../components/icons';
import {
  useOrderManagerAction,
  useOrderManagerState,
} from '../../../../contexts/OrderManager';

export const VibrationCardAction: React.FunctionComponent = () => {
  const { activeOrder } = useOrderManagerState();
  const { selectVibrationCardNo } = useOrderManagerAction();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const onSelect = (no?: string) => {
    selectVibrationCardNo(no);
    onClose();
  };
  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Box
          width="120px"
          height="66px"
          as={Button}
          backgroundColor="brand.500"
          color="brand.100"
          borderRadius="md"
          display="flex"
          flexDirection="column"
          p={2}
          alignItems="center"
        >
          <Flex h="33px" alignItems="center" justifyContent="center">
            {activeOrder?.order.vibrationCardNo ? (
              <Box
                backgroundColor="brand.100"
                color="white"
                w="28px"
                h="28px"
                lineHeight="28px"
                borderRadius="14px"
              >
                {activeOrder.order.vibrationCardNo}
              </Box>
            ) : (
              <IconTag size="20" />
            )}
          </Flex>
          <Text fontSize="sm">Vibr tag</Text>
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Select vibration tag</PopoverHeader>
          <PopoverBody>
            <Grid templateColumns="1fr 1fr 1fr" gridGap={2}>
              {Array.from({ length: 12 }, (_, i) => (
                <Button key={i} onClick={() => onSelect(String(i + 1))}>
                  {i + 1}
                </Button>
              ))}
              {activeOrder?.order.vibrationCardNo && (
                <Button
                  gridColumnStart="1"
                  gridColumnEnd="span 3"
                  colorScheme="red"
                  onClick={() => onSelect(undefined)}
                >
                  Unselect vibration tag
                </Button>
              )}
            </Grid>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

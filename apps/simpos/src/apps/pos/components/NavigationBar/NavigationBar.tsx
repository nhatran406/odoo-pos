import React from 'react';
import {
  Flex,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IconBars } from '../../../../components/icons';
import { OrderTab, OrderTabAdd } from '../OrderTab';
import {
  useOrderManagerAction,
  useOrderManagerState,
} from '../../../../contexts/OrderManager';
import { DrawerNavigation } from '../../../../components/DrawerNavigation';
import { useAuth } from '../../../../contexts/AuthProvider';

const StyledSwiper = styled(Swiper)`
  margin-left: 0;
  margin-right: 0;
`;

export const NavigationBar: React.FunctionComponent = () => {
  const state = useOrderManagerState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef: any = React.useRef();
  const { addNewOrder, selectOrder, deleteOrder } = useOrderManagerAction();
  const { userMeta } = useAuth();

  const isStaging = userMeta?.dbName.includes('staging');

  return (
    <>
      <Flex align="center" px={4} py={2}>
        <Button
          ref={btnRef}
          onClick={onOpen}
          colorScheme={isStaging ? 'yellow' : ''}
        >
          <IconBars size="20" color="#1FB886" />
        </Button>
        <Flex flex="1" overflow="hidden" px={2} justifyContent="flex-start">
          <StyledSwiper spaceBetween={8} slidesPerView="auto">
            {state.orders.map((order) => (
              <SwiperSlide key={order.id} style={{ width: 'auto' }}>
                <OrderTab
                  order={order}
                  active={state.activeOrderId === order.id}
                  onSelectOrder={() => selectOrder(order)}
                  onDeleteOrder={() => deleteOrder(order)}
                />
              </SwiperSlide>
            ))}
          </StyledSwiper>
          <OrderTabAdd onClick={addNewOrder} />
        </Flex>
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerNavigation />
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

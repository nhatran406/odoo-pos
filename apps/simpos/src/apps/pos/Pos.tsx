import { useEffect } from 'react';
import { Grid, Box, Flex, useToast } from '@chakra-ui/react';
import { NavigationBar } from './components/NavigationBar';
import { CategoryPanel } from './components/CategoryPanel';
import { SearchPanel } from './components/SearchPanel';
import { SearchProductProvider } from '../../contexts/SearchProduct';
import { ProductsGrid } from './components/ProductsGrid';
import {
  useOrderManagerAction,
  useOrderManagerState,
} from '../../contexts/OrderManager';
import { PosSidebar } from './components/PosSidebar';
import { productVariantRepository } from '../../services/db';

export const Pos: React.FunctionComponent = () => {
  const { activeOrder } = useOrderManagerState();
  const toast = useToast();
  const { addProductVariantToCart } = useOrderManagerAction();

  useEffect(() => {
    const onBarcodeScanned = async (e: Event) => {
      if ((e as CustomEvent).detail.scanCode) {
        if (!activeOrder) {
          return toast({
            title: 'Error',
            description: 'Order is not found',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
        const productVariant = await productVariantRepository.findByBarcode(
          (e as CustomEvent).detail.scanCode,
        );

        if (!productVariant) {
          return toast({
            title: 'Error',
            description: 'Product not found or barcode is not set up',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
        await addProductVariantToCart(productVariant);
      }
    };
    document.addEventListener('scan', onBarcodeScanned);
    return () => {
      document.removeEventListener('scan', onBarcodeScanned);
    };
  }, [activeOrder]);
  return (
    <SearchProductProvider>
      <Grid templateColumns="2fr 1fr" h="100vh">
        <Flex overflow="hidden" flexDir="column">
          <NavigationBar />
          <CategoryPanel />
          <SearchPanel />
          <Box flex={1} overflowY="auto" px={4}>
            <ProductsGrid />
          </Box>
        </Flex>
        <Flex overflow="hidden" bg="gray.50" flexDir="column">
          {activeOrder && <PosSidebar activeOrder={activeOrder} />}
        </Flex>
      </Grid>
    </SearchProductProvider>
  );
};

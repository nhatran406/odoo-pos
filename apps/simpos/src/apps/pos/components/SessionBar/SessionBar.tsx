import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  Image,
  BoxProps,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import React, { useCallback, useEffect, useState } from 'react';
import { IconSync, IconWifiSlash } from '../../../../components/icons';

import { IconBell } from '../../../../components/icons/output/IconBell';
import { IconWifi } from '../../../../components/icons/output/IconWifi';
import {
  useData,
  useGlobalDataDispatch,
} from '../../../../contexts/DataProvider';
import { usePreference } from '../../../../contexts/PreferenceProvider';
import { Employee, employeeRepository } from '../../../../services/db/employee';
import { EmployeeRow } from './EmployeeRow';

const IconWrapper = styled(Flex)`
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
`;

export interface SessionBarProps extends BoxProps {}

export const SessionBar: React.FunctionComponent<SessionBarProps> = ({
  ...boxProps
}) => {
  const { isOnline } = usePreference();
  const [showChangeCashiser, setShowChangeCashiser] = useState(false);
  const [selectEmployee, setSelectEmployee] = useState<Employee>();
  const { cashier, posConfig, company } = useData();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const globalDataDispatch = useGlobalDataDispatch();
  const changeCashier = useCallback(() => {
    if (posConfig.modulePosHr) {
      setShowChangeCashiser(true);
    }
  }, [posConfig.modulePosHr]);

  const onCloseChangeCashiser = () => {};

  useEffect(() => {
    if (!cashier && !showChangeCashiser) {
      setShowChangeCashiser(true);
    }
  }, [cashier, setShowChangeCashiser, showChangeCashiser]);

  useEffect(() => {
    const getEmployees = async () => {
      const dataEmployees = await employeeRepository.findByIds(
        posConfig.employeeIds,
      );
      setEmployees(dataEmployees);
    };
    getEmployees();
  }, [posConfig.modulePosHr, posConfig.employeeIds]);

  const selectCashier = () => {
    globalDataDispatch({
      type: 'UPDATE_DATA',
      payload: {
        cashier: selectEmployee,
      },
    });
    setShowChangeCashiser(false);
  };

  return (
    <>
      <Flex {...boxProps}>
        <Box>
          {company.logo ? (
            <Image
              height="40px"
              borderRadius="md"
              src={`data:image/jpeg;base64,${company.logo}`}
            />
          ) : (
            <Image
              width="40px"
              height="40px"
              borderRadius="md"
              src="/logo.svg"
            />
          )}
        </Box>
        <Stack direction="row" spacing={2} alignItems="center" ml="auto">
          <IconWrapper>
            {isOnline ? (
              <IconWifi size="24" color="#48BB78" />
            ) : (
              <IconWifiSlash color="#E53E3E" size="24" />
            )}
          </IconWrapper>
          <IconWrapper>
            <IconBell size="24" />
          </IconWrapper>
          <Stack
            as={posConfig.modulePosHr ? 'button' : 'div'}
            direction="row"
            alignItems="center"
            spacing={2}
            onClick={changeCashier}
          >
            {cashier && (
              <Box textAlign="left">
                <Text fontSize="sm">Cashier</Text>
                <Heading size="sm" color="brand.100">
                  {cashier.name}
                </Heading>
              </Box>
            )}

            {posConfig.modulePosHr && <IconSync size="1.5rem" />}
          </Stack>
        </Stack>
      </Flex>
      <Modal
        isOpen={showChangeCashiser}
        onClose={onCloseChangeCashiser}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select cashier</ModalHeader>
          <ModalBody>
            <Stack spacing={2}>
              {employees.map((employee) => (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  checked={selectEmployee?.id === employee.id}
                  onClick={() => setSelectEmployee(employee)}
                />
              ))}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              disabled={!selectEmployee}
              onClick={selectCashier}
            >
              Select
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

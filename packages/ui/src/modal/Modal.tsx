import type {
  ModalProps as _ModalProps} from '@chakra-ui/react';
import {
  Divider,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Modal as _Modal
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

type ModalProps = {
  title: string;
  actions: ReactNode;
  children: ReactNode;
} & _ModalProps;

export const Modal = (props: ModalProps) => {
  return (
    <_Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent mx={2}>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody>{props.children}</ModalBody>
        <Divider />
        <ModalFooter>{props.actions}</ModalFooter>
      </ModalContent>
    </_Modal>
  );
};

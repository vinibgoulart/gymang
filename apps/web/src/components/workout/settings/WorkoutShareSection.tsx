import {
  Button,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Section } from '@gymang/ui';
import { copyToClipboard } from '@gymang/utils';
import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import { LuCopyCheck } from 'react-icons/lu';
import { graphql, useFragment } from 'react-relay';
import {
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import { useDebouncedCallback } from 'use-debounce';

import type { WorkoutShareSection_workout$key } from '../../../../__generated__/WorkoutShareSection_workout.graphql';

type WorkoutShareSectionProps = {
  workout: WorkoutShareSection_workout$key;
};

export const WorkoutShareSection = (props: WorkoutShareSectionProps) => {
  const debounceTime = 5000;
  const [isCopied, setIsCopied] = useState(false);
  const toast = useToast();

  const workout = useFragment<WorkoutShareSection_workout$key>(
    graphql`
      fragment WorkoutShareSection_workout on Workout {
        id
      }
    `,
    props.workout,
  );

  const clearCopied = useDebouncedCallback(() => {
    setIsCopied(false);
  }, debounceTime);

  const getUrl = () => {
    return `${window.location.origin}/workout/${workout.id}`;
  };

  const handleCopy = async () => {
    await copyToClipboard(getUrl());

    setIsCopied(true);

    toast({
      title: 'Link copiado com sucesso',
      status: 'success',
      duration: debounceTime,
      isClosable: true,
      position: 'bottom-right',
    });

    clearCopied();
  };

  return (
    <Section title="Compartilhar">
      <Text>
        Clique para copiar o link do seu treino e compartilhar com seus amigos!
      </Text>
      <InputGroup onClick={handleCopy}>
        <Input value={getUrl()} isReadOnly />
        <InputRightElement>
          <Button variant={'ghost'} onClick={handleCopy}>
            {isCopied ? <Icon as={LuCopyCheck} /> : <Icon as={FiCopy} />}
          </Button>
        </InputRightElement>
      </InputGroup>
      <HStack>
        <Text>Compartilhar em: </Text>
        <HStack>
          <FacebookShareButton url={getUrl()}>
            <Icon as={FacebookIcon} round w={6} h={6} />
          </FacebookShareButton>
          <TwitterShareButton url={getUrl()}>
            <Icon as={TwitterIcon} round w={6} h={6} />
          </TwitterShareButton>
          <WhatsappShareButton url={getUrl()}>
            <Icon as={WhatsappIcon} round w={6} h={6} />
          </WhatsappShareButton>
          <TelegramShareButton url={getUrl()}>
            <Icon as={TelegramIcon} round w={6} h={6} />
          </TelegramShareButton>
        </HStack>
      </HStack>
    </Section>
  );
};

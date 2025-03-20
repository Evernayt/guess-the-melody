import { Flex, IconButton, Tooltip } from '@chakra-ui/react';
import {
  IconCrown,
  IconRosetteNumber1,
  IconRosetteNumber2,
  IconRosetteNumber3,
} from '@tabler/icons-react';
import { FC } from 'react';

interface TourSelectProps {
  tour: number;
  onChange: (tour: number) => void;
}

const TourSelect: FC<TourSelectProps> = ({ tour, onChange }) => {
  return (
    <Flex gap={2} direction="column" w="32px">
      <Tooltip label="Первый тур" placement="right" hasArrow openDelay={800}>
        <IconButton
          icon={<IconRosetteNumber1 size={20} />}
          aria-label="number-1"
          colorScheme={tour === 1 ? 'purple' : 'gray'}
          onClick={() => onChange(1)}
        />
      </Tooltip>
      <Tooltip label="Второй тур" placement="right" hasArrow openDelay={800}>
        <IconButton
          icon={<IconRosetteNumber2 size={20} />}
          aria-label="number-2"
          colorScheme={tour === 2 ? 'purple' : 'gray'}
          onClick={() => onChange(2)}
        />
      </Tooltip>
      <Tooltip label="Третий тур" placement="right" hasArrow openDelay={800}>
        <IconButton
          icon={<IconRosetteNumber3 size={20} />}
          aria-label="number-3"
          colorScheme={tour === 3 ? 'purple' : 'gray'}
          onClick={() => onChange(3)}
        />
      </Tooltip>
      <Tooltip label="Суперигра" placement="right" hasArrow openDelay={800}>
        <IconButton
          icon={<IconCrown size={20} />}
          aria-label="crown"
          colorScheme={tour === 4 ? 'purple' : 'gray'}
          onClick={() => onChange(4)}
        />
      </Tooltip>
    </Flex>
  );
};

export default TourSelect;

import {
  Flex,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from '@chakra-ui/react';
import { IconVolume, IconVolume3 } from '@tabler/icons-react';
import { setVolume } from 'helpers/localStorage';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useState } from 'react';
import { appActions } from 'store/reducers/AppSlice';

const MIN = 0;
const MAX = 1;
const STEP = 0.1;

const VolumeSlider = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const volume = useAppSelector((state) => state.app.volume);

  const dispatch = useAppDispatch();

  const changeVolume = (value: number) => {
    dispatch(appActions.setVolume(value));
    setVolume(value);
  };

  return (
    <Flex gap={3} h="32px">
      {volume === 0 ? (
        <IconButton
          icon={<IconVolume3 size={18} />}
          aria-label="volume-3"
          isRound
          colorScheme="purple"
          onClick={() => changeVolume(STEP)}
        />
      ) : (
        <IconButton
          icon={<IconVolume size={18} />}
          aria-label="volume-2"
          isRound
          colorScheme="purple"
          onClick={() => changeVolume(MIN)}
        />
      )}
      <Slider
        value={volume}
        min={MIN}
        max={MAX}
        step={STEP}
        w={100}
        onChange={changeVolume}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderTrack bg="purple.100">
          <SliderFilledTrack bg="purple.400" />
        </SliderTrack>
        <Tooltip label={`${volume * 100}%`} isOpen={showTooltip} hasArrow>
          <SliderThumb />
        </Tooltip>
      </Slider>
    </Flex>
  );
};

export default VolumeSlider;

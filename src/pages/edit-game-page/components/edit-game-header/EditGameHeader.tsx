import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { appActions } from 'store/reducers/AppSlice';
import {
  Box,
  Button,
  Divider,
  HStack,
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  Tooltip,
} from '@chakra-ui/react';
import { IconArrowLeft } from '@tabler/icons-react';
import { MusicPlayer, VolumeSlider } from 'components';
import { useNavigate } from 'react-router-dom';
import { tour2Actions } from 'store/reducers/Tour2Slice';
import { setInitialTimer, setPointsIncreaseRate } from 'helpers/localStorage';
import { tour4Actions } from 'store/reducers/Tour4Slice';
import { INITIAL_PLAYING_MUSIC } from 'constants/initialStates';

const EditGameHeader = () => {
  const editingTour = useAppSelector((state) => state.app.editingTour);
  const pointsIncreaseRate = useAppSelector(
    (state) => state.tour2.pointsIncreaseRate,
  );
  const initialTimer = useAppSelector((state) => state.tour4.initialTimer);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const backHandler = () => {
    dispatch(appActions.setActiveTour(1));
    dispatch(appActions.setPlayingMusic(INITIAL_PLAYING_MUSIC));
    navigate('/');
  };

  const pointsIncreaseRateChange = (rate: number) => {
    dispatch(tour2Actions.setPointsIncreaseRate(rate));
    setPointsIncreaseRate(rate);
  };

  const initialTimerChange = (timer: number) => {
    dispatch(tour4Actions.setTour4InitialTimer(timer));
    setInitialTimer(timer);
  };

  return (
    <HStack gap={4}>
      <Button
        leftIcon={<IconArrowLeft size={20} />}
        colorScheme="purple"
        minW="min-content"
        onClick={backHandler}
      >
        Назад
      </Button>
      <Box h={5}>
        <Divider orientation="vertical" />
      </Box>
      <VolumeSlider />
      <Box h={5}>
        <Divider orientation="vertical" />
      </Box>
      <MusicPlayer />
      {editingTour === 2 && (
        <>
          <Box h={5}>
            <Divider orientation="vertical" />
          </Box>
          <Tooltip
            label={`Очки увеличиваются каждые ${pointsIncreaseRate} мс`}
            placement="right"
            hasArrow
            openDelay={800}
          >
            <InputGroup w="320px">
              <InputLeftAddon>Интервал увеличения очков (мс)</InputLeftAddon>
              <NumberInput
                min={100}
                defaultValue={pointsIncreaseRate}
                onChange={(_, number) =>
                  number >= 100 && pointsIncreaseRateChange(number)
                }
              >
                <NumberInputField p="0 12px" />
              </NumberInput>
            </InputGroup>
          </Tooltip>
        </>
      )}
      {editingTour === 4 && (
        <>
          <Box h={5}>
            <Divider orientation="vertical" />
          </Box>
          <InputGroup>
            <InputLeftAddon>Таймер (сек)</InputLeftAddon>
            <NumberInput
              min={1}
              max={99}
              w="100px"
              defaultValue={initialTimer}
              onChange={(_, number) =>
                number >= 1 && initialTimerChange(number)
              }
            >
              <NumberInputField />
            </NumberInput>
          </InputGroup>
        </>
      )}
    </HStack>
  );
};

export default EditGameHeader;

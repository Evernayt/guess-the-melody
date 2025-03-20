import { FC } from 'react';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import Pride from 'react-canvas-confetti/dist/presets/pride';
import CongratulationsSVG from './CongratulationsSVG';
import YouWonSupergameSVG from './YouWonSupergameSVG';
import './Congratulation.scss';

interface CongratulationProps {
  isSupergameWon: boolean;
}

const Congratulation: FC<CongratulationProps> = ({ isSupergameWon }) => {
  return isSupergameWon ? (
    <>
      <Fireworks autorun={{ speed: 1, duration: 30000 }} />
      <Pride autorun={{ speed: 30, duration: 30000 }} />
      <YouWonSupergameSVG />
    </>
  ) : (
    <>
      <Fireworks autorun={{ speed: 1, duration: 30000 }} />
      <CongratulationsSVG />
    </>
  );
};

export default Congratulation;

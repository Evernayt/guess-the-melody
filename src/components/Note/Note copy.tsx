// import { FC, ReactNode, useEffect, useRef, useState } from 'react';
// import { NOTE_OFF, NOTE_ON } from 'constants/images';
// import ReactAudioPlayer from 'react-audio-player';
// import styles from './Note.module.css';
// import { useAppDispatch, useAppSelector } from 'hooks/redux';
// import { useWindowDimensions } from 'hooks';
// import {
//   setActiveCategoryIdAction,
//   setActiveNoteIdAction,
//   setErrorAction,
//   setStopAllMusicAction,
// } from 'store/reducers/AppSlice';
// import { INote } from 'models/INote';
// import { ICategory } from 'models/ICategory';
// import { INextNoteNumber } from 'models/INextNoteNumber';
// import {
//   editNextNoteNumberAction,
//   setSecondTourIntervalAction,
//   stopAllNoteIntervalsAction,
// } from 'store/reducers/SecondTourSlice';

// interface NoteProps {
//   note: INote;
//   category: ICategory;
//   categoryIndex: number;
//   noteIndex: number;
//   tourFunction: () => void;
// }

// const Note: FC<NoteProps> = ({
//   note,
//   category,
//   categoryIndex,
//   noteIndex,
//   tourFunction,
// }) => {
//   const [numberFontSize, setNumberFontSize] = useState<number>(48);
//   const [numberMargin, setNumberMargin] = useState<number>(40);
//   const [active, setActive] = useState<boolean>(false);
//   const [tempNumber, setTempNumber] = useState<number>(note.number);
//   const [numberInterval, setNumberInterval] = useState<NodeJS.Timer | null>(
//     null
//   );

//   const volume = useAppSelector((state) => state.app.volume);
//   const activeNoteId = useAppSelector((state) => state.app.activeNoteId);
//   const stopAllMusic = useAppSelector((state) => state.app.stopAllMusic);
//   const nextNoteNumbers = useAppSelector(
//     (state) => state.secondTour.nextNoteNumbers
//   );
//   const stopAllNoteIntervals = useAppSelector(
//     (state) => state.secondTour.stopAllNoteIntervals
//   );

//   const activeCategoryId = useAppSelector(
//     (state) => state.app.activeCategoryId
//   );

//   const dispatch = useAppDispatch();

//   const { height } = useWindowDimensions();

//   const audioRef = useRef<ReactAudioPlayer>(null);
//   const originalAudioRef = useRef<ReactAudioPlayer>(null);

//   useEffect(() => {
//     if (height > 1000) {
//       setNumberFontSize(72);
//       setNumberMargin(70);
//     } else if (height > 900) {
//       setNumberFontSize(68);
//       setNumberMargin(70);
//     } else if (height > 800) {
//       setNumberFontSize(62);
//       setNumberMargin(60);
//     } else if (height > 700) {
//       setNumberFontSize(56);
//       setNumberMargin(50);
//     } else if (height > 600) {
//       setNumberFontSize(42);
//       setNumberMargin(40);
//     } else {
//       setNumberFontSize(36);
//       setNumberMargin(30);
//     }
//   }, [height]);

//   // useEffect(() => {
//   //   setActive(false);
//   // }, [activeTourIndex]);

//   useEffect(() => {
//     if (stopAllMusic) {
//       if (activeNoteId !== note.id) {
//         pauseMusic();
//         pauseOriginalMusic();
//         dispatch(setStopAllMusicAction(false));
//       }
//     }
//   }, [stopAllMusic]);

//   // useEffect(() => {
//   //   if (nextNoteNumbers[categoryIndex] !== undefined) {
//   //     const isActiveCategory =
//   //       tours[activeTourIndex].categories[categoryIndex].id ===
//   //       activeCategoryId;

//   //     if (numberInterval && !isActiveCategory) {
//   //       clearInterval(numberInterval);
//   //       setNumberInterval(null);
//   //       const nexNoteNumber = {
//   //         ...nextNoteNumbers[categoryIndex],
//   //         number: tempNumber,
//   //         categoryIndex,
//   //       };

//   //       dispatch(editNextNoteNumberAction(nexNoteNumber));
//   //     } else if (
//   //       nextNoteNumbers[categoryIndex].lastNoteId !== note.id &&
//   //       numberInterval
//   //     ) {
//   //       clearInterval(numberInterval);
//   //       setNumberInterval(null);
//   //       const nexNoteNumber = {
//   //         ...nextNoteNumbers[categoryIndex],
//   //         number: tempNumber,
//   //         categoryIndex,
//   //       };

//   //       dispatch(editNextNoteNumberAction(nexNoteNumber));
//   //     }
//   //   }
//   // }, [stopAllNoteIntervals]);

//   // useEffect(() => {
//   //   if (
//   //     nextNoteNumbers[categoryIndex] !== undefined &&
//   //     nextNoteNumbers[categoryIndex].lastNoteId === note.id
//   //   ) {
//   //     setTempNumber(nextNoteNumbers[categoryIndex].number);
//   //   }
//   // }, [nextNoteNumbers]);

//   const clickHandler = (e: any) => {
//     if (activeTourIndex === 0) {
//       firstTour(e.target.tagName);
//     } else if (activeTourIndex === 1) {
//       //secondTour(e.target.tagName);
//     }
//   };

//   const playMusic = () => {
//     audioRef.current?.audioEl.current?.play();
//   };

//   const pauseMusic = () => {
//     audioRef.current?.audioEl.current?.pause();
//   };

//   const musicIsPlaying = (): boolean => {
//     return !audioRef.current?.audioEl.current?.paused;
//   };

//   const playOriginalMusic = () => {
//     originalAudioRef.current?.audioEl.current?.play();
//   };

//   const pauseOriginalMusic = () => {
//     originalAudioRef.current?.audioEl.current?.pause();
//   };

//   const originalMusicIsPlaying = (): boolean => {
//     return !originalAudioRef.current?.audioEl.current?.paused;
//   };

//   const firstTour = (tagName: string) => {
//     dispatch(setActiveNoteIdAction(note.id));
//     dispatch(setActiveCategoryIdAction(category.id));
//     dispatch(setStopAllMusicAction(true));

//     if (tagName === 'ARTICLE' && active) {
//       pauseMusic();

//       if (!note.original) {
//         dispatch(setErrorAction('Песня не найдена.'));
//         return;
//       }

//       if (originalMusicIsPlaying()) {
//         pauseOriginalMusic();
//         dispatch(setActiveCategoryIdAction(0));
//       } else {
//         playOriginalMusic();
//       }
//     } else {
//       if (!note.backingTrack) {
//         dispatch(setErrorAction('Минусовка песни не найдена.'));
//         return;
//       }

//       setActive(true);

//       pauseOriginalMusic();

//       if (musicIsPlaying()) {
//         pauseMusic();
//         dispatch(setActiveCategoryIdAction(0));
//       } else {
//         playMusic();
//       }
//     }
//   };

//   // const secondTour = (tagName: string) => {
//   //   if (secondTourInterval) {
//   //     // При первом нажатии на первую ноту
//   //     if (noteIndex > 0) return;
//   //     clearInterval(secondTourInterval);
//   //     dispatch(setSecondTourIntervalAction(null));

//   //     const nexNoteNumber: INextNoteNumber = {
//   //       lastNoteId: note.id,
//   //       nextNoteId: getNextNoteId(note.id),
//   //       number: tempNumber,
//   //       categoryIndex,
//   //     };
//   //     dispatch(editNextNoteNumberAction(nexNoteNumber));

//   //     secondTourStartNumberInterval();
//   //   } else {
//   //     if (tagName === 'ARTICLE' && active) {
//   //       if (!note.original) {
//   //         dispatch(setErrorAction('Песня не найдена.'));
//   //         return;
//   //       }

//   //       if (numberInterval) {
//   //         secondTourStopNumberInterval(numberInterval);
//   //       }

//   //       if (originalMusicIsPlaying()) {
//   //         pauseOriginalMusic();
//   //         dispatch(setActiveCategoryIdAction(0));
//   //       } else {
//   //         playOriginalMusic();
//   //         dispatch(setActiveNoteIdAction(note.id));
//   //         dispatch(setActiveCategoryIdAction(category.id));
//   //         dispatch(setStopAllMusicAction(true));
//   //         dispatch(stopAllNoteIntervalsAction());
//   //       }
//   //     } else {
//   //       if (!note.backingTrack) {
//   //         dispatch(setErrorAction('Минусовка песни не найдена.'));
//   //         return;
//   //       }

//   //       let nextNoteId;
//   //       dispatch(stopAllNoteIntervalsAction());
//   //       if (nextNoteNumbers[categoryIndex] !== undefined) {
//   //         //console.log('nextNoteNumbers не undefined');
//   //         nextNoteId = nextNoteNumbers[categoryIndex].nextNoteId;
//   //       } else {
//   //         //console.log('nextNoteNumbers undefined');

//   //         if (noteIndex === 0) {
//   //           const nexNoteNumber: INextNoteNumber = {
//   //             lastNoteId: note.id,
//   //             nextNoteId: getNextNoteId(note.id),
//   //             number: tempNumber,
//   //             categoryIndex,
//   //           };
//   //           dispatch(editNextNoteNumberAction(nexNoteNumber));

//   //           secondTourStartNumberInterval();
//   //           return;
//   //         }
//   //       }

//   //       if (nextNoteId === note.id) {
//   //         //console.log('Нажатие на следующую ноту');
//   //         // При нажатии на следующую ноту
//   //         setTempNumber(nextNoteNumbers[categoryIndex].number);

//   //         const nexNoteNumber: INextNoteNumber = {
//   //           lastNoteId: note.id,
//   //           nextNoteId: getNextNoteId(note.id),
//   //           number: nextNoteNumbers[categoryIndex].number,
//   //           categoryIndex,
//   //         };
//   //         dispatch(editNextNoteNumberAction(nexNoteNumber));

//   //         secondTourStartNumberInterval();
//   //       } else {
//   //         if (numberInterval) {
//   //           //console.log('Остановка текущей ноты');
//   //           // Для остановки текущей ноты
//   //           secondTourStopNumberInterval(numberInterval);
//   //         } else if (
//   //           nextNoteNumbers[categoryIndex] !== undefined &&
//   //           nextNoteNumbers[categoryIndex].lastNoteId === note.id
//   //         ) {
//   //           //console.log('Запуск текущей ноты');
//   //           // Для запуска текущей ноты
//   //           secondTourStartNumberInterval();
//   //         }
//   //       }
//   //     }
//   //   }
//   // };

//   // const secondTourStartNumberInterval = () => {
//   //   setActive(true);
//   //   pauseOriginalMusic();
//   //   playMusic();

//   //   dispatch(setActiveNoteIdAction(note.id));
//   //   dispatch(setActiveCategoryIdAction(category.id));
//   //   dispatch(setStopAllMusicAction(true));

//   //   const interval = setInterval(() => {
//   //     setTempNumber((prevState) => prevState + 1);
//   //   }, numberIncrementSpeed);

//   //   setNumberInterval(interval);
//   // };

//   // const secondTourStopNumberInterval = (numberInterval: NodeJS.Timer) => {
//   //   pauseMusic();
//   //   clearInterval(numberInterval);
//   //   setNumberInterval(null);

//   //   const nexNoteNumber: INextNoteNumber = {
//   //     lastNoteId: note.id,
//   //     nextNoteId: getNextNoteId(note.id),
//   //     number: tempNumber,
//   //     categoryIndex,
//   //   };
//   //   dispatch(editNextNoteNumberAction(nexNoteNumber));
//   //   dispatch(setActiveCategoryIdAction(0));
//   // };

//   // const getNextNoteId = (nodeId: number) => {
//   //   const lastNoteIdValues = ('' + nodeId).split('').map(Number);
//   //   lastNoteIdValues[1]++;
//   //   return Number(lastNoteIdValues.join(''));
//   // };

//   return (
//     <div className={styles.image_container} onClick={(e) => clickHandler(e)}>
//       <ReactAudioPlayer
//         src={note.backingTrack?.path}
//         controls={false}
//         ref={audioRef}
//         volume={volume}
//       />
//       <ReactAudioPlayer
//         src={note.original?.path}
//         controls={false}
//         ref={originalAudioRef}
//         volume={volume}
//       />
//       <span
//         className={styles.text}
//         style={{
//           fontSize: `${numberFontSize}px`,
//           marginTop: `${numberMargin}px`,
//         }}
//       >
//         {active && tempNumber}
//       </span>
//       <article className={styles.original_music} />
//       <img
//         className={styles.image}
//         src={activeNoteId === note.id ? NOTE_ON : NOTE_OFF}
//       />
//     </div>
//   );
// };

// export default Note;

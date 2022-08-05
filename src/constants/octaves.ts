import { IPianoOctave } from 'models/IPianoOctave';

const octaves: IPianoOctave[] = [
  {
    id: 1,
    whiteKey: {
      key: 'C3',
      sound: '/piano_sounds/C3.mp3',
      keyboard_keys: ['Q', 'q', 'Й', 'й'],
    },
    blackKey: {
      key: 'CS3',
      sound: '/piano_sounds/Cs3.mp3',
      keyboard_keys: ['1'],
    },
  },
  {
    id: 2,
    whiteKey: {
      key: 'D3',
      sound: '/piano_sounds/D3.mp3',
      keyboard_keys: ['W', 'w', 'Ц', 'ц'],
    },
    blackKey: {
      key: 'DS3',
      sound: '/piano_sounds/Ds3.mp3',
      keyboard_keys: ['2'],
    },
  },
  {
    id: 3,
    whiteKey: {
      key: 'E3',
      sound: '/piano_sounds/E3.mp3',
      keyboard_keys: ['E', 'e', 'У', 'у'],
    },
    blackKey: null,
  },
  {
    id: 4,
    whiteKey: {
      key: 'F3',
      sound: '/piano_sounds/F3.mp3',
      keyboard_keys: ['R', 'r', 'К', 'к'],
    },
    blackKey: {
      key: 'FS3',
      sound: '/piano_sounds/Fs3.mp3',
      keyboard_keys: ['3'],
    },
  },
  {
    id: 5,
    whiteKey: {
      key: 'G3',
      sound: '/piano_sounds/G3.mp3',
      keyboard_keys: ['T', 't', 'Е', 'е'],
    },
    blackKey: {
      key: 'GS3',
      sound: '/piano_sounds/Gs3.mp3',
      keyboard_keys: ['4'],
    },
  },
  {
    id: 6,
    whiteKey: {
      key: 'A3',
      sound: '/piano_sounds/A3.mp3',
      keyboard_keys: ['Y', 'y', 'Н', 'н'],
    },
    blackKey: {
      key: 'AS3',
      sound: '/piano_sounds/As3.mp3',
      keyboard_keys: ['5'],
    },
  },
  {
    id: 7,
    whiteKey: {
      key: 'B3',
      sound: '/piano_sounds/B3.mp3',
      keyboard_keys: ['U', 'u', 'Г', 'г'],
    },
    blackKey: null,
  },
  {
    id: 8,
    whiteKey: {
      key: 'C4',
      sound: '/piano_sounds/C4.mp3',
      keyboard_keys: ['I', 'i', 'Ш', 'ш'],
    },
    blackKey: {
      key: 'CS4',
      sound: '/piano_sounds/Cs4.mp3',
      keyboard_keys: ['6'],
    },
  },
  {
    id: 9,
    whiteKey: {
      key: 'D4',
      sound: '/piano_sounds/D4.mp3',
      keyboard_keys: ['O', 'o', 'Щ', 'щ'],
    },
    blackKey: {
      key: 'DS4',
      sound: '/piano_sounds/Ds4.mp3',
      keyboard_keys: ['7'],
    },
  },
  {
    id: 10,
    whiteKey: {
      key: 'E4',
      sound: '/piano_sounds/E4.mp3',
      keyboard_keys: ['P', 'p', 'З', 'з'],
    },
    blackKey: null,
  },
  {
    id: 11,
    whiteKey: {
      key: 'F4',
      sound: '/piano_sounds/F4.mp3',
      keyboard_keys: ['{', '[', 'Х', 'х'],
    },
    blackKey: {
      key: 'FS4',
      sound: '/piano_sounds/Fs4.mp3',
      keyboard_keys: ['8'],
    },
  },
  {
    id: 12,
    whiteKey: {
      key: 'G4',
      sound: '/piano_sounds/G4.mp3',
      keyboard_keys: ['}', ']', 'Ъ', 'ъ'],
    },
    blackKey: {
      key: 'GS4',
      sound: '/piano_sounds/Gs4.mp3',
      keyboard_keys: ['9'],
    },
  },
  {
    id: 13,
    whiteKey: {
      key: 'A4',
      sound: '/piano_sounds/A4.mp3',
      keyboard_keys: ['Z', 'z', 'Я', 'я'],
    },
    blackKey: {
      key: 'AS4',
      sound: '/piano_sounds/As4.mp3',
      keyboard_keys: ['A', 'a', 'Ф', 'ф'],
    },
  },
  {
    id: 14,
    whiteKey: {
      key: 'B4',
      sound: '/piano_sounds/B4.mp3',
      keyboard_keys: ['X', 'x', 'Ч', 'ч'],
    },
    blackKey: null,
  },
  {
    id: 15,
    whiteKey: {
      key: 'C5',
      sound: '/piano_sounds/C5.mp3',
      keyboard_keys: ['C', 'c', 'С', 'с'],
    },
    blackKey: {
      key: 'CS5',
      sound: '/piano_sounds/Cs5.mp3',
      keyboard_keys: ['S', 's', 'Ы', 'ы'],
    },
  },
  {
    id: 16,
    whiteKey: {
      key: 'D5',
      sound: '/piano_sounds/D5.mp3',
      keyboard_keys: ['V', 'v', 'М', 'м'],
    },
    blackKey: {
      key: 'DS5',
      sound: '/piano_sounds/Ds5.mp3',
      keyboard_keys: ['D', 'd', 'В', 'в'],
    },
  },
  {
    id: 17,
    whiteKey: {
      key: 'E5',
      sound: '/piano_sounds/E5.mp3',
      keyboard_keys: ['B', 'b', 'И', 'и'],
    },
    blackKey: null,
  },
  {
    id: 18,
    whiteKey: {
      key: 'F5',
      sound: '/piano_sounds/F5.mp3',
      keyboard_keys: ['N', 'n', 'Т', 'т'],
    },
    blackKey: {
      key: 'FS5',
      sound: '/piano_sounds/Fs5.mp3',
      keyboard_keys: ['F', 'f', 'А', 'а'],
    },
  },
  {
    id: 19,
    whiteKey: {
      key: 'G5',
      sound: '/piano_sounds/G5.mp3',
      keyboard_keys: ['M', 'm', 'Ь', 'ь'],
    },
    blackKey: {
      key: 'GS5',
      sound: '/piano_sounds/Gs5.mp3',
      keyboard_keys: ['G', 'g', 'П', 'п'],
    },
  },
  {
    id: 20,
    whiteKey: {
      key: 'A5',
      sound: '/piano_sounds/A5.mp3',
      keyboard_keys: ['<', ',', 'Б', 'б'],
    },
    blackKey: {
      key: 'AS5',
      sound: '/piano_sounds/As5.mp3',
      keyboard_keys: ['H', 'h', 'Р', 'р'],
    },
  },
  {
    id: 21,
    whiteKey: {
      key: 'B5',
      sound: '/piano_sounds/B5.mp3',
      keyboard_keys: ['>', '.', 'Ю', 'ю'],
    },
    blackKey: null,
  },
];

export { octaves };

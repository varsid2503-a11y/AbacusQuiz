import { Howl } from 'howler';

const sounds = {
  click: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
    volume: 0.5,
  }),
  correct: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'],
    volume: 0.6,
  }),
  error: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'],
    volume: 0.4,
  }),
  triumph: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/1993/1993-preview.mp3'],
    volume: 0.8,
  }),
};

export const playSound = (type: keyof typeof sounds) => {
  sounds[type].play();
};

import GObject from 'gi://GObject';

export interface IStorageItem {
  uuid: string,
  display_id: string,
  icon?: string,
  name: string,
  creators: string[],
  categories: string[],
  description: string,
  last_update: string,
  file: string,
}

export class Js_StorageItem extends GObject.Object {}

export const StorageItem = GObject.registerClass({
  GTypeName: 'StorageItem',
  Properties: {

  },
}, Js_StorageItem);

export const SampleStorageItem: IStorageItem = {
  uuid: '2964411676',
  display_id: '',
  name: 'Counter-Strike 2: P90',
  creators: ['ihcorochris'],
  categories: [
    'Sounds',
    'UI',
    'Models',
    'SMG',
  ],
  description:
`The most futuristic gun on the planet!

The FN P90 TR (Triple Rail) appears in the game with rail-mounted iron sights. It is the only submachine gun not to award extra money for kills. The weapon is frequently linked with lower-skilled players due to its high armor penetration value, high capacity, respectable damage, mild recoil, and quick rate of fire; its only major drawbacks are the aforementioned low kill award, an outrageous price, and a long reload.

Magazine isn't animated for the same reason as the Steyr AUG and FAMAS. The charging handle on the other hand, moves in thirdperson.

Replaces the Uzi on Twilight Sparkle's ported Global Offensive animations.

FEATURES:
Global Offensive Sounds and Animations
Custom HUD Icon
Skin Support
Another gun that doesn't have the mag animated.

CREDITS
Valve - Model, Textures, Sounds, and Animations
Twilight Sparkle - Animations`,
  last_update: '19 Apr @ 7:20pm',
  file: '~/.cache/a912bdf2e0',
};

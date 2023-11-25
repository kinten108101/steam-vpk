import HeaderBox from '../ui/headerbox.js';

/**
 * @param {{
 *   toggleable: {
 *     set_active(val: boolean): void;
 *     get_active(): boolean;
 *   };
 *   swipe_tracker: import('../main.js').SwipeTracker;
 *   headerbox: HeaderBox;
 * }} params
 */
export default function UseHeaderboxInteraction(
{ toggleable,
  swipe_tracker,
  headerbox,
}) {
  headerbox.connect('notify::reveal-child', () => {
    toggleable.set_active(headerbox.reveal_child);
  });
  swipe_tracker.connect('update-swipe', (_object, delta) => {
    if (delta > 1) headerbox.reveal_child = true;
    else if (delta < -1) headerbox.reveal_child = false;
  });
}

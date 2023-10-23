import HeaderBox from '../ui/headerbox.js';

export default function ProfileBarSyncHeaderbox(
{ primary_button,
  headerbox,
}:
{ primary_button: {
    set_active(val: boolean): void;
  };
  headerbox: HeaderBox;
}) {
  headerbox.connect('notify::reveal-child', () => {
    primary_button.set_active(headerbox.reveal_child);
  });
}

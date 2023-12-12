import {TouchableOpacity, View} from 'react-native';
import {TSeat} from '../types/TSeat';
import CustomIcon from './CustomIcon';
import {COLORS, FONTSIZE} from '../theme/theme';

export function Seat({
  seat,
  isSelected,
  onSelectSeat,
}: {
  seat: TSeat;
  isSelected: boolean;
  onSelectSeat: () => void;
}) {
  let seatColor;
  if (seat.status === 2 || seat.status === 3) seatColor = COLORS.FaintWhite;
  else if (isSelected && seat.status === 1) seatColor = COLORS.Blue;
  else seatColor = COLORS.Black;
  return (
    <View
      style={{
        width: 20,
        height: 20,
        alignSelf: 'center',
      }}>
      <TouchableOpacity onPress={onSelectSeat}>
        <CustomIcon
          name="seat"
          style={{
            fontSize: FONTSIZE.size_20,
            color: seatColor,
          }}></CustomIcon>
      </TouchableOpacity>
    </View>
  );
}

import {useState} from 'react';
// import { Seat } from "./Seat";
import {TSeat} from '../types/TSeat';
import {Text, View} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE} from '../theme/theme';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Seat} from './Seat';

const constructRows = (seats: TSeat[]) => {
  const rows: Record<string, TSeat[]> = {};

  seats.forEach(seat => {
    if (!rows[seat.seatCode[0]]) {
      rows[seat.seatCode[0]] = [];
    }
    rows[seat.seatCode[0]].push(seat);
  });

  return rows;
};

export function Seats({
  onSelectSeat,
  selectedSeats,
  seats,
  ncols,
  nrows,
}: {
  nrows: number;
  ncols: number;
  seats: TSeat[];
  selectedSeats: TSeat[];
  onSelectSeat: (seat: TSeat) => void;
}) {
  const [rows, setRows] = useState(constructRows(seats));

  const isSelectedSeat = (seatId: number) =>
    selectedSeats.findIndex(s => s.id === seatId) !== -1;

  //   console.log(rows);
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
      <View style={{}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: 20,
              height: 20,
            }}></View>
          {Array(Object.keys(rows).length)
            .fill(0)
            .map((v, index) => {
              return (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  key={index}>
                  <Text
                    style={{
                      color: COLORS.White,
                      fontFamily: FONTFAMILY.poppins_semibold,
                      textAlign: 'center',
                    }}>
                    {index + 1}
                  </Text>
                </View>
              );
            })}
        </View>
        {Object.keys(rows).map(row => {
          if (!row) {
            return <View key={'empty_row'} style={{height: 20}}></View>;
          }

          return (
            <View
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
              key={row}>
              <View
                style={{
                  width: 20,
                }}>
                <Text
                  style={{
                    color: COLORS.White,
                    fontFamily: FONTFAMILY.poppins_semibold,
                  }}>
                  {row}
                </Text>
              </View>

              <View style={{display: 'flex', gap: 8, flexDirection: 'row'}}>
                {rows[row].map((seat: TSeat) => {
                  if (!seat) {
                    return (
                      <View
                        key={'empty_seat'}
                        style={{
                          width: 20,
                          height: 20,
                        }}></View>
                    );
                  }
                  return (
                    <Seat
                      key={seat.id}
                      seat={seat}
                      isSelected={isSelectedSeat(seat.id)}
                      onSelectSeat={() => onSelectSeat(seat)}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

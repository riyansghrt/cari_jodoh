import React, { Component } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert
} from 'react-native';
import Text from './Text'; // ganti sesuai komponen Text kamu

const { width } = Dimensions.get('window');

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const FALLBACK_DATE_PARTS = {
  day: 1,
  month: 1,
  year: 2000
};

class ModalNewDatePicker extends Component {
  constructor(props) {
    super(props);

    const { day, month, year } = this.getInitialDateParts();
    this.state = {
      modalVisible: props.visible,
      selectedDay: day,
      selectedMonth: month,
      selectedYear: year
    };
  }

  componentDidMount() {
    this.setState({ modalVisible: this.props.visible });
  }

  componentDidUpdate(prevProps) {
    const isOpening = !prevProps.visible && this.props.visible;
    const defaultChanged =
      prevProps.defaultDay !== this.props.defaultDay ||
      prevProps.defaultMonth !== this.props.defaultMonth ||
      prevProps.defaultYear !== this.props.defaultYear ||
      prevProps.defaultDate !== this.props.defaultDate ||
      prevProps.selectedDate !== this.props.selectedDate ||
      prevProps.value !== this.props.value;

    if (prevProps.visible !== this.props.visible) {
      this.setState({ modalVisible: this.props.visible });
    }

    if (isOpening || (this.props.visible && defaultChanged)) {
      const { day, month, year } = this.getInitialDateParts();
      this.setState({
        selectedDay: day,
        selectedMonth: month,
        selectedYear: year
      });
    }
  }

  getMinMax = () => {
    const { minDate, maxDate } = this.props;
    const min = minDate ? new Date(minDate) : new Date(1900, 0, 1);
    const max = maxDate ? new Date(maxDate) : new Date(2100, 11, 31);
    return { min, max };
  };

  parseDateParts = (value) => {
    if (!value) return null;

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return {
        day: value.getDate(),
        month: value.getMonth() + 1,
        year: value.getFullYear()
      };
    }

    const raw = String(value).trim();
    if (!raw) return null;

    const normalized = raw.includes('T') ? raw.split('T')[0] : raw;
    let match = normalized.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (match) {
      return {
        day: Number(match[3]),
        month: Number(match[2]),
        year: Number(match[1])
      };
    }

    match = normalized.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (match) {
      return {
        day: Number(match[1]),
        month: Number(match[2]),
        year: Number(match[3])
      };
    }

    return null;
  };

  isValidDateParts = ({ day, month, year }) => {
    if (!day || !month || !year) return false;

    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  clampDateParts = (parts) => {
    const { min, max } = this.getMinMax();
    const date = new Date(parts.year, parts.month - 1, parts.day);
    const clampedDate = date < min ? min : date > max ? max : date;

    return {
      day: clampedDate.getDate(),
      month: clampedDate.getMonth() + 1,
      year: clampedDate.getFullYear()
    };
  };

  getInitialDateParts = () => {
    const parsed = this.parseDateParts(
      this.props.defaultDate || this.props.selectedDate || this.props.value
    );

    const parts = parsed || {
      day: Number(this.props.defaultDay) || FALLBACK_DATE_PARTS.day,
      month: Number(this.props.defaultMonth) || FALLBACK_DATE_PARTS.month,
      year: Number(this.props.defaultYear) || FALLBACK_DATE_PARTS.year
    };

    if (!this.isValidDateParts(parts)) return FALLBACK_DATE_PARTS;

    return this.clampDateParts(parts);
  };

  onConfirm = () => {
    const { selectedDay, selectedMonth, selectedYear } = this.state;
    const day = selectedDay.toString().padStart(2, '0');
    const month = selectedMonth.toString().padStart(2, '0');
    const formattedDate = `${selectedYear}-${month}-${day}`;
    const selectedDate = new Date(formattedDate);
    const { min, max } = this.getMinMax();

    if (selectedDate < min) {
      Alert.alert('Batas Tanggal', `Tanggal minimal: ${min.toISOString().slice(0, 10)}`);
      return;
    }
    if (selectedDate > max) {
      Alert.alert('Batas Tanggal', `Tanggal maksimal: ${max.toISOString().slice(0, 10)}`);
      return;
    }

    this.props.onConfirm(formattedDate);
  };

  renderItem = (item, selected, onPress) => (
    <Pressable onPress={onPress} style={styles.itemWrapper}>
      <Text style={[styles.itemText, selected && styles.selectedItem]}>{item}</Text>
    </Pressable>
  );

  render() {
    const { modalVisible, selectedDay, selectedMonth, selectedYear } = this.state;
    const { min, max } = this.getMinMax();

    // batasi years sesuai min & max
    const years = Array.from(
      { length: max.getFullYear() - min.getFullYear() + 1 },
      (_, i) => min.getFullYear() + i
    );

    // hitung jumlah hari tiap bulan (perhatikan tahun kabisat)
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Pilih Tanggal</Text>
              <Pressable onPress={this.props.onClose}>
                <Text style={styles.closeBtn}>✕</Text>
              </Pressable>
            </View>

            {/* Picker Row */}
            <View style={styles.pickerRow}>
              {/* Day */}
              <FlatList
                data={days}
                keyExtractor={(item) => item.toString()}
                showsVerticalScrollIndicator={false}
                getItemLayout={(_, index) => ({ length: 40, offset: 40 * index, index })}
                initialScrollIndex={Math.max(0, days.findIndex((d) => d === selectedDay))}
                onScroll={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.y / 40);
                  if (days[index] && days[index] !== this.state.selectedDay) {
                    this.setState({ selectedDay: days[index] });
                  }
                }}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.y / 40);
                  this.setState({ selectedDay: days[index] });
                }}
                renderItem={({ item }) =>
                  this.renderItem(item, item === selectedDay, () =>
                    this.setState({ selectedDay: item })
                  )
                }
                style={styles.column}
                contentContainerStyle={styles.listPadding}
                snapToInterval={40}
                decelerationRate="fast"
                scrollEventThrottle={16}
              />

              {/* Month */}
              <FlatList
                data={MONTHS}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                getItemLayout={(_, index) => ({ length: 40, offset: 40 * index, index })}
                initialScrollIndex={selectedMonth - 1}
                onScroll={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.y / 40);
                  if (MONTHS[index] && index + 1 !== this.state.selectedMonth) {
                    this.setState({ selectedMonth: index + 1 });
                  }
                }}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.y / 40);
                  this.setState({ selectedMonth: index + 1 });
                }}
                renderItem={({ item, index }) =>
                  this.renderItem(item, index + 1 === selectedMonth, () =>
                    this.setState({ selectedMonth: index + 1 })
                  )
                }
                style={styles.column}
                contentContainerStyle={styles.listPadding}
                snapToInterval={40}
                decelerationRate="fast"
                scrollEventThrottle={16}
              />

              {/* Year */}
              <FlatList
                data={years}
                keyExtractor={(item) => item.toString()}
                showsVerticalScrollIndicator={false}
                getItemLayout={(_, index) => ({ length: 40, offset: 40 * index, index })}
                initialScrollIndex={Math.max(0, years.findIndex((y) => y === selectedYear))}
                onScroll={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.y / 40);
                  if (years[index] && years[index] !== this.state.selectedYear) {
                    this.setState({ selectedYear: years[index] });
                  }
                }}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.y / 40);
                  this.setState({ selectedYear: years[index] });
                }}
                renderItem={({ item }) =>
                  this.renderItem(item, item === selectedYear, () =>
                    this.setState({ selectedYear: item })
                  )
                }
                style={styles.column}
                contentContainerStyle={styles.listPadding}
                snapToInterval={40}
                decelerationRate="fast"
                scrollEventThrottle={16}
              />
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={this.onConfirm}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmText}>Pilih</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: 'bold' },
  closeBtn: { fontSize: 22, color: '#888' },
  pickerRow: { flexDirection: 'row', justifyContent: 'space-around', height: 200 },
  column: { width: width / 3.3 },
  itemWrapper: { height: 40, justifyContent: 'center', alignItems: 'center' },
  itemText: { fontSize: 16, color: '#888' },
  selectedItem: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  confirmButton: { marginTop: 12, backgroundColor: '#00B050', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  confirmText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  listPadding: { paddingTop: 80, paddingBottom: 80 }
});

export default ModalNewDatePicker;

import React, { Component } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable
} from 'react-native';

const { width } = Dimensions.get('window');
import Feather from "react-native-vector-icons/Feather";
import { Colors } from './Colors';
import { Col, Row } from './Grid';
import Text from './Text';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

class ModalMonthYearNew extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      modalVisible: props.visible || false,
      selectedMonth: today.getMonth() + 1, // bulan mulai dari 0
      selectedYear: today.getFullYear(),
      checked: props.checked || false
    };
  }

  openModal = () => this.setState({ modalVisible: true });
  closeModal = () => this.setState({ modalVisible: false });

  onConfirm = () => {
    const { selectedMonth, selectedYear } = this.state;
    const month = selectedMonth.toString().padStart(2, '0');
    const formattedDate = `${selectedYear}-${month}`;
    this.props.onConfirm(formattedDate, this.state.checked);
    this.props.onClose()
  };

  renderItem = (item, selected, onPress) => (
    <Pressable onPress={onPress} style={styles.itemWrapper}>
      <Text style={[styles.itemText, {color: !this.props.title ? selected ? '#000' : '#888' : this.state.checked ? '#00000015' : selected ? '#000' : '#888'}]} type={!this.props.title ? selected ? 'bold' : 'regular' : this.state.checked ? 'regular' : selected ? 'bold' : 'regular'}>{item}</Text>
    </Pressable>
  );

  render() {
    const { modalVisible, selectedMonth, selectedYear } = this.state;
    const years = Array.from({ length: 100 }, (_, i) => 1985 + i);
    const {title} = this.props
    return (
      <View style={styles.container}>
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <View style={styles.header}>
                <Text style={styles.title}>Pilih Bulan & Tahun Periode {title ? 'Akhir' : 'Awal'}</Text>
                <Pressable onPress={this.props.onClose}><Text style={styles.closeBtn}>✕</Text></Pressable>
              </View>

              {title && <TouchableOpacity style={{ marginTop: -4, marginBottom: 4 }} onPress={() => this.setState({ checked: !this.state.checked })}>
                    <Row style={{ alignItems: 'center' }}>
                        <View style={{  height: 20, marginRight: 8, backgroundColor: this.state.checked ? Colors.main : Colors.white, borderColor: Colors.main, borderWidth: 1, width: 20, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Feather size={16} name='check' color={Colors.white} />
                        </View>
                        <Col>
                            <Text>{this.props.labelChecked || 'Sampai Saat Ini'}</Text>
                        </Col>  
                    </Row>
               </TouchableOpacity>}

              <View style={styles.pickerRow}>
                {/* Month */}
                <FlatList
                  data={MONTHS}
                  keyExtractor={(_, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  getItemLayout={(_, index) => ({ length: 40, offset: 40 * index, index })}
                  initialScrollIndex={selectedMonth - 1}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / 40);
                    this.setState({ selectedMonth: index + 1 });
                  }}
                  renderItem={({ item, index }) =>
                    this.renderItem(item, index + 1 === selectedMonth, () => this.setState({ selectedMonth: index + 1 }))
                  }
                  style={styles.column}
                  contentContainerStyle={styles.listPadding}
                  snapToInterval={40}
                  decelerationRate="fast"
                />

                {/* Year */}
                <FlatList
                  data={years}
                  keyExtractor={(item) => item.toString()}
                  showsVerticalScrollIndicator={false}
                  getItemLayout={(_, index) => ({ length: 40, offset: 40 * index, index })}
                  initialScrollIndex={years.indexOf(selectedYear)}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / 40);
                    this.setState({ selectedYear: years[index] });
                  }}
                  renderItem={({ item }) =>
                    this.renderItem(item, item === selectedYear, () => this.setState({ selectedYear: item }))
                  }
                  style={styles.column}
                  contentContainerStyle={styles.listPadding}
                  snapToInterval={40}
                  decelerationRate="fast"
                />
              </View>

              <TouchableOpacity onPress={this.onConfirm} style={styles.confirmButton}>
                <Text style={styles.confirmText}>simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: 'bold' },
  closeBtn: { fontSize: 22, color: '#888' },
  pickerRow: { flexDirection: 'row', marginHorizontal: -16, justifyContent: 'space-around', height: 200 },
  column: { width: width / 2.3 },
  itemWrapper: { height: 40, justifyContent: 'center', alignItems: 'center' },
  itemText: { fontSize: 16 },
  selectedItem: { fontSize: 16, fontWeight: 'bold' },
  confirmButton: { marginTop: 12, backgroundColor: '#00B050', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  confirmText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  listPadding: { paddingTop: 80, paddingBottom: 80 }
});

export default ModalMonthYearNew;

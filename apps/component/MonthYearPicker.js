import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Button from './Button';
import { Colors } from './Colors';
import moment from 'moment';

const MonthYearPickerModal = ({
  visible,
  onClose,
  onConfirm,
  initialMonth = '01',
  initialYear = new Date().getFullYear().toString(),
  minYear = 1980,
  maxYear = moment().year(), // -> pastikan ini number, bukan string
  showMonth = true,
  showYear = true,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  useEffect(() => {
    setSelectedMonth(initialMonth);
    setSelectedYear(initialYear);
  }, [initialMonth, initialYear]);

  const months = [
    { label: 'Januari', value: '01' },
    { label: 'Februari', value: '02' },
    { label: 'Maret', value: '03' },
    { label: 'April', value: '04' },
    { label: 'Mei', value: '05' },
    { label: 'Juni', value: '06' },
    { label: 'Juli', value: '07' },
    { label: 'Agustus', value: '08' },
    { label: 'September', value: '09' },
    { label: 'Oktober', value: '10' },
    { label: 'November', value: '11' },
    { label: 'Desember', value: '12' },
  ];

  const years = [];
  for (let i = minYear; i <= maxYear; i++) {
    years.push(i.toString());
  }

  const handleConfirm = () => {
    onConfirm(selectedMonth, selectedYear);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {showMonth && (
            <>
              <Text style={styles.modalTitle}>Pilih Bulan</Text>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                style={styles.picker}
              >
                {months.map((month) => (
                  <Picker.Item key={month.value} label={month.label} value={month.value} />
                ))}
              </Picker>
            </>
          )}

          {showYear && (
            <>
              <Text style={styles.modalTitle}>Pilih Tahun</Text>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}
                style={styles.picker}
              >
                {years.map((year) => (
                  <Picker.Item key={year} label={year} value={year} />
                ))}
              </Picker>
            </>
          )}

          <View style={styles.buttonRow}>
            <Button
              label="Batal"
              color={Colors.main}
              border
              style={{ width: '47%' }}
              onPress={onClose}
            />
            <Button
              label="Pilih"
              style={{ width: '47%' }}
              onPress={handleConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MonthYearPickerModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  picker: {
    ...Platform.select({
      android: {
        backgroundColor: Colors.main,
      },
      ios: {},
    }),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

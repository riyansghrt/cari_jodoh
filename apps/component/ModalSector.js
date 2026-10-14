import React, { Component } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard } from
"react-native";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Row, Col } from "./Grid";
import { Colors } from "./Colors";
import { apiCall } from "../providers/rest/RequestApi";
import Text from "./Text";
import { searchByName, searchByNameSector } from "./FormatType";
import { t } from "../state/lang/UseLanguage";

const { height, width } = Dimensions.get("window");

class ModalSector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      text: "",
      full: null,
      selected: props.selected || [],
      source: []
    };
    this.typingTimeout = null;
    this.fetchSearch();
  }

  handleSearchInput = (text) => {
    this.setState({ text: text });
    if (text.length > 1) {
      // Hapus timer sebelumnya
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }

      // Set timer baru
      this.typingTimeout = setTimeout(() => {
        const result = searchByNameSector(this.state.text, this.state.source);

        this.setState({ list: result });
      }, 1000); // 1 detik
    }

  };

  fetchSearch = async () => {
    const { user } = this.props.user;

    const res = await apiCall({
      method: "GET",
      url: `data/sectors?query=${this.state.text}`
      // data: {
      //   headers: { Authorization: `Bearer ${user.token}` },
      // },
    });

    if (res.status === 200) {
      this.setState({ list: res.data.data || [], source: res.data.data });
    }
  };

  toggleSelect = (item, full) => {
    const { justOne } = this.props;
    const selected = this.state.selected;

    if (justOne) {
      return this.setState({ selected: [item], full });
    }
    const index = selected.findIndex((val) => val.sector_id == item.sector_id);
    if (index >= 0) selected.splice(index, 1);else
    {
      //   if (selected.length === 3) return alert("Hanya bisa memilih 3 kategori pekerjaan");
      selected.push(item);
    }
    this.setState({ selected });
  };

  handleSave = () => {
    this.props.onSave(this.state.selected, this.state.full);
    this.setState({ text: "" }, () => this.props.onClose());
  };

  render() {
    const { visible, onClose, language } = this.props;
    const { list, text, selected } = this.state;
    return (
      <Modal
        visible={visible}
        onRequestClose={onClose}
        animationType="slide"
        transparent={true} // Membuat modal transparan
        onShow={() => {
          // Fokus pada TextInput saat modal dibuka
          this.inputRef.focus();
        }}>

        
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView style={styles.safeArea}>

        <View style={{ backgroundColor: '#fff', flex: 1, paddingTop: 10, paddingHorizontal: 12 }}>
          <Row style={styles.header}>
            <Col size={1}>
              <TouchableOpacity onPress={onClose}>
                <AntDesign name="close" color={Colors.black} size={24} />
              </TouchableOpacity>
            </Col>
            <Col size={4}>
              <TouchableOpacity onPress={onClose}>
                <Text size={16} type='bold'>Pilih Sektor</Text>
              </TouchableOpacity>
            </Col>
            <Col style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={() => this.setState({ selected: [] })}>
                <Text size={16} type='bold' textAlign='right' color={Colors.main}>RESET</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row style={styles.searchBox}>
            <Col>
              <TextInput
                    style={{ padding: 0, margin: 0, color: '#000' }}
                    ref={(ref) => this.inputRef = ref}
                    autoFocus
                    placeholder="Cari"
                    placeholderTextColor={'#ddd'}
                    onChangeText={(text) => this.handleSearchInput(text)}
                    value={this.state.text}
                    // returnKeyType="search"
                    // onSubmitEditing={({ nativeEvent }) => {
                    // const query = nativeEvent.text;
                    // this.onPressSearch(query)
                    // // Bisa panggil fungsi pencarian di sini
                    // }}
                  />
            </Col>
            <Col size={1}>
              <Feather name="search" size={14} />
            </Col>
          </Row>
          {selected.length > 0 &&
              <Row style={{ flexWrap: "wrap" }}>
              {selected.map((item, idx) =>
                <TouchableOpacity key={idx} onPress={() => this.toggleSelect(item)} style={styles.tag}>
                  <Text size={12} color={Colors.black}>
                    {item.sector} x
                  </Text>
                </TouchableOpacity>
                )}
            </Row>
              }
            <ScrollView contentContainerStyle={{ marginTop: 16 }} keyboardShouldPersistTaps="handled">
              {list.map((item, idx) =>
                <TouchableOpacity key={idx} onPress={() => this.toggleSelect(item)} style={{ marginVertical: 8 }}>
                  <Row style={{}}>
                    <Col size={11}>
                      <Text size={14} color={Colors.text} type="medium">{item.sector} </Text>
                    </Col>
                     <Col style={{ alignItems: 'flex-end' }}>
                          {selected.some((vale) => vale.sector == item.sector) ? <FontAwesome style={{ textAlign: 'right' }} name='check-square' color={Colors.main} size={20} /> : <FontAwesome style={{ textAlign: 'right' }} name='square-o' color={'#8F8F8F'} size={20} />}
                      </Col>
                  </Row>
                </TouchableOpacity>
                )}
            </ScrollView>
            <TouchableOpacity onPress={this.handleSave} style={styles.saveBtn}>
              <Text size={16} type="bold" color={Colors.white}>
                {t(language, 'simpan')}
              </Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
        </View>
      </Modal>);

  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width
  },
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    alignItems: "center",
    marginLeft: -10,
    paddingLeft: 10,
    marginBottom: 10
  },
  searchBox: {
    backgroundColor: "#D4FFF4",
    alignItems: "center",
    padding: 10,
    borderRadius: 6
  },
  input: {
    padding: 0,
    margin: 0
  },
  tag: {
    backgroundColor: "#E2E2FF",
    marginRight: 5,
    marginBottom: 5,
    padding: 5,
    borderRadius: 4
  },
  saveBtn: {
    backgroundColor: Colors.main,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 4,
    marginTop: 14,
    marginBottom: 14
  }
});

export default ModalSector;
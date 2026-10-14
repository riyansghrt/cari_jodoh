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
import { Row, Col } from "./Grid";
import { Colors } from "./Colors";
import { apiCall } from "../providers/rest/RequestApi";
import Text from "./Text";
import { searchByName, searchByNameCompany, searchByNameSector } from "./FormatType";

const { height, width } = Dimensions.get("window");

class ModalCompany extends Component {
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
        const result = searchByNameCompany(this.state.text, this.state.source);

        this.setState({ list: result });
      }, 1000); // 1 detik
    }

  };

  fetchSearch = async () => {
    const { user } = this.props.user;

    const res = await apiCall({
      method: "GET",
      url: `data/employer`
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
    const index = selected.findIndex((val) => val.id == item.id);
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
    const { visible, onClose } = this.props;
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
                  <Feather name="chevron-left" color={Colors.main} size={24} />
                </TouchableOpacity>
              </Col>
              <Col>
                <Row style={styles.searchBox}>
                  <Col size={1}>
                    <Feather name="search" size={14} />
                  </Col>
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
                </Row>
              </Col>
            </Row>
            {selected.length > 0 &&
              <Row style={{ flexWrap: "wrap" }}>
                {selected.map((item, idx) =>
                <TouchableOpacity key={idx} onPress={() => this.toggleSelect(item)} style={styles.tag}>
                    <Text size={12} color={Colors.black}>
                      {item.company_name} x
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
                      <Text size={14} color={Colors.text} type="medium">{item.company_name} </Text>
                    </Col>
                    {selected.length > 0 && <Col style={{ alignItems: 'flex-end' }}>
                          {selected.some((vale) => vale.company_name == item.company_name) && <Feather name='check' color={Colors.main} size={16} />}
                        </Col>}
                  </Row>
                </TouchableOpacity>
                )}
            </ScrollView>
            <TouchableOpacity onPress={this.handleSave} style={styles.saveBtn}>
              <Text size={16} type="bold" color={Colors.white}>
                Simpan
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
    marginBottom: 10,
    marginLeft: -10
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
    margin: 16
  }
});

export default ModalCompany;
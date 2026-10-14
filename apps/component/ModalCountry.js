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
  ActivityIndicator,
  StatusBar } from
"react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { Row, Col } from "./Grid";
import { Colors } from "./Colors";
import { apiCall, URL_PAYMENT } from "../providers/rest/RequestApi";
import Text from "./Text";
import { onCheckLocation } from "../state/actions/user/Auth";
import { searchByName } from "./FormatType";

const { height, width } = Dimensions.get("window");

const dataCountry = [
// { "name": "Indonesia" },
{ "name": "Amerika" },
// { "name": "Arab Saudi" },
{ "name": "Taiwan" },
{ "name": "Singapura" },
// { "name": "Hong Kong" },
// { "name": "Uni Emirat Arab" },
// { "name": "Korea Selatan" },
{ "name": "Jepang" }
// { "name": "Amerika Serikat" },
// { "name": "Australia" },
// { "name": "Kanada" },
// { "name": "Filipina" },
// { "name": "Tiongkok" },
// { "name": "Qatar" },
// { "name": "Bahrain" },
// { "name": "Mesir" },
// { "name": "Yaman" },
// { "name": "Jerman" },
// { "name": "Inggris" },
// { "name": "Swiss" }
];


class ModalCountry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: dataCountry,
      text: "",
      full: null,
      selected: props.selected || [],
      request: false,
      latlng: null,
      source: dataCountry
    };
    this.typingTimeout = null;
    // this.first()
  }


  handleSearchInput = (text) => {
    this.setState({ text: text, request: true });
    // Hapus timer sebelumnya
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Set timer baru
    this.typingTimeout = setTimeout(() => {
      const result = searchByName(this.state.text, this.state.source);
      this.setState({ list: result, request: false });
    }, 1000); // 1 detik
  };

  first = async () => {
    const { user } = this.props.user;

    const res = await apiCall({
      method: "GET",
      url: URL_PAYMENT + '/api/other/country',
      data: {
        headers: { Authorization: user ? 'Bearer ' + user.token : undefined }
      }
    });

    if (res.status === 200) {
      this.setState({ source: res.data.data || [], request: false });
    }
  };


  toggleSelect = (item, full, del) => {
    const { justOne } = this.props;
    if (justOne) {
      if (del) {
        return this.setState({ selected: [], full: null });
      }
      return this.setState({ selected: [item], full });
    }
    const selected = [...this.state.selected];


    const index = selected.indexOf(item);
    if (index >= 0) selected.splice(index, 1);else
    {
      // if (selected.length === 3) return alert("Hanya bisa memilih 3 lokasi");
      selected.push(item);
    }
    this.setState({ selected });
  };

  handleSave = () => {
    this.props.onSave(this.state.selected, this.state.full);
    this.setState({ text: "" }, () => this.props.onClose());
  };

  onSubmitJustOne = (data, full) => {
    this.setState({ selected: data, full }, () => this.handleSave());
  };

  render() {
    const { visible, onClose } = this.props;
    const { list, text, selected, request } = this.state;

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
        <SafeAreaView style={[styles.safeArea]}>
          <View style={{ flex: 1, backgroundColor: '#fff', height, paddingHorizontal: 12 }}>
        <Row style={styles.header}>
              <Col size={1}>
                <TouchableOpacity onPress={onClose}>
                  <Feather name="chevron-left" color={Colors.main} size={24} />
                </TouchableOpacity>
              </Col>
              <Col>
                <Row style={styles.searchBox}>
                  {/* <Col size={1}>
                       <Feather name="search" size={14} />
                      </Col> */}
                  <Col>
                    <TextInput
                        ref={(ref) => this.inputRef = ref}
                        placeholder="Pilih Negara"
                        placeholderTextColor={'#000'}
                        value={text}
                        editable={false}
                        onChangeText={this.handleSearchInput}
                        style={styles.input}
                        // autoFocus
                      />
                  </Col>
                </Row>
              </Col>
            </Row>
            
            {!request && selected.length > 0 &&
              <Row style={{ flexWrap: "wrap" }}>
                {selected.map((item, idx) =>
                <TouchableOpacity key={idx} onPress={() => {this.props.justOne ? this.onSubmitJustOne([], item) : this.toggleSelect(item, item, 'delete');}} style={styles.tag}>
                    <Text size={12} color={Colors.black}>
                      {item} x
                    </Text>
                  </TouchableOpacity>
                )}
              </Row>
              }
            <ScrollView style={{ marginTop: 16 }} keyboardShouldPersistTaps="handled">
              {!request && list.map((item, idx) =>
                <TouchableOpacity key={idx} onPress={() => {this.props.justOne ? this.onSubmitJustOne([item.name], item) : this.toggleSelect(item.name, item);}} style={{ marginVertical: 7 }}>
                  <Row>
                    <Col size={11}>
                      <Text size={14} type="medium">
                        {item.name} (Coming soon)
                      </Text>
                    </Col>
                    {selected.length > 0 && <Col style={{ alignItems: 'flex-end' }}>
                        {selected.some((vale) => vale == item.name) && <Feather name='check' color={Colors.main} size={16} />}
                      </Col>}
                  </Row>
                </TouchableOpacity>
                )}
              {request && <ActivityIndicator size={'large'} />}
            </ScrollView>
            {!this.props.justOne && <TouchableOpacity onPress={this.handleSave} style={styles.saveBtn}>
              <Text size={16} type="bold" color={Colors.white}>
                Simpan
              </Text>
            </TouchableOpacity>}
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
    marginTop: 5,
    marginBottom: 10
  },
  searchBox: {
    backgroundColor: "#D4FFF4",
    alignItems: "center",
    padding: 10,
    borderRadius: 6
  },
  input: {
    color: '#000',
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
    margin: 20
  }
});

export default ModalCountry;
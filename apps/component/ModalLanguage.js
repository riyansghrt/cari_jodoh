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
  Keyboard,
  ActivityIndicator,
  StatusBar } from
"react-native";
import Feather from "react-native-vector-icons/Feather";
import { Row, Col } from "./Grid";
import { Colors } from "./Colors";
import { apiCall } from "../providers/rest/RequestApi";
import Text from "./Text";
import Toast from 'react-native-simple-toast';
import { searchByName } from "./FormatType";

const { height, width } = Dimensions.get("window");

class ModalLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [{
        name: 'Inggris'
      }, {
        name: 'Indonesia'
      }, {
        name: 'Spanyol'
      }, {
        name: 'Jepang'
      }, {
        name: 'Mandarin'
      }, {
        name: 'Perancis'
      }],
      text: "",
      full: null,
      selected: props.selected || [],
      source: [{
        name: 'Inggris'
      }, {
        name: 'Indonesia'
      }, {
        name: 'Spanyol'
      }, {
        name: 'Jepang'
      }, {
        name: 'Mandarin'
      }, {
        name: 'Perancis'
      }]
    };
    this.typingTimeout = null;
  }

  handleSearchInput = (text) => {
    this.setState({ text: text });
    // if(text.length > 1){
    // Hapus timer sebelumnya
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Set timer baru
    this.typingTimeout = setTimeout(() => {
      const result = searchByName(this.state.text, this.state.source);

      this.setState({ list: result });
    }, 1000); // 1 detik
    // }

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

  handleSave = (data) => {
    this.props.onSave(data);
    this.setState({ text: "" }, () => this.props.onClose());
  };

  render() {
    const { visible, onClose } = this.props;
    const { list, text, selected, request } = this.state;

    return (
      <Modal
        visible={visible}
        onRequestClose={onClose}
        animationType="slide"
        statusBarTranslucent={false} // pastikan false
        transparent={false} // Membuat modal transparan
        onShow={() => {
          // Fokus pada TextInput saat modal dibuka
          this.inputRef.focus();
        }}>


      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView style={[styles.safeArea]}>
          <View style={{ backgroundColor: '#fff', flex: 1 }}>
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
                        ref={(ref) => this.inputRef = ref}
                        placeholder="Cari disini"
                        placeholderTextColor={'#bcbcbc'}
                        value={text}
                        onChangeText={this.handleSearchInput}
                        style={styles.input}
                        autoFocus />

                  </Col>
                </Row>
              </Col>
            </Row>
            <ScrollView style={{ marginTop: 16, paddingHorizontal: 16 }} keyboardShouldPersistTaps="handled">
             
            {request && <ActivityIndicator size={'large'} />}
              {list.length == 0 && !request && <TouchableOpacity onPress={() => this.handleSave(text)} style={{ marginVertical: 7 }}>
                  <Row>
                    <Col size={11}>
                      <Text size={14} type="medium">
                        {text}
                      </Text>
                    </Col>
                  </Row>
                </TouchableOpacity>}
              {!request && list.map((item, idx) =>
                <TouchableOpacity key={idx} onPress={() => this.handleSave(item.name)} style={{ marginVertical: 7 }}>
                  <Row>
                    <Col size={11}>
                      <Text size={14} type="medium">
                        {item.name}
                      </Text>
                    </Col>
                    {/* <Col style={{ alignItems: "flex-end" }}>
                       <Feather name="search" size={16} />
                      </Col> */}
                  </Row>
                </TouchableOpacity>
                )}
              
            </ScrollView>
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
    // backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    marginTop: 20,
    alignItems: "center",
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
    margin: 16
  }
});

export default ModalLanguage;

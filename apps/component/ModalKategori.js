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
import Toast from 'react-native-simple-toast';
import { searchByName } from "./FormatType";
import { t } from "../state/lang/UseLanguage";

const { height, width } = Dimensions.get("window");

function getNameByLang(data, lang) {
  const map = {
    id: 'name',
    en: 'name_en',
    jp: 'name_ja',
    zh: 'name_ch'
  };
  const key = map[lang] || 'name'; // default ke 'id'
  return data[key] || '';
}


class ModalKategori extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.datasource,
      text: "",
      full: null,
      selected: props.selected || [],
      requesting: true,
      source: []
    };
    this.typingTimeout = null;
    this.fetchSearch();
  }

  handleSearchInput = (text) => {
    this.setState({ text: text });
    if (text.length > 0) {
      // Hapus timer sebelumnya
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }

      // Set timer baru
      this.typingTimeout = setTimeout(() => {
        const result = searchByName(this.state.text, this.state.source);

        this.setState({ list: result });
      }, 1000); // 1 detik
    }

  };

  fetchSearch = async () => {
    const { user } = this.props.user;

    const res = await apiCall({
      method: "GET",
      url: 'data/kategori-pekerjaan'
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
    const { visible, onClose, language } = this.props;
    const { list, text, selected } = this.state;

    return (
      <Modal
        visible={visible}
        onRequestClose={onClose}
        animationType="slide"
        transparent={true} // Membuat modal transparan
      >

      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView style={styles.safeArea}>
          <View style={{ backgroundColor: '#fff', flex: 1, paddingHorizontal: 12, paddingTop: 10 }}>
            <Row style={styles.header}>
              <Col size={1}>
                <TouchableOpacity onPress={onClose}>
                  <AntDesign name="close" color={Colors.black} size={24} />
                </TouchableOpacity>
              </Col>
              <Col size={4}>
                <TouchableOpacity onPress={onClose}>
                  <Text size={16} type='bold'>Pilih Kategori</Text>
                </TouchableOpacity>
              </Col>
              <Col style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => this.setState({ selected: [] })}>
                  <Text size={16} type='bold' textAlign='right' color={Colors.main}>RESET</Text>
                </TouchableOpacity>
              </Col>
            </Row>
            <Row style={{ backgroundColor: '#D4FFF4', padding: 10, borderRadius: 6 }}>
             
              <Col style={{}}>
                <TextInput
                    style={{ padding: 0, margin: 0, color: '#000', width: '100%' }}
                    placeholder={t(language, "cari")}
                    placeholderTextColor={"#bcbcbc"}
                    onChangeText={(text) => this.handleSearchInput(text)}
                    value={this.state.text} />

              </Col>
               <Col size={1} style={{ justifyContent: 'center' }}>
                <Feather name='search' size={14} />
              </Col>
            </Row>
            {/* {selected.length > 0 && (
                 <Row style={{ flexWrap: "wrap", }}>
                   {selected.map((item, idx) => (
                     <TouchableOpacity key={idx} onPress={() => this.toggleSelect(item)} style={styles.tag}>
                       <Text size={12} color={Colors.black}>
                         {getNameByLang(item, language)} x
                       </Text>
                     </TouchableOpacity>
                   ))}
                 </Row>
                )} */}
            <ScrollView style={{ marginTop: 16, marginHorizontal: -12, paddingHorizontal: 14 }} keyboardShouldPersistTaps="handled">
              {list.map((item, idx) =>
                <TouchableOpacity key={idx} onPress={() => this.toggleSelect(item)} style={{ marginBottom: 8 }}>
                  <Row style={{}}>
                    <Col size={11}>
                      <Text size={14} color={Colors.text} type="medium">{getNameByLang(item, language)} </Text>
                    </Col>
                     <Col style={{ alignItems: 'flex-end' }}>
                      {selected.some((vale) => vale.name == item.name) ? <FontAwesome style={{ textAlign: 'right' }} name='check-square' color={Colors.main} size={20} /> : <FontAwesome style={{ textAlign: 'right' }} name='square-o' color={'#8F8F8F'} size={20} />}
                    </Col>
                  </Row>
                </TouchableOpacity>
                )}
            </ScrollView>
            <TouchableOpacity onPress={this.handleSave} style={styles.saveBtn}>
              <Text size={16} type="bold" color={Colors.white}>
                simpan
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

export default ModalKategori;
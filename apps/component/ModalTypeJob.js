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
  StatusBar } from
"react-native";
import Feather from "react-native-vector-icons/Feather";
import { Row, Col } from "./Grid";
import { Colors } from "./Colors";
import { apiCall } from "../providers/rest/RequestApi";
import Text from "./Text";
import FormatType from "./FormatType";

import Toast from 'react-native-simple-toast';
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

class ModalTypeJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.datasource,
      text: "",
      full: null,
      selected: props.selected || []
    };
    this.typingTimeout = null;

  }

  handleSearchInput = (text) => {
    this.setState({ text });
    if (text.length > 2) {
      if (this.typingTimeout) clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(this.fetchSearch, 1000);
    }
  };

  fetchSearch = async () => {
    const { user } = this.props.user;

    const res = await apiCall({
      method: "GET",
      url: `data/lokasi/merge?tipe_daerah=kota&search=${this.state.text}`,
      data: {
        headers: { Authorization: `Bearer ${user.token}` }
      }
    });
    if (res.status === 200) {
      this.setState({ list: res.data.data || [] });
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
        <SafeAreaView style={[styles.safeArea, {}]}>
          <View style={{ backgroundColor: '#fff', flex: 1, paddingTop: 15, paddingHorizontal: 12 }}>
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
                    <Text>{t(language, 'pilih_tipe_pekerjaan')}</Text>
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* {selected.length > 0 && (
                 <Row style={{ flexWrap: "wrap" }}>
                   {selected.map((item, idx) => (
                     <TouchableOpacity key={idx} onPress={() => this.toggleSelect(item)} style={styles.tag}>
                       <Text size={12} color={Colors.black}>
                         {FormatType(item.name)} x
                       </Text>
                     </TouchableOpacity>
                   ))}
                 </Row>
                )} */}
            <ScrollView style={{ marginTop: 16, marginHorizontal: -12 }} keyboardShouldPersistTaps="handled">
              {list.map((item, idx) =>
                <TouchableOpacity key={idx} onPress={() => this.toggleSelect(item)} style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: selected.some((vale) => vale.name == item.name) ? '#dcfce7' : '#fff' }}>
                  <Row style={{}}>
                    <Col size={11}>
                      <Text size={14} color={selected.some((vale) => vale.name == item.name) ? Colors.main : Colors.text} type="medium">{FormatType(getNameByLang(item, language))} </Text>
                    </Col>
                    {selected.length > 0 && <Col style={{ alignItems: 'flex-end' }}>
                      {selected.some((vale) => vale.name == item.name) && <View style={{ height: 14, width: 14, justifyContent: 'center', alignItems: 'center', borderRadius: 7, backgroundColor: Colors.main }}>
                        <Feather name='check' style={{ textAlign: 'center' }} color={Colors.white} size={10} />
                        </View>}
                    </Col>}
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

export default ModalTypeJob;
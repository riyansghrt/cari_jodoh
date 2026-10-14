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
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { Row, Col } from "./Grid";
import { Colors } from "./Colors";
import { apiCall } from "../providers/rest/RequestApi";
import Text from "./Text";
import { onCheckLocation } from "../state/actions/user/Auth";
import { t } from "../state/lang/UseLanguage";
import FormatType from "./FormatType";

const { height, width } = Dimensions.get("window");

class ModalSearchCity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      text: "",
      full: null,
      selected: props.selected || [],
      request: true,
      latlng: null
    };
    this.typingTimeout = null;
    this.first();
  }

  getCurrent = async () => {
    const locUser = await onCheckLocation();

    if (locUser.status) {
      this.setState({ latlng: locUser.latitude + ',' + locUser.longitude });
      this.props.onSaveMyLocation([...this.state.selected, 'Lokasi Saya'], { name: 'Lokasi Saya', latlng: locUser.latitude + ',' + locUser.longitude });this.props.onClose();

    }
  };

  handleSearchInput = (text) => {
    this.setState({ text });
    // if (text.length > 1) {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    this.setState({ request: true });
    this.typingTimeout = setTimeout(this.fetchSearch, 1000);
    // }
  };

  first = async () => {

    const res = await apiCall({
      method: "GET",
      url: `data/lokasi/merge?tipe_daerah=kota&limit=50`
    });

    if (res.status === 200) {
      this.setState({ list: res.data.data || [], request: false });
    }
  };

  fetchSearch = async () => {

    const res = await apiCall({
      method: "GET",
      url: `data/lokasi/merge?tipe_daerah=kota&limit=50&search=${this.state.text}`
    });

    if (res.status === 200) {
      this.setState({ list: res.data.data || [], request: false });
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
    const selected = this.state.selected;


    // const index = selected.indexOf(item);
    const index = selected.findIndex((ele) => ele.nama == full.nama);

    if (index >= 0) selected.splice(index, 1);else
    {
      if (selected.length === 5) return alert("Hanya bisa memilih 5 lokasi");
      selected.push(full);
    }
    this.setState({ selected: selected });
  };

  handleSave = () => {
    this.props.onSave(this.state.selected, this.state.full);
    this.setState({ text: "" }, () => this.props.onClose());
  };

  onSubmitJustOne = (data, full) => {
    this.setState({ selected: [data], full }, () => this.handleSave());
  };

  render() {
    const { visible, onClose, language } = this.props;
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
          <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 12 }}>
            <Row style={styles.header}>
              <Col size={1}>
                <TouchableOpacity onPress={onClose}>
                  <AntDesign name="close" color={Colors.black} size={24} />
                </TouchableOpacity>
              </Col>
              <Col size={4}>
                <TouchableOpacity onPress={onClose}>
                  <Text size={16} type='bold'>Pilih Kota</Text>
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
                    ref={(ref) => this.inputRef = ref}
                    placeholder={t(language, 'cari')}
                    placeholderTextColor={'#bcbcbc'}
                    value={text}
                    onChangeText={this.handleSearchInput}
                    style={styles.input}
                    // autoFocus
                  />
              </Col>
              <Col size={1}>
                <Feather name="search" size={14} />
              </Col>
            </Row>
            {/* {this.props.home && <TouchableOpacity onPress={() => {this.getCurrent() }} style={{ marginVertical: 7 }}>
                 <Row>
                   <Col size={12} style={{  }}>
                     <Row style={{ alignItems: 'center' }}>
                       <MaterialIcons name='my-location' style={{ marginRight: 4 }} size={15} color={Colors.main} /> 
                       <Text size={14} type="medium">
                         {t(language, 'gunakan_lokasi_saya')}
                       </Text>
                     </Row>
                   </Col>
                 </Row>
                </TouchableOpacity>} */}
            {/* {selected.length > 0 && (
                 <Row style={{ flexWrap: "wrap" }}>
                   {selected.map((item, idx) => (
                     <TouchableOpacity key={idx} onPress={() => {this.props.justOne ? this.onSubmitJustOne([item.nama], item) : this.toggleSelect(item,item,'delete')}} style={styles.tag}>
                       <Text size={12} color={Colors.black}>
                         {item.nama} x
                       </Text>
                     </TouchableOpacity>
                   ))}
                 </Row>
                )} */}
            <ScrollView style={{ marginTop: 16, marginHorizontal: -12, paddingHorizontal: 12 }} keyboardShouldPersistTaps="handled">
              {!request && list.map((item, idx) =>
                <TouchableOpacity key={idx} onPress={() => {this.props.justOne ? this.onSubmitJustOne([item.nama], item) : this.toggleSelect(item.nama, item);}} style={{ marginVertical: 7 }}>
                  <Row>
                    <Col size={11}>
                      <Text size={14} type="medium">
                        {FormatType(item.nama)}
                      </Text>
                    </Col>
                  {!this.props.justOne && <Col style={{ alignItems: 'flex-end' }}>
                        {selected.some((vale) => vale.nama == item.nama) ? <FontAwesome style={{ textAlign: 'right' }} name='check-square' color={Colors.main} size={20} /> : <FontAwesome style={{ textAlign: 'right' }} name='square-o' color={'#8F8F8F'} size={20} />}
                  </Col>}
                  </Row>
                </TouchableOpacity>
                )}
              {request && <ActivityIndicator size={'large'} />}
            </ScrollView>
            {!this.props.justOne && <TouchableOpacity onPress={this.handleSave} style={styles.saveBtn}>
              <Text size={16} type="bold" color={Colors.white}>
                {t(language, 'simpan')}
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
    paddingTop: 12,
    paddingLeft: 10,
    marginBottom: 10
  },
  searchBox: {
    backgroundColor: "#fff",
    alignItems: "center",
    borderColor: '#C1C1C1',
    borderWidth: 1,
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

export default ModalSearchCity;
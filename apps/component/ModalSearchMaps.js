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

function cleanAddress(address) {
  // Jika diawali dengan Plus Code (4+ karakter huruf/angka dan tanda +)
  return address.replace(/^[A-Z0-9+]{6,},\s*/i, '');
}

function getDistanceText(data) {
  return data?.[0]?.elements?.[0]?.distance?.text || "";
}

function truncate(text, limit = 83) {
  return text.length > limit ? text.substring(0, limit) + "..." : text;
}

const { height, width } = Dimensions.get("window");

class ModalSearchMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      text: "",
      full: null,
      selected: props.selected || []
      // request: true
    };
    this.typingTimeout = null;
    this.getDistance();
  }

  handleSearchInput = (text) => {
    this.setState({ text });
    // if (text.length > 1) {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    this.setState({ request: true });
    this.typingTimeout = setTimeout(this.fetchSearch, 1000);
    // }
  };

  getDistance = async (templa) => {
    const { currentLatLng } = this.props;

    const res = await apiCall({
      method: "POST",
      baseURL: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${currentLatLng.latitude},${currentLatLng.longitude}&destinations=${templa}&key=AIzaSyAtlMiMXneYwdzz_NcaSGvngxNnIOj9JjY`
    });

    if (res.status == 200 || res.status == 201) {
      return getDistanceText(res.data.rows);
    } else {
      return "";
    }
  };

  getSearchCountryCode = () =>
  String(this.props?.countryCode || "ID").
  trim().
  toUpperCase() || "ID";

  fetchSearch = async () => {

    if (!this.state.text) return this.setState({ request: false });
    const countryCode = this.getSearchCountryCode();
    const res = await apiCall({
      method: "POST",
      baseURL: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + encodeURIComponent(this.state.text) + '&components=country:' + countryCode + '&language=id&key=AIzaSyAtlMiMXneYwdzz_NcaSGvngxNnIOj9JjY'
    });

    if (res.status === 200) {
      const updatedData = [];
      for (const ele of res.data.predictions) {
        const hobi = await this.getDistance(ele.description);
        updatedData.push({ ...ele, distance: hobi });
      }
      this.setState({ list: updatedData || [], request: false }, () => undefined);
    }
  };

  detailLocation = async (dataq) => {

    const res = await apiCall({
      method: "POST",
      baseURL: 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + dataq.place_id + '&language=id&key=AIzaSyAtlMiMXneYwdzz_NcaSGvngxNnIOj9JjY'
    });

    if (res.status === 200) {
      this.handleSave(res.data.result);
      //   this.setState({ list: res.data.results || [], request: false });
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
          <View style={{ backgroundColor: '#fff', flex: 1, paddingTop: Platform.OS == 'ios' ? 0 : 12 }}>
        <Row style={styles.header}>
              <Col size={1}>
                <TouchableOpacity onPress={onClose} style={{ paddingLeft: 4 }}>
                  <Feather name="chevron-left" color={Colors.main} size={24} />
                </TouchableOpacity>
              </Col>
              <Col>
                <Row style={styles.searchBox}>
                  <Col size={1.2}>
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
              {!request && list.map((item, idx) =>
                <TouchableOpacity key={idx} onPress={() => this.detailLocation(item)} style={{ paddingBottom: 7, paddingTop: idx == 0 ? 0 : 7 }}>
                  <Row>
                    <Col size={1.5} style={{ alignItems: 'center' }}>
                      <Row>
                        <View style={{ backgroundColor: '#bcbcbc30', padding: 8, borderRadius: 20 }}>
                          <Feather name='map-pin' size={14} />
                        </View>
                      </Row>
                      <Text size={9} textAlign='center'>{item?.distance ? item.distance.replace(/,/g, ".") : ""}</Text>
                    </Col>
                    <Col size={9.5} style={{ paddingLeft: 6 }}>
                      <Text size={13} type='semiBold' style={{ marginBottom: 2 }}>{item.description.split(",")[0].trim()}</Text>
                      <Text size={11} type="regular">
                        {truncate(item.description.split(",").slice(1).join(",").trim())}
                      </Text>
                    </Col>
                    <Col style={{ alignItems: "flex-end", justifyContent: 'center' }}>
                      <Feather name="arrow-up-left" size={16} />
                    </Col>
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

export default ModalSearchMaps;
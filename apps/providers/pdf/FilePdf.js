import React from 'react';
import { StyleSheet, Dimensions, View, ScrollView, Platform, PermissionsAndroid, Alert, Text, TouchableHighlight } from 'react-native';
import Share from 'react-native-share';
import { connect } from "react-redux";
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { Colors } from '../../component/Colors';
import Header from '../../component/Header';
import Button from '../../component/Button';
const WIN_WIDTH = Dimensions.get('window').width;
const WIN_HEIGHT = Dimensions.get('window').height;
import RNFetchBlob from 'react-native-blob-util';
import Toast from 'react-native-simple-toast';
import FileViewer from 'react-native-file-viewer'; // opsional, jika ingin langsung buka
import { hideLoading, showLoading } from '../../component/LoadingService';
import { ShowToast } from '../../component/ShowToast';


class FilePdf extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      page: 1,
      scale: 1,
      numberOfPages: 0,
      horizontal: false,
      width: WIN_WIDTH,
      isDownload: false,
      showError: false,
      pdfFile: ''
    };
    this.pdf = null;

  }

  async componentDidMount() {
    // showLoading()
    if (Platform.OS != 'ios') {
      const path = await this.downloadPdfInternal(this.props.route.params.item.url + '?ts=' + Date.now(), 'laporan.pdf');
      this.setState({ pdfFile: 'file://' + path });
      hideLoading();
    }
  }

  downloadPdfInternal = async (url, fileName = 'dokumen.pdf') => {
    const path = `${RNFetchBlob.fs.dirs.DocumentDir}/${fileName}`;
    try {
      const res = await RNFetchBlob.config({
        path: path, // Simpan ke internal (no permission needed)
        fileCache: false
      }).fetch('GET', url);

      return res.path(); // full absolute path
    } catch (err) {
      console.error('Gagal download PDF:', err);
      throw err;
    }
  };

  downloadToRealDownloadFolder = async (url, fileName = 'cv.pdf') => {
    const path = `/storage/emulated/0/Download/${fileName}`; // hardcode ke folder publik

    try {
      const res = await RNFetchBlob.config({
        path,
        fileCache: false,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path,
          description: 'Mengunduh file...'
        }
      }).fetch('GET', url + '?ts=' + Date.now());

      ShowToast(`File berhasil disimpan`);
    } catch (err) {
      this.onDownload();
      console.error('Download error:', err);
      // Alert.alert('Gagal', 'Terjadi kesalahan saat download.');
    }
  };

  requestPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Izin Penyimpanan',
          message: 'Aplikasi memerlukan izin untuk menyimpan file ke folder Download.',
          buttonPositive: 'OK'
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true; // Android 13+ tidak pakai permission ini lagi
  };

  downloadAndOpen = async () => {
    const { item } = this.props.route.params;
    const FILE_URL = item.url;
    const { user, token } = this.props.user;
    // alert(user.nama)
    if (Platform.OS != 'ios') return this.downloadToRealDownloadFolder(item.url, `CV-${user.nama}.pdf`);

    const { fs, ios } = RNFetchBlob;

    const path = `${fs.dirs.DocumentDir}/CV-${user.nama}.pdf`;

    try {
      const res = await RNFetchBlob.config({
        fileCache: false,
        path: path
      }).fetch('GET', FILE_URL);

      if (Platform.OS === 'ios') {
        Share.open({
          url: 'file://' + path,
          type: 'application/pdf',
          showAppsToView: true
        }).
        then((res) => undefined).
        catch((err) => undefined);
        // await FileViewer.open(res.path(), {
        //     showOpenWithDialog: true, // tampilkan opsi aplikasi jika ada lebih dari satu
        // });
        // // await ios.scanFile(res.path()); // agar file muncul di Files app
      }
      if (Platform.OS == 'ios') ShowToast(`Pilih simpan file`);


      // Opsional: langsung buka file
      // await FileViewer.open(res.path());
    } catch (err) {
      console.error('Gagal download atau buka file', err);
      ShowToast('Gagal mengunduh file.');
    }
  };

  prePage = () => {
    let prePage = this.state.page > 1 ? this.state.page - 1 : 1;
    this.pdf.setPage(prePage);

  };

  nextPage = () => {
    let nextPage = this.state.page + 1 > this.state.numberOfPages ? this.state.numberOfPages : this.state.page + 1;
    this.pdf.setPage(nextPage);

  };

  zoomOut = () => {
    let scale = this.state.scale > 1 ? this.state.scale / 1.2 : 1;
    this.setState({ scale: scale });

  };

  zoomIn = () => {
    let scale = this.state.scale * 1.2;
    scale = scale > 3 ? 3 : scale;
    this.setState({ scale: scale });

  };

  switchHorizontal = () => {
    this.setState({ horizontal: !this.state.horizontal, page: this.state.page });
  };

  onDownload = () => {
    this.setState({ isDownload: true });
    setTimeout(() => {
      this.setState({ isDownload: false });
    }, 2000);
  };

  render() {
    const { showError } = this.state;
    const { item } = this.props.route.params;
    // const source = {
    //     uri: `https://storage.googleapis.com/carikerja/jobseeker/cv/carikerja-2c42b05f-c6b3-4dea-835e-714a04b0df8f.pdf`,
    //     cache: true,
    //   };

    //   const pdfUrl = 'https://storage.googleapis.com/carikerja/jobseeker/cv/carikerja-a99159a1-b5c9-4de4-b307-061f20cab424.pdf';
    // const viewerUrl = Platform.OS == 'ios' ? item.url : 'https://docs.google.com/gview?embedded=true&url='+encodeURIComponent(item.url)
    const viewerUrl = Platform.OS == 'ios' ? item.url : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(item.url)}`;


    return (
      <View style={{ flex: 1, backgroundColor: '#2c2c2c' }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1, backgroundColor: '#2c2c2c' }}>
                    <Header title='File PDF' showLeftButton navigation={this.props.navigation} />
                        {Platform.OS == 'ios' ? <WebView
              source={{
                uri: viewerUrl
              }}
              onLoadEnd={() => hideLoading()}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              onError={(errorName) => this.setState({ showError: true })}
              style={{ flex: 1, marginTop: 20, backgroundColor: '#bcbcbc' }} /> :


            <>
                            {this.state.pdfFile && <Pdf
                onLoadComplete={(pages, filePath) => {

                }}
                onError={(error) => {

                }}
                source={{ uri: this.state.pdfFile }}
                trustAllCerts={true} // ✅ terima semua sertifikat

                style={{ flex: 1, width: Dimensions.get('window').width }} />
              }
                        </>

            }
                        <Button label='Download' onPress={() => this.downloadAndOpen()} style={{ margin: 24, marginBottom: Platform.OS == 'ios' ? 5 : 10 }} />
                        <View style={{ height: 1 }}>
                        {this.state.isDownload && <WebView
                source={{
                  uri: item.url
                }}

                style={{ height: 1 }} />
              }
                        </View>
                        {/* {this.state.pdfFile && <Pdf
                 onLoadComplete={(pages, filePath) => {
                 }}
                 onError={(error) => {
                 }}
                 source={{uri : this.state.pdfFile}}
                 trustAllCerts={true} // ✅ terima semua sertifikat
                  style={{ flex: 1, width: Dimensions.get('window').width }}
              />} */
            }
                    </View>
                </SafeAreaView>
            </View>);

  }
}


const mapStateToProps = (state) => ({
  user: state["user"]
});

const mapDispatchToProps = (dispatch) => (
{
  onLogin: (body) => {
    dispatch(login(body));
  },
  onLogout: () => {
    dispatch({
      type: 'USER.CLEAR_LOGIN'
    });
  },
  onUpdateLocal: (body) => {
    dispatch(updateProfile(body));
  }
});



export default connect(mapStateToProps, mapDispatchToProps)(FilePdf);

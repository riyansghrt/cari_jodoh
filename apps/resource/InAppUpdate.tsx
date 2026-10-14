/* eslint-disable no-alert */
import React from 'react';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
  StatusUpdateEvent,
  IAUInstallStatus } from
'sp-react-native-in-app-updates';

import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Button,
  Platform,
  Text } from
'react-native';

const BUTTON_COLOR = '#46955f';

const HIGH_PRIORITY_UPDATE = 5; // Arbitrary, depends on how you handle priority in the Play Console
type AppState = {
  needsUpdate: boolean | null;
  otherData?: NeedsUpdateResponse | null;
  error: string | null;
};

export const checkForUpdateApps = async (navigation, name) => {
  const inAppUpdates = new SpInAppUpdates(
    false // isDebug
  );
  // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
  try {
    await inAppUpdates.checkNeedsUpdate({ country: 'id' }).then((result) => {
      try {
        if (result.shouldUpdate) {
          let updateOptions: StartUpdateOptions = {};
          if (Platform.OS === "android") {
            // android only, on iOS the user will be promped to go to your app store page
            updateOptions = {
              updateType: IAUUpdateKind.IMMEDIATE
            };
          }
          if (Platform.OS === "ios") {
            updateOptions = {
              title: "Update available",
              message:
              "There is a new version of the app available on the App Store, do you want to update it?",
              buttonUpgradeText: "Update",
              buttonCancelText: "Cancel"
            };
          }
          inAppUpdates.addStatusUpdateListener((downloadStatus) => {

            if (downloadStatus.status === IAUInstallStatus.DOWNLOADED) {

              inAppUpdates.removeStatusUpdateListener((finalStatus) => {

              });
              inAppUpdates.installUpdate();

            }
          });
          inAppUpdates.startUpdate(updateOptions).catch((e) => {

          });
        } else {
          navigation.replace(name);
        }
      } catch (error) {
        navigation.replace(name);
        // alert(error)
      }
    });
  } catch (error) {
    navigation.replace(name);
    // alert(error)
  }
};


export default class App extends React.Component<{}, AppState> {
  private inAppUpdates: SpInAppUpdates;
  state = {
    needsUpdate: null,
    otherData: null,
    error: null
  };

  constructor(props: any) {
    super(props);
    this.inAppUpdates = new SpInAppUpdates(
      false // debug verbosely
    );
  }

  componentDidMount() {

    checkForUpdateApps();
    // this.checkForUpdates()
  }

  checkForUpdates() {

    this.inAppUpdates.
    checkNeedsUpdate().
    then((result: NeedsUpdateResponse) => {

      this.startUpdating(result);
    }).
    catch((error) => {
      this.setState({
        error
      });

    });
  }

  startUpdating(result) {

    if (result.shouldUpdate) {
      let updateOptions: StartUpdateOptions = {
        updateType: IAUUpdateKind.FLEXIBLE
      };

      this.inAppUpdates.addStatusUpdateListener((downloadStatus) => {
        if (downloadStatus.status === IAUInstallStatus.DOWNLOADED) {
          this.inAppUpdates.removeStatusUpdateListener((finalStatus) => {});
          this.inAppUpdates.installUpdate();
        }
      });

      this.inAppUpdates.startUpdate(updateOptions).catch((e) => {

      });
    }
  }



  onStatusUpdate = (event: StatusUpdateEvent) => {







  };

  render() {
    const { needsUpdate, error } = this.state;
    let statusTxt;
    if (needsUpdate) {
      statusTxt = 'YES';
    } else if (needsUpdate === false) {
      statusTxt = 'NO';
    } else if (error) {
      statusTxt = 'Error, check below';
    } else {
      statusTxt = 'Not sure yet';
    }
    return (
      <>
        <SafeAreaView>
          <View style={styles.container}>
            <View style={styles.aButton}>
              <Button
                title="Check for updates"
                color={BUTTON_COLOR}
                onPress={() => this.checkForUpdates()} />

            </View>
            <View style={styles.aButton}>
              <Button
                title="Start Updating"
                color={BUTTON_COLOR}
                onPress={this.startUpdating} />

            </View>
            <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              // backgroundColor: 'pink'
              alignItems: 'center'
            }}>

              <Text
                style={styles.textStyle}>
                {`Needs update: ${'\n'}${statusTxt}`}</Text>
            </View>
            {error ?
            <View style={styles.errorContainer}>
                <Text style={styles.errorTextStyle}>{`Error: ${error}`}</Text>
              </View> :
            null}
          </View>
        </SafeAreaView>
      </>);

  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: '100%',
    backgroundColor: '#77464C',
    justifyContent: 'center'
  },
  aButton: {
    marginVertical: 25,
    borderRadius: 8,
    marginHorizontal: 50
  },
  textStyle: {
    color: '#d09a9a',
    fontSize: 26,
    textAlign: 'center'
  },
  errorContainer: {
    backgroundColor: 'red'
  },
  errorTextStyle: {
    color: 'black',
    fontSize: 14
  }
});

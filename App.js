// App.js
import * as React from "react";
import AppNavigator from "./apps/AppNavigator";
import SplashScreen from "./apps/resource/SplashScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  LogBox,
  Platform,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { persistor, store } from "./apps/state/ReduxMiddleware";
import "moment/locale/id"; // Indonesia
import "moment/locale/ja"; // Jepang
import "moment/locale/en-gb"; // Inggris (UK)
import "moment/locale/zh-cn";
import "moment/locale/ko"; // Korea
import "moment/locale/de"; // German
import Loading from "./apps/component/Loading";
import { setLoadingRef } from "./apps/component/LoadingService";
import InAppNotification from "./apps/component/InAppNotification";
import { setInAppNotificationRef } from "./apps/component/InAppNotificationService";

import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import {
  POSTHOG_API_KEY,
  POSTHOG_HOST,
  buildPostHogUserIdentity,
  identifyUserProfile,
  isPostHogEnabled,
  setCurrentScreenName,
  setPostHogClient,
  trackAppError,
  trackScreenView,
} from "./apps/services/posthog";

LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
]);

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    trackAppError("screen_crash_caught", error, {
      error_type: "react_error_boundary",
      component_stack: errorInfo?.componentStack || null,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorScreen}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          <View style={styles.errorGlowTop} />
          <View style={styles.errorGlowBottom} />

          <View style={styles.errorCard}>
            <View style={styles.errorBadge}>
              <View style={styles.errorBadgeDot} />
              <Text style={styles.errorBadgeText}>
                Aplikasi Butuh Muat Ulang
              </Text>
            </View>

            <View style={styles.errorIllustrationWrap}>
              <View style={styles.errorIllustrationCircle}>
                <Text style={styles.errorIllustrationText}>!</Text>
              </View>
            </View>

            <Text style={styles.errorTitle}>
              Terjadi kesalahan pada aplikasi
            </Text>
            <Text style={styles.errorDescription}>
              Kami sudah mencatat kendalanya. Coba muat ulang halaman ini, lalu
              lanjutkan kembali aktivitas Anda.
            </Text>

            <TouchableOpacity
              onPress={this.handleRetry}
              activeOpacity={0.9}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Coba Lagi</Text>
            </TouchableOpacity>

            <Text style={styles.errorHint}>
              Jika masalah masih muncul, tutup lalu buka kembali aplikasi.
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const PostHogAuthBridge = () => {
  const posthog = usePostHog();
  const authState = useSelector((state) => state.user || {});
  const lastIdentifyRef = React.useRef(null);

  React.useEffect(() => {
    setPostHogClient(posthog || null);
  }, [posthog]);

  React.useEffect(() => {
    const pelamarUser = authState?.user;
    const recruiterUser = authState?.userRecruiter;
    const hasPelamarSession = Boolean(authState?.token && pelamarUser);
    const hasRecruiterSession = Boolean(
      authState?.tokenRecruiter && recruiterUser
    );

    if (hasRecruiterSession) {
      const identity = buildPostHogUserIdentity("recruiter", recruiterUser);
      if (!identity) return;

      const signature = JSON.stringify(identity);
      if (lastIdentifyRef.current === signature) return;

      identifyUserProfile("recruiter", recruiterUser, posthog);
      lastIdentifyRef.current = signature;
      return;
    }

    if (hasPelamarSession) {
      const identity = buildPostHogUserIdentity("pelamar", pelamarUser);
      if (!identity) return;

      const signature = JSON.stringify(identity);
      if (lastIdentifyRef.current === signature) return;

      identifyUserProfile("pelamar", pelamarUser, posthog);
      lastIdentifyRef.current = signature;
      return;
    }

    if (lastIdentifyRef.current) {
      posthog?.reset();
      lastIdentifyRef.current = null;
    }
  }, [
    authState?.token,
    authState?.tokenRecruiter,
    authState?.user,
    authState?.userRecruiter,
    posthog,
  ]);

  return null;
};

const AppContent = () => {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  const posthog = usePostHog();

  const trackScreen = (route) => {
    const screenName = route?.name;
    if (!screenName) return;
    setCurrentScreenName(screenName);

    trackScreenView(posthog, route, { platform: Platform.OS });
  };

  return (
    <RootErrorBoundary>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={<SplashScreen />}>
            <SafeAreaProvider style={styles.root}>
              <PostHogAuthBridge />
              <NavigationContainer
                ref={navigationRef}
                onReady={() => {
                  const currentRoute = navigationRef.current.getCurrentRoute();
                  if (currentRoute) {
                    routeNameRef.current = currentRoute.name;
                    trackScreen(currentRoute);
                  }
                }}
                onStateChange={() => {
                  const previousRouteName = routeNameRef.current;
                  const currentRoute = navigationRef.current.getCurrentRoute();

                  if (currentRoute && previousRouteName !== currentRoute.name) {
                    trackScreen(currentRoute);
                    routeNameRef.current = currentRoute.name;
                  }
                }}
              >
                <AppNavigator />
              </NavigationContainer>
              <InAppNotification ref={setInAppNotificationRef} />
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
        <Loading ref={(ref) => setLoadingRef(ref)} />
      </GestureHandlerRootView>
    </RootErrorBoundary>
  );
};

const App = () => {
  const posthogEnabled = isPostHogEnabled();

  return (
    <PostHogProvider
      apiKey={POSTHOG_API_KEY}
      autocapture={{
        captureScreens: false,
      }}
      options={{
        host: POSTHOG_HOST,
        disabled: !posthogEnabled,
      }}
    >
      <AppContent />
    </PostHogProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  errorScreen: {
    flex: 1,
    backgroundColor: "#F4F8FC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    overflow: "hidden",
  },
  errorGlowTop: {
    position: "absolute",
    top: -80,
    right: -30,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#BFE4FF",
  },
  errorGlowBottom: {
    position: "absolute",
    bottom: -110,
    left: -50,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#D8F3E8",
  },
  errorCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: "#E3EDF7",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  errorBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECF7FF",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  errorBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0284C7",
    marginRight: 8,
  },
  errorBadgeText: {
    color: "#0369A1",
    fontSize: 12,
    fontWeight: "700",
  },
  errorIllustrationWrap: {
    alignItems: "center",
    marginBottom: 18,
  },
  errorIllustrationCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#0EA5E9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0284C7",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  errorIllustrationText: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "800",
    marginTop: -2,
  },
  errorMiniCard: {
    marginTop: -10,
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  errorMiniCardText: {
    color: "#C2410C",
    fontSize: 11,
    fontWeight: "700",
  },
  errorTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 10,
  },
  errorDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: "#475569",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#0F172A",
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  errorHint: {
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
    textAlign: "center",
  },
});

export default App;

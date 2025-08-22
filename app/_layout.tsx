import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useCallback } from "react";
import "react-native-reanimated";
import { Drawer } from "expo-router/drawer";
import { router, Stack, useNavigation } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SettingsProvider, useSettings } from "../context/SettingsContext";

import Head from "expo-router/head";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-gesture-handler";
import piano from "../assets/images/piano.png";
import oud from "../assets/images/oud.png";
import ar from "../assets/images/ar.png";
import fa from "../assets/images/fa.png";
import en from "../assets/images/en.png";
import tr from "../assets/images/tr.png";

// Prevent splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

function CustomDrawerContent() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { state, dispatch } = useSettings();
  const [autoQuestion, setAutoQuestion] = useState<boolean>(false);
  const [backToTonic, setBackToTonic] = useState<boolean>(false);
  const [selectedTone, setSelectedTone] = useState(state.toneLabel);

  const toggleLanguage = (lang: "en" | "ar" | "fa" | "tr") => {
    dispatch({
      type: "SET_LANGUAGE",
      payload: lang,
    });
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const toggleAutoQuestionJump = (auto: boolean) => {
    setAutoQuestion(auto);

    dispatch({
      type: "SET_AUTOQUESTIONJUMP",
      payload: auto,
    });
    // navigation.dispatch(DrawerActions.closeDrawer());
    console.log(state.autoQuestionJump);
  };

  const toggleBackToTonic = (back: boolean) => {
    setBackToTonic(back);
    dispatch({
      type: "SET_BACKTOTONIC",
      payload: back,
    });
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  // a handler for choosieng hte innstrument
  const changeInstrument = (instrument: string) => {
    dispatch({
      type: "SET_INSTRUMENT",
      payload: instrument,
    });
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const navigateTo = (screenName: string) => {
    navigation.navigate(screenName);
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f6e2b7" }}>
      <View style={styles.container}>
        <View style={styles.languagesContianer}>
          <TouchableOpacity onPress={() => toggleLanguage("ar")}>
            <Image source={ar} style={styles.languageIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleLanguage("en")}>
            <Image source={en} style={styles.languageIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleLanguage("fa")}>
            <Image source={fa} style={styles.languageIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleLanguage("tr")}>
            <Image source={tr} style={styles.languageIcon} />
          </TouchableOpacity>
        </View>

        {/* <Text style={styles.header}> {state.labels.goto}</Text> */}
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigateTo("Home")}
        >
          <Text style={styles.linkText}>🏠 {state.labels.home}</Text>
        </TouchableOpacity>
        {/* // menu links */}
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigateTo("IntroGame")}
        >
          <Text style={styles.linkText}>{state.labels.introGame}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigateTo("LearnTheMethod")}
        >
          <Text style={styles.linkText}>{state.labels.learnMethod}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigateTo("Training")}
        >
          <Text style={styles.linkText}>{state.labels.basicTraining}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigateTo("Dictations")}
        >
          <Text style={styles.linkText}>{state.labels.melodicDictations}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigateTo("intervals")}
        >
          <Text style={styles.linkText}>{state.labels.intervals}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigateTo("maqamat")}
        >
          <Text style={styles.linkText}>{state.labels.maqamat}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigateTo("playground")}
        >
          <Text style={styles.linkText}>{state.labels.Playground}</Text>
        </TouchableOpacity>
        {/* <Text style={styles.header}>🎵 {state.labels.chooseInstrument}</Text> */}

        <View style={styles.instContianer}>
          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 5,
              marginBottom: 10,
            }}
            onPress={() => changeInstrument("piano")}
          >
            <Image source={piano} style={styles.instIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 5,
              marginBottom: 10,
            }}
            onPress={() => changeInstrument("oud")}
          >
            <Image source={oud} style={styles.instIcon} />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.switchContainer,
            {
              flexDirection:
                state.language === "ar" || state.language === "fa"
                  ? "row-reverse"
                  : "row",
            },
          ]}
        >
          <Switch
            value={autoQuestion}
            style={styles.switch}
            onValueChange={(value) => toggleAutoQuestionJump(value)}
            thumbColor={autoQuestion ? "#4CAF50" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          />
          <Text style={{ marginLeft: 10 }}>{state.labels.autoJump}</Text>
        </View>

        <View
          style={[
            styles.switchContainer,
            {
              flexDirection:
                state.language === "ar" || state.language === "fa"
                  ? "row-reverse"
                  : "row",
            },
          ]}
        >
          <Switch
            value={backToTonic}
            style={styles.switch}
            onValueChange={(value) => toggleBackToTonic(value)}
            thumbColor={backToTonic ? "#4CAF50" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          />
          <Text style={{ marginLeft: 10 }}>{state.labels.backToTonic}</Text>
        </View>
      </View>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [areFontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (areFontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [areFontsLoaded]);

  if (!areFontsLoaded) {
    return null; // Return null if fonts are not loaded
  }

  return (
    <SettingsProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <AppContent />
        </GestureHandlerRootView>
      </ThemeProvider>
    </SettingsProvider>
  );
}

function AppContent() {
  const { state } = useSettings();
  const [isWeb, setIsWeb] = useState(false);
  useEffect(() => {
    if (Platform.OS === "web") {
      setIsWeb(true);
    }
  }, []);

  if (!state) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    ); // Display a loading indicator
  }

  return (
    <View style={isWeb ? styles.mobileContainer : { flex: 1 }}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Drawer drawerContent={() => <CustomDrawerContent />}>
        <Stack.Screen
          name="index"
          options={({ navigation }) => ({
            title: state.labels.appHeader,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 22,
              color: "#222", // title text color
            },
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => null,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="Dictations/index"
          options={({ navigation }) => ({
            title: state.labels.dictations.title,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Dictations/Dictaionsplay"
          options={({ navigation }) => ({
            title: state.labels.dictations.title,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  router.replace("/Dictations"); // أو أي مسار تحبي ترجعي له بدل الهوم
                }}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="IntroGame/index"
          options={({ navigation }) => ({
            title: state.labels.introGamePage.header,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="IntroGame/Level1"
          options={({ navigation }) => ({
            title: state.labels.introGamePage.levelPage.header,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  router.replace("/IntroGame"); // أو أي مسار تحبي ترجعي له بدل الهوم
                }}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="IntroGame/Overview"
          options={({ navigation }) => ({
            title: state.labels.introGamePage.pages.overview,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  router.replace("/IntroGame"); // أو أي مسار تحبي ترجعي له بدل الهوم
                }}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Training/index"
          options={({ navigation }) => ({
            title: state.labels.basicTrainingPages.basicTrainingHome.title,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="Training/TrainingScreen"
          options={({ navigation }) => ({
            title: state.labels.basicTrainingPages.basicTrainingHome.title,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  router.replace("/Training"); // أو أي مسار تحبي ترجعي له بدل الهوم
                }}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Training/play"
          options={({ navigation }) => ({
            title: state.labels.basicTrainingPages.basicTrainingLevel.play,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  console.log("from play to training screen");
                  router.push("/Training/TrainingScreen"); // أو أي مسار تحبي ترجعي له بدل الهوم
                }}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Training/listen"
          options={({ navigation }) => ({
            title: state.labels.basicTrainingPages.basicTrainingLevel.listen,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  router.replace("/Training/TrainingScreen"); // أو أي مسار تحبي ترجعي له بدل الهوم
                }}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="LearnTheMethod"
          options={({ navigation }) => ({
            title: state.labels.learnMethod,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="intervals"
          options={({ navigation }) => ({
            title: state.labels.intervals,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="maqamat"
          options={({ navigation }) => ({
            title: state.labels.maqamat,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="playground"
          options={({ navigation }) => ({
            title: state.labels.Playground,
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
      </Drawer>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileContainer: { flex: 1, width: 400, justifyContent: "center" },
  switchContainer: { marginTop: 10, flexDirection: "row" },
  switch: { marginHorizontal: 10 },
  instContianer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  instIcon: {
    width: 100,
    height: 70,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff8e1",
    padding: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    color: "#6a1b9a",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#ba68c8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  link: {
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 16,
    color: "#4e342e",
  },
  languagesContianer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  languageIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});

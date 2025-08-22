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
  ScrollView,
} from "react-native";

import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SettingsProvider, useSettings } from "../context/SettingsContext";
import Foundation from "@expo/vector-icons/Foundation";
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
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "fa", name: "فارسی", flag: "🇮🇷" }, // Persian (Iran)
  { code: "tr", name: "Türkçe", flag: "🇹🇷" }, // Turkish (Turkey)
];
const instruments = [
  { code: "piano", name: "piano", icon: "create-outline" },
  { code: "oud", name: "oud", icon: "create-outline" },
];

function CustomDrawerContent() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { state, dispatch } = useSettings();
  const [autoQuestion, setAutoQuestion] = useState<boolean>(false);
  const [backToTonic, setBackToTonic] = useState<boolean>(false);
  const screens = [
    { key: "index", name: state.labels.home, icon: "home-outline" },
    {
      key: "IntroGame/index",
      name: state.labels.introGame,
      icon: "game-controller-outline",
    },
    {
      key: "LearnTheMethod",
      name: state.labels.learnMethod,
      icon: "create-outline",
    },
    {
      key: "Training/index",
      name: state.labels.basicTraining,
      icon: "pulse-outline",
    },
    {
      key: "Dictations/index",
      name: state.labels.melodicDictations,
      icon: "trending-up-outline",
    },
    {
      key: "intervals",
      name: state.labels.intervals,
      icon: "analytics-outline",
    },
    {
      key: "maqamat",
      name: state.labels.maqamat,
      icon: "musical-notes-outline",
    },
    {
      key: "playground",
      name: state.labels.Playground,
      icon: "trending-up-outline",
    },
  ];

  const toggleLanguage = (lang: "en" | "ar" | "fa" | "tr") => {
    dispatch({
      type: "SET_LANGUAGE",
      payload: lang,
    });
    // navigation.dispatch(DrawerActions.closeDrawer());
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
    //  navigation.dispatch(DrawerActions.closeDrawer());
  };

  // a handler for choosieng hte innstrument
  const changeInstrument = (instrument: string) => {
    dispatch({
      type: "SET_INSTRUMENT",
      payload: instrument,
    });
    // navigation.dispatch(DrawerActions.closeDrawer());
  };

  const navigateTo = (screenName: string) => {
    console.log("screenName", screenName);
    navigation.navigate(screenName);
    //navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* // setting header and close button */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{state.labels.settings}</Text>
      </View>

      {/* Language Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        <View style={styles.languageGrid}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                state.language === lang.code && styles.languageButtonActive,
              ]}
              onPress={() => toggleLanguage(lang.code as any)}
            >
              <Text style={styles.languageFlag}>{lang.flag}</Text>
              <Text
                style={[
                  styles.languageName,
                  state.language === lang.code && styles.languageNameActive,
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* instrumets Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instrument</Text>
        <View style={styles.languageGrid}>
          {instruments.map((inst) => (
            <TouchableOpacity
              key={inst.code}
              style={[
                styles.languageButton,
                state.instrument === inst.code && styles.instButtonActive,
              ]}
              onPress={() => changeInstrument(inst.code as any)}
            >
              <Ionicons name={inst.icon as any} size={20} color="#007AFF" />
              <Text
                style={[
                  styles.languageName,
                  state.language === inst.code && styles.languageNameActive,
                ]}
              >
                {inst.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Settings Switches */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Foundation name="next" size={20} color="#666" />
            <Text style={styles.settingLabel}>{state.labels.autoJump}</Text>
          </View>
          <Switch
            value={autoQuestion}
            onValueChange={(value) => toggleAutoQuestionJump(value)}
            trackColor={{ false: "#E5E5E5", true: "#007AFF" }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="return-up-back" size={20} color="#666" />

            <Text style={styles.settingLabel}>{state.labels.backToTonic}</Text>
          </View>
          <Switch
            value={backToTonic}
            onValueChange={(value) => toggleBackToTonic(value)}
            trackColor={{ false: "#E5E5E5", true: "#007AFF" }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation</Text>
        {screens.map((screen) => (
          <TouchableOpacity
            key={screen.key}
            style={styles.navItem}
            onPress={() => navigateTo(screen.key)}
          >
            <Ionicons name={screen.icon as any} size={20} color="#007AFF" />
            <Text style={styles.navLabel}>{screen.name}</Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  closeButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
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
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F8F8F8",
    borderWidth: 2,
    borderColor: "transparent",
    minWidth: "45%",
  },
  languageButtonActive: {
    backgroundColor: "#E3F2FD",
    borderColor: "#007AFF",
  },
  instButtonActive: {
    backgroundColor: "#ecfaf2",
    borderColor: "#0c915e",
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  languageName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  languageNameActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 14,
    color: "#333",
    marginLeft: 12,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  navLabel: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
});

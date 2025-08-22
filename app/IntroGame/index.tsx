import { router, useNavigation } from "expo-router";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from "react-native";
import { useSettings } from "../../context/SettingsContext";
import { StackNavigationProp } from "@react-navigation/stack";

const cadence = ["Do", "Re", "Mi", "Doo"];

const levels = [
  { title: "Overview", levelChoices: [], maqamSection: 0 },
  { title: "1. Do, Re", levelChoices: [0, 1], maqamSection: 0 },
  {
    title: "2. Do, Re, Mi",
    levelChoices: [0, 2],
    maqamSection: 0,
  },
  {
    title: "3. Do, Re, Mi, Fa",
    levelChoices: [0, 3],
    maqamSection: 0,
  },
  {
    title: "4. Si, Do",
    levelChoices: [6, 7],
    cadence: cadence,
    maqamSection: 1,
  },
  {
    title: "5. La, Si, Do",
    levelChoices: [5, 7],
    maqamSection: 1,
  },
  {
    title: "6. Sol, La, Si, Do",
    levelChoices: [4, 7],
    maqamSection: 1,
  },
  {
    title: "7. The Whole Octave",
    levelChoices: [0, 7],
    maqamSection: 2,
  },
];

type LevelParams = {
  title: string;
  levelChoices: number[];
  cadence: string[];
};
type RootStackParamList = {
  "/IntroGame/Overview": undefined; // No parameters for the overview screen
  "/IntroGame/Level1": LevelParams; // Level1 screen accepts LevelParams
};
export default function IntroGame() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const getButtonStyle = (index: number): ViewStyle => {
    const buttonStyles: Record<number, keyof typeof styles> = {
      0: "button1",
      1: "button2",
      2: "button3",
      3: "button4",
      4: "button5",
      5: "button6",
    };

    return styles[buttonStyles[index] || "button1"] as ViewStyle; // Ensure proper type
  };
  const { state, dispatch } = useSettings();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.button4,
          {
            justifyContent:
              state.language === "ar" || state.language === "fa"
                ? "flex-end"
                : "flex-start",
          },
        ]}
        onPress={() => router.navigate("/IntroGame/Overview")}
      >
        <Text style={styles.buttonText}>
          {state.labels.introGamePage.pages.overview}
        </Text>
      </TouchableOpacity>

      {levels.slice(1).map((level, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            getButtonStyle(index),
            {
              justifyContent:
                state.language === "ar" || state.language === "fa"
                  ? "flex-end"
                  : "flex-start",
            },
          ]}
          onPress={() => {
            dispatch({
              type: "SET_GAME_PARAMS",
              payload: {
                levelChoices: level.levelChoices,
                maqamSection: level.maqamSection,
              },
            });
            router.push("/IntroGame/Level1");
          }}
        >
          <Text style={styles.buttonText}>
            {
              state.labels.introGamePage.pages[
                `level${
                  index + 1
                }` as keyof typeof state.labels.introGamePage.pages
              ]
            }
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fbeccb",
  },

  button: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
  button1: {
    backgroundColor: "#b9414c",
  },
  button2: {
    backgroundColor: "#dda276",
  },
  button3: {
    backgroundColor: "#3aa1ac",
  },
  button4: {
    backgroundColor: "#e89e97",
  },
  button5: {
    backgroundColor: "#839278",
  },
  button6: {
    backgroundColor: "#d3803f",
  },
  button7: {
    backgroundColor: "#b9414c",
  },
});

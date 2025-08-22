import { router, useNavigation } from "expo-router";

import { Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useSettings } from "@/context/SettingsContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { trainigLevels } from "@/constants/scales";

type RootStackParamList = {
  "play": PlayParams;
  "Training/TrainingScreen": PlayParams;
};
const buttonColors = [
  "#b9414c",
  "#dda276",
  "#3aa1ac",
  "#e89e97",
  "#839278",
  "#d3803f",
];
type PlayParams = {
  id: string;
  scale: string;
  levelChoices: string[];
  label: string;
};
export default function IntroGame() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { state, dispatch } = useSettings();

  const pageLables = state.labels.basicTrainingPages.basicTrainingHome;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {trainigLevels.map((level, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            { backgroundColor: buttonColors[index % buttonColors.length] },
            {
              justifyContent:
                state.language === "ar" || state.language === "fa"
                  ? "flex-end"
                  : "flex-start",
            },
          ]}
          onPress={() => {
            dispatch({
              type: "SET_TRAINING_PARAMS",
              payload: {
                id: level.id,
                scale: level.scale,
                levelChoices: level.levelChoices,
                label: level.label,
              },
            });
            router.push("/Training/TrainingScreen");
          }}
        >
          <Text style={styles.buttonText}>
            {level.id} :{" "}
            {pageLables.hasOwnProperty(level.scale)
              ? pageLables[level.scale as keyof typeof pageLables]
              : level.scale}{" "}
            -
            {level.label == "section1"
              ? pageLables.firstHalf
              : level.label == "section2"
              ? pageLables.secondHalf
              : pageLables.wholescale}
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
});

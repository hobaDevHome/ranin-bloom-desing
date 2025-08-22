import { router, useNavigation } from "expo-router";
import { I18nManager } from "react-native";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  ViewStyle,
} from "react-native";
import { useSettings } from "@/context/SettingsContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { dictaionsLevels, Maqam } from "@/constants/scales";

type LevelParams = {
  id: string;
  scale: string;
};
type RootStackParamList = {
  "/Dictations/Dictaionsplay": LevelParams;
};
const buttonColors = [
  "#b9414c",
  "#dda276",
  "#3aa1ac",
  "#e89e97",
  "#839278",
  "#d3803f",
];
export default function DictaionsHome() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { state, dispatch } = useSettings();

  const trainingLables = state.labels.basicTrainingPages.basicTrainingHome;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {dictaionsLevels.map((level, index) => (
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
          onPress={() =>
            router.navigate({
              pathname: "/Dictations/Dictaionsplay",
              params: {
                id: level.id,
                scale: level.scale,
              },
            })
          }
        >
          <Text style={styles.buttonText}>
            {level.id} : {trainingLables[level.scale as Maqam]}
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

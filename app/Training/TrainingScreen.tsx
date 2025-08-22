import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSettings } from "@/context/SettingsContext";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Foundation from "@expo/vector-icons/Foundation";
import { Maqam } from "@/constants/scales";
type TrainingScreenParams = {
  id: string;
  scale: string;
  levelChoices: string[];
  label: string;
};

type PlayParams = {
  id: string;
  scale: string;
  levelChoices: string[];
  label: string;
};

type RootStackParamList = {
  "Training/play": PlayParams;
  "Training/listen": PlayParams;
};
const TrainingScreen = () => {
  const { state, dispatch } = useSettings();
  const trainingLevelLables =
    state.labels.basicTrainingPages.basicTrainingLevel;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { id, scale, levelChoices, label } = state.trainingParams || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {trainingLevelLables.describtion} :
        {state.labels.basicTrainingPages.basicTrainingHome[scale as Maqam]}
      </Text>
      {/* <Text style={styles.subTitle}>
        {trainingLevelLables.section} : {currentSection.toString()}
      </Text> */}

      <View style={styles.playButtonContiner}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() =>
            router.push({
              pathname: "/Training/play",
              params: {
                id: id,
                scale: scale,
                levelChoices: levelChoices,
                label: label,
              },
            })
          }
        >
          <AntDesign
            name="playcircleo"
            size={24}
            color="black"
            style={styles.buttonIcon}
          />
          <Text>{trainingLevelLables.play}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listenButton}
          onPress={() =>
            router.push({
              pathname: "/Training/listen",
              params: {
                id: id,
                scale: scale,
                levelChoices: levelChoices,
                label: label,
              },
            })
          }
        >
          <AntDesign
            name="sound"
            size={24}
            color="black"
            style={styles.buttonIcon}
          />
          <Text>{trainingLevelLables.listen}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 18,
    color: "#5c3829",
    marginLeft: 5,
  },

  playButtonContiner: {
    width: "70%",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    color: "#5c3829",
  },
  subTitle: {
    fontSize: 18,
    color: "#5c3829",
    marginLeft: 5,
    marginTop: 10,
  },
  playButton: {
    backgroundColor: "#f3b7ad",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  listenButton: {
    backgroundColor: "#80cdc7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
});

export default TrainingScreen;

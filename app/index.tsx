import React from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSettings } from "../context/SettingsContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type RootStackParamList = {
  "Home": undefined;
  "BasicTraining": undefined;
  "LearnTheMethod": undefined;
  "IntroGame/index": undefined;
  "MelodicDictations": undefined;
  "intervals": undefined;
  "maqamat": undefined;
  "Training/index": undefined;
  "playground": undefined;
  "Dictations/index": undefined;
};

export default function HomeScreen() {
  type NavigationProps = NavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProps>();
  const { state } = useSettings();

  const navigateTo = (screenName: keyof RootStackParamList) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/home-2.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Buttons Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.button1]}
          onPress={() => navigateTo("IntroGame/index")}
        >
          <View
            style={[
              styles.buttonContent,
              {
                flexDirection: state.language === "ar" ? "row-reverse" : "row",
              },
            ]}
          >
            <Ionicons
              name="game-controller"
              size={30}
              color="#fff"
              style={styles.buttonIcon}
            />

            <Text style={styles.buttonText}>{state.labels.introGame}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.button2]}
          onPress={() => navigateTo("LearnTheMethod")}
        >
          <View
            style={[
              styles.buttonContent,
              {
                flexDirection: state.language === "ar" ? "row-reverse" : "row",
              },
            ]}
          >
            <MaterialIcons
              name="school"
              size={24}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>{state.labels.learnMethod}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.button3]}
          onPress={() => navigateTo("Training/index")}
        >
          <View
            style={[
              styles.buttonContent,
              {
                flexDirection: state.language === "ar" ? "row-reverse" : "row",
              },
            ]}
          >
            <MaterialIcons
              name="fitness-center"
              size={24}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>{state.labels.basicTraining}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.button4]}
          onPress={() => navigateTo("Dictations/index")}
        >
          <View
            style={[
              styles.buttonContent,
              {
                flexDirection: state.language === "ar" ? "row-reverse" : "row",
              },
            ]}
          >
            <FontAwesome
              name="assistive-listening-systems"
              color="#fff"
              size={24}
              style={styles.buttonIcon}
            />

            <Text style={styles.buttonText}>
              {state.labels.melodicDictations}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.button1]}
          onPress={() => navigateTo("intervals")}
        >
          <View
            style={[
              styles.buttonContent,
              {
                flexDirection: state.language === "ar" ? "row-reverse" : "row",
              },
            ]}
          >
            <MaterialIcons
              name="graphic-eq"
              size={24}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>{state.labels.intervals}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.button2]}
          onPress={() => navigateTo("maqamat")}
        >
          <View
            style={[
              styles.buttonContent,
              {
                flexDirection: state.language === "ar" ? "row-reverse" : "row",
              },
            ]}
          >
            <MaterialIcons
              name="library-music"
              size={24}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>{state.labels.maqamat}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.button3]}
          onPress={() => navigateTo("playground")}
        >
          <View
            style={[
              styles.buttonContent,
              {
                flexDirection: state.language === "ar" ? "row-reverse" : "row",
              },
            ]}
          >
            <MaterialIcons
              name="piano"
              size={24}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>{state.labels.Playground}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6e2b7", // Soft warm background color
    alignItems: "center",
  },
  backgroundImage: {
    width: "90%",
    height: Dimensions.get("window").height * 0.25, // Adjust the height based on your design
    borderRadius: 5,
    marginTop: 10,
    overflow: "hidden",
  },
  buttonContainer: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    paddingVertical: 30,
    marginVertical: 10,
    width: "48%", // Two columns
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    textTransform: "uppercase",
    marginRight: 8,
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
  buttonIcon: {
    marginRight: 8,
  },
});

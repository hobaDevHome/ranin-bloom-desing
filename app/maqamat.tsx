import OptionButton from "@/components/Buttons/OptionButton";
import { useNavigation } from "@react-navigation/native";
import OptionButton2 from "@/components/Buttons/OptionButton2";
import PlayButton from "@/components/Buttons/PlayButton";
import RepeatButton from "@/components/Buttons/RepeatButton";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useSettings } from "../context/SettingsContext";
import React, { useEffect, useState } from "react";
import {
  scalesLists,
  maqamsSoundFolders,
  maqamsScaleLists,
  maqamsExamplesLists,
  examplesSoundFolders,
  Maqam,
} from "@/constants/scales";
import { useFocusEffect } from "@react-navigation/native";

import { Audio } from "expo-av";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";

import { Asset } from "expo-asset";
import IntroGame from "./BasicTraining";

const instrumentImages: { [key: string]: any } = {
  piano: require("@/assets/images/piano.png"),
  oud: require("@/assets/images/oud.png"),
};

const MaqamTrainingScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMaqams, setSelectedMaqams] = useState<string[]>(
    Object.keys(scalesLists)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMaqam, setCurrentMaqam] = useState<string | null>(null);
  const [userSelection, setUserSelection] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [currentMaqamSound, setCurrentMaqamSound] = useState<string | null>(
    null
  );
  const [isAnswered, setIsAnswered] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  const [currentSoundObject, setCurrentSoundObject] =
    useState<Audio.Sound | null>(null);

  const [isExamplePlaying, setIsExamplePlaying] = useState(false);
  const [showExampleControlButton, setShowExampleControlButton] =
    useState(false);
  const [firstAttempt, setFirstAttempt] = useState(true);
  const [questionNumber, setQuestionNumber] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      playMaqam();
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      // Stop and unload sound when leaving the screen
      if (currentSoundObject) {
        currentSoundObject
          .stopAsync()
          .catch((error) => console.log("Error stopping sound:", error));
        currentSoundObject
          .unloadAsync()
          .catch((error) => console.log("Error unloading sound:", error));
      }
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation, currentSoundObject]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
      setIsPlaying(false);
      setCurrentMaqam(null);
      setUserSelection(null);
      setIsAnswered(true);
      setShowAnswer(false);
      setQuestionNumber(0);
      setScore({ correct: 0, incorrect: 0 });
      if (currentSoundObject) {
        try {
          await currentSoundObject.stopAsync();
          await currentSoundObject.unloadAsync();
          setCurrentSoundObject(null);
        } catch (error) {
          console.log("Error stopping/unloading soundRef:", error);
        }
      }
      if (currentSoundObject) {
        try {
          await currentSoundObject.stopAsync();
          await currentSoundObject.unloadAsync();
          setCurrentSoundObject(null);
        } catch (error) {
          console.log("Error stopping/unloading currentSoundObject:", error);
        }
      }
    });

    return unsubscribe;
  }, [navigation, currentSoundObject]);

  const { state, dispatch } = useSettings();

  const lables = state.labels.maqamatTraingingPage;
  const maqamsListFromLacale =
    state.labels.basicTrainingPages.basicTrainingHome;

  const maqamMap: Record<Maqam, string> = {
    Rast: "راست",
    Bayaty: "بياتي",
    Agam: "عجم",
    Nahawand: "نهاوند",
    Saba: "صبا",
    Sika: "سيكا",
    Hegaz: "حجاز",
    Kurd: "كرد",
  };

  const playMaqam = async () => {
    setIsExamplePlaying(false);
    setShowExampleControlButton(false);
    setUserSelection(null);

    setFirstAttempt(true);

    setQuestionNumber((prev) => prev + 1);
    if (!selectedMaqams.length) return;
    setShowAnswer(false);

    // 🛑 Stop and unload any currently playing sound
    if (currentSoundObject !== null) {
      console.log("there is currently playing");
      try {
        await currentSoundObject.stopAsync();
        await currentSoundObject.unloadAsync();
      } catch (error) {
        console.warn("Error stopping/unloading current sound:", error);
      }
      setCurrentSoundObject(null);
    }

    // Set the new Maqam
    const randomMaqam =
      selectedMaqams[Math.floor(Math.random() * selectedMaqams.length)];
    setCurrentMaqam(randomMaqam);

    const randomMaqamList = maqamsScaleLists[randomMaqam as Maqam];

    const randomMaqamSound =
      randomMaqamList[Math.floor(Math.random() * randomMaqamList.length)];
    console.log("randomMaqamSound:", randomMaqamSound);

    setCurrentMaqamSound(randomMaqamSound);

    const soundName = randomMaqamSound;
    const folder = maqamsSoundFolders[state.instrument];

    if (!folder) {
      console.error(`Instrument "${state.instrument}" not found.`);
      return;
    }

    try {
      const file = folder(`./${soundName}.mp3`);
      const asset = Asset.fromModule(file);

      // Create a new sound object and set it as the current sound
      let soundObject = new Audio.Sound();
      setCurrentSoundObject(soundObject);

      await soundObject.loadAsync({ uri: asset.uri });
      await soundObject.playAsync();

      soundObject.setOnPlaybackStatusUpdate(async (status) => {
        if (status && status.isLoaded) {
          if (status.didJustFinish) {
            await soundObject.unloadAsync();
          }
        }
      });
    } catch (error) {
      console.error(`Error playing sound ${soundName}:`, error);
    }

    setIsAnswered(false);
    setUserSelection(null);
  };

  const playExample = async () => {
    if (!selectedMaqams.length) return;
    if (!currentMaqam) return;

    // 🛑 Stop and unload any currently playing sound
    if (currentSoundObject !== null) {
      console.log("there is currently playing");
      try {
        await currentSoundObject.stopAsync();
        await currentSoundObject.unloadAsync();
      } catch (error) {
        console.warn("Error stopping/unloading current sound:", error);
      }
      setCurrentSoundObject(null);
    }

    // the current maqam is const currentmaqam

    const currentExamplesList = maqamsExamplesLists[currentMaqam as Maqam];

    // choose a random example

    const currentExampleSound =
      currentExamplesList[
        Math.floor(Math.random() * currentExamplesList.length)
      ];

    //////////
    // // or get the example with the same index as currentMaqamSound
    let currentMaqamSoundIndex = currentMaqamSound?.split("_")[1];
    // const currentExampleSound =
    //   currentExamplesList[currentMaqamSoundIndex];
    // console.log("currentExampleSound", currentExampleSound);

    const soundName = currentExampleSound;
    const folder = examplesSoundFolders[state.instrument];

    if (!folder) {
      console.error(`Instrument "${state.instrument}" not found.`);
      return;
    }

    try {
      const file = folder(`./${soundName}.mp3`);
      const asset = Asset.fromModule(file);

      // Create a new sound object and set it as the current sound
      let soundObject = new Audio.Sound();
      setCurrentSoundObject(soundObject);

      await soundObject.loadAsync({ uri: asset.uri });
      await soundObject.playAsync();

      setIsExamplePlaying(true);
      setShowExampleControlButton(true);

      soundObject.setOnPlaybackStatusUpdate(async (status) => {
        if (status && status.isLoaded) {
          if (status.didJustFinish) {
            await soundObject.unloadAsync();
            setIsExamplePlaying(false);
            setShowExampleControlButton(false);
          }
        }
      });
    } catch (error) {
      console.error(`Error playing sound ${soundName}:`, error);
      setIsExamplePlaying(false);
      setShowExampleControlButton(false);
    }
  };

  // Function to toggle play/pause for the example sound
  const toggleExamplePlayback = async () => {
    if (!currentSoundObject) return;

    try {
      const status = await currentSoundObject.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await currentSoundObject.pauseAsync();
          setIsExamplePlaying(false);
        } else {
          await currentSoundObject.playAsync();
          setIsExamplePlaying(true);
        }
      }
    } catch (error) {
      console.error("Error toggling example playback:", error);
    }
  };
  // Handle user selection
  const handleSelection = (maqam: string) => {
    if (!isAnswered) {
      setFirstAttempt(false);
      setUserSelection(maqam);
      // update the score state accrordingly;
      if (maqam === currentMaqam) {
        if (firstAttempt) {
          setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
        }
        setIsAnswered(true);
        setShowAnswer(true);

        if (state.autoQuestionJump) {
          setTimeout(() => {
            playMaqam();
          }, 1000);
        }
      } else {
        if (firstAttempt) {
          setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }
      }
    }
  };

  // Toggle Maqam selection
  const toggleMaqam = (maqam: string) => {
    setSelectedMaqams((prev) =>
      prev.includes(maqam) ? prev.filter((m) => m !== maqam) : [...prev, maqam]
    );
  };

  // Toggle the settings modal
  const toggleModal = () => setModalVisible(!modalVisible);

  const repeatMaqam = async () => {
    if (!selectedMaqams.length) return;
    // if (isAnswered) return;

    if (currentSoundObject !== null) {
      console.log("there is currently playing");
      try {
        await currentSoundObject.stopAsync();
        await currentSoundObject.unloadAsync();
      } catch (error) {
        console.warn("Error stopping/unloading current sound:", error);
      }
      setCurrentSoundObject(null);
    }

    if (!currentMaqam) return;

    const soundName = currentMaqamSound;
    const folder = maqamsSoundFolders[state.instrument];

    if (!folder) {
      console.error(`Instrument "${state.instrument}" not found.`);
      return;
    }

    try {
      const file = folder(`./${soundName}.mp3`);
      const asset = Asset.fromModule(file);

      // Create a new sound object and set it as the current sound
      let soundObject = new Audio.Sound();
      setCurrentSoundObject(soundObject);

      await soundObject.loadAsync({ uri: asset.uri });
      await soundObject.playAsync();

      soundObject.setOnPlaybackStatusUpdate(async (status) => {
        if (status && status.isLoaded) {
          if (status.didJustFinish) {
            await soundObject.unloadAsync();
          }
        }
      });
    } catch (error) {
      console.error(`Error playing sound ${soundName}:`, error);
    }

    // setIsAnswered(false);
    // setUserSelection(null);
  };
  console.log("currentMaqams:", maqamsListFromLacale["Bayaty"]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* <Text style={styles.title}>{lables.title}</Text> */}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{score.correct}</Text>
            <Text style={styles.statLabel}>
              {state.labels.introGamePage.levelPage.correct}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{score.incorrect}</Text>
            <Text style={styles.statLabel}>
              {" "}
              {state.labels.introGamePage.levelPage.incorrect}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{questionNumber}</Text>
            <Text style={styles.statLabel}> {state.labels.questionNo}</Text>
          </View>
        </View>

        <View style={styles.playButtonContiner}>
          {/* Play Button */}
          <PlayButton
            isPlaying={false}
            label={lables.playMaqam}
            playInterval={playMaqam}
          />
          {/* repeat Button */}
          <RepeatButton
            isPlaying={isPlaying}
            label={lables.repeatButton}
            repeatInterval={repeatMaqam}
          />
        </View>
        <View style={styles.exampleButtonsView}>
          {/* example Button */}

          {showExampleControlButton && (
            <TouchableOpacity
              onPress={toggleExamplePlayback}
              style={styles.exampleControlButton}
            >
              <Ionicons
                name={isExamplePlaying ? "pause" : "play"}
                size={24}
                color="#5c3829"
              />
            </TouchableOpacity>
          )}
          <RepeatButton
            isPlaying={isPlaying}
            label={lables.example}
            repeatInterval={playExample}
          />
        </View>

        {/* Maqam Selection Buttons */}
        <View style={styles.maqamContainer}>
          {selectedMaqams.map((maqam) => (
            <OptionButton
              key={maqam}
              userSelection={userSelection}
              interval={maqam}
              currentInterval={currentMaqam}
              handleSelection={handleSelection}
              isAnswered={isAnswered}
              label={
                state.language === "en"
                  ? maqam
                  : maqamsListFromLacale[maqam as Maqam]
              }
            />
          ))}
        </View>

        {/* Settings Button */}
        <View style={styles.settingsBtCont}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.settingsBtnContainer}>
              <Ionicons name="settings-outline" size={16} color="black" />
              <Text style={styles.buttonText}>{lables.settings}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Modal for Settings */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{lables.maqamtSettings}</Text>
                <Text style={styles.chooseText}>{lables.chooseMaqam}</Text>

                {/* Maqam Selector */}
                <View style={styles.maqamSelectionContainer}>
                  {Object.keys(scalesLists).map((maqam) => (
                    <OptionButton2
                      key={maqam}
                      selectedIntervals={selectedMaqams}
                      interval={maqam}
                      toggleInterval={toggleMaqam}
                      label={
                        state.language == "en"
                          ? maqam
                          : maqamMap[maqam as Maqam]
                      }
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <AntDesign
                    name="close"
                    size={24}
                    color="black"
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
  },
  playButton: {
    backgroundColor: "#34C759",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  settingsButton: {
    backgroundColor: "#80cdc7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: "#FF9500",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    // color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  maqamContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  maqamButton: {
    backgroundColor: "#E0E0E0",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  correct: { borderColor: "green", borderWidth: 3 },
  wrong: { borderColor: "red", borderWidth: 3 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    maxWidth: Platform.OS === "web" ? 400 : "100%",
  },
  modalContent: {
    backgroundColor: "#fbedd3",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    flexWrap: "wrap",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  maqamSelectionContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  maqamSelectButton: {
    padding: 5,
    margin: 3,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  selected: {
    backgroundColor: "#34C759",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    width: 30,
    height: 30,
    backgroundColor: "#376863",
    borderRadius: 15,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  closeIcon: {
    color: "#fff",
    fontSize: 24,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fbedd3",
    overflow: "hidden",
  },
  playButtonContiner: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    flexWrap: "wrap",
  },
  settingsBtCont: {
    marginTop: 30,
  },
  chooseText: {
    marginBottom: 15,
    fontSize: 18,

    color: "#5c3829",
    alignSelf: "flex-start",
  },
  settingsBtnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedInstCont: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,

    backgroundColor: "#d7e7d9",
    paddingVertical: 10,

    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginTop: 10,
  },
  instIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginLeft: 10,
  },
  exampleButtonsView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  exampleControlButton: {
    padding: 10,
    marginHorizontal: 10, // Add some space from the example button
    justifyContent: "center",
    alignItems: "center",
    // Add background/border if needed
    backgroundColor: "#9cdde2",
    borderRadius: 10,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
  },
  score: {
    fontSize: 18,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});

export default MaqamTrainingScreen;

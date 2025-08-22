import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useSettings } from "../context/SettingsContext";

import PlayButton from "@/components/Buttons/PlayButton";
import RepeatButton from "@/components/Buttons/RepeatButton";
import OptionButton from "@/components/Buttons/OptionButton";
import OptionButton2 from "@/components/Buttons/OptionButton2";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { Audio } from "expo-av";
import { soundFolders } from "@/constants/scales";
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from "expo-router";

const instrumentImages: { [key: string]: any } = {
  piano: require("@/assets/images/piano.png"),
  oud: require("@/assets/images/oud.png"),
};
const intervalSteps: Record<string, string[]> = {
  "Unison": ["re", "re"],
  "Minor Second": ["re", "mi_b"],
  "Three Quarter Tone": ["re", "mi_q"],
  "Major Second": ["re", "mi"],
  "Minor Third": ["re", "fa"],
  // "Major Third": ["do", "mi"],
  // "Perfect Fourth": ["do", "fa"],
  // "Tritone": ["do", "fa_d"],
  // "Perfect Fifth": ["do", "sol"],
  // "Minor Sixth": ["do", "la_b"],
  // "Major Sixth": ["do", "la"],
  // "Minor Seventh": ["do", "si_b"],
  // "Major Seventh": ["do", "si"],
  "Octave": ["re", "ree"],
};
const IntervalTrainingScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedIntervals, setSelectedIntervals] = useState<string[]>(
    Object.keys(intervalSteps)
  );
  const [currentInterval, setCurrentInterval] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userSelection, setUserSelection] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [currentSoundObject, setCurrentSoundObject] =
    useState<Audio.Sound | null>(null);
  const [firstAttempt, setFirstAttempt] = useState(true);
  const [questionNumber, setQuestionNumber] = useState(0);
  const { state, dispatch } = useSettings();
  const navigation = useNavigation();
  const lables = state.labels.intervalsTraingingPage;

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
      if (currentSoundObject) {
        try {
          const status = await currentSoundObject.getStatusAsync();
          if (status.isLoaded) {
            await currentSoundObject.stopAsync();
            await currentSoundObject.unloadAsync();
          }
        } catch (error) {
          console.log("Error handling sound cleanup:", error);
        }
      }
    });

    return unsubscribe;
  }, [navigation, currentSoundObject]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
      setIsPlaying(false);
      setCurrentInterval(null);
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
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      playInterval();
    });

    return unsubscribe;
  }, [navigation]);

  // ----------- تم التعديل هنا -----------
  const playInterval = async () => {
    setFirstAttempt(true);
    setQuestionNumber((prev) => prev + 1);
    if (!selectedIntervals.length) return;
    console.log("in play intervla");
    setShowAnswer(false);
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
    const randomInterval =
      selectedIntervals[Math.floor(Math.random() * selectedIntervals.length)];

    setCurrentInterval(randomInterval);
    const currenInt = intervalSteps[randomInterval];

    let currentIndex = 0;

    const playNextSound = async () => {
      if (currentIndex >= currenInt.length) {
        return;
      }

      const soundName = currenInt[currentIndex];
      const folder = soundFolders[state.instrument];

      if (!folder) {
        console.error(`Instrument "${state.instrument}" not found.`);
        return;
      }

      try {
        const file = folder(`./${soundName}.mp3`);
        const asset = Asset.fromModule(file);

        let soundObject = new Audio.Sound();
        setCurrentSoundObject(soundObject);

        await soundObject.loadAsync({ uri: asset.uri });
        await soundObject.playAsync();

        setTimeout(async () => {
          try {
            await soundObject.stopAsync();
            await soundObject.unloadAsync();
            currentIndex++;
            playNextSound();
          } catch (err) {
            console.error("Error stopping/unloading:", err);
          }
        }, 500);
      } catch (error) {
        console.error(`Error playing sound ${soundName}:`, error);
      }
    };

    playNextSound();
    setIsAnswered(false);
    setUserSelection(null);
  };
  // ----------- نهاية التعديل -----------

  // ----------- تم التعديل هنا -----------
  const playSpecificInterval = async (intervalName: string) => {
    if (currentSoundObject) {
      try {
        await currentSoundObject.stopAsync();
        await currentSoundObject.unloadAsync();
        setCurrentSoundObject(null);
      } catch (error) {
        console.warn("Error stopping/unloading current sound:", error);
      }
    }

    const currenInt = intervalSteps[intervalName];
    let currentIndex = 0;

    const playNextSound = async () => {
      if (currentIndex >= currenInt.length) {
        return;
      }

      const soundName = currenInt[currentIndex];
      const folder = soundFolders[state.instrument];

      if (!folder) {
        console.error(`Instrument "${state.instrument}" not found.`);
        return;
      }

      try {
        const file = folder(`./${soundName}.mp3`);
        const asset = Asset.fromModule(file);
        let soundObject = new Audio.Sound();
        setCurrentSoundObject(soundObject);

        await soundObject.loadAsync({ uri: asset.uri });
        await soundObject.playAsync();

        setTimeout(async () => {
          try {
            await soundObject.stopAsync();
            await soundObject.unloadAsync();
            currentIndex++;
            playNextSound();
          } catch (err) {
            console.error("Error stopping/unloading:", err);
          }
        }, 500);
      } catch (error) {
        console.error(`Error playing sound ${soundName}:`, error);
      }
    };

    playNextSound();
  };
  // ----------- نهاية التعديل -----------

  const handleSelection = (interval: string) => {
    playSpecificInterval(interval);
    if (!isAnswered) {
      setUserSelection(interval);
      setFirstAttempt(false);
      // update the score state accrordingly;

      if (interval === currentInterval) {
        if (firstAttempt) {
          setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
        }
        // setIsAnswered(true);
        setShowAnswer(true);

        if (state.autoQuestionJump) {
          setTimeout(() => {
            playInterval();
          }, 3500);
        }
      } else {
        if (firstAttempt) {
          setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }
      }
    }
  };

  const toggleInterval = (interval: string) => {
    setSelectedIntervals((prev) =>
      prev.includes(interval)
        ? prev.filter((i) => i !== interval)
        : [...prev, interval]
    );
  };

  const toggleModal = () => setModalVisible(!modalVisible);
  const intervalsListFromLacale =
    state.labels.intervalsTraingingPage.intervalsNamesMap;

  // ----------- تم التعديل هنا -----------
  const repeatInterval = async () => {
    if (!selectedIntervals.length) return;
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
    if (!currentInterval) return;

    const currenInt = intervalSteps[currentInterval];

    let currentIndex = 0;

    const playNextSound = async () => {
      if (currentIndex >= currenInt.length) {
        return;
      }

      const soundName = currenInt[currentIndex];
      console.log("playing", currenInt);
      const folder = soundFolders[state.instrument];

      if (!folder) {
        console.error(`Instrument "${state.instrument}" not found.`);
        return;
      }

      try {
        const file = folder(`./${soundName}.mp3`);
        const asset = Asset.fromModule(file);

        let soundObject = new Audio.Sound();
        setCurrentSoundObject(soundObject);

        await soundObject.loadAsync({ uri: asset.uri });
        await soundObject.playAsync();

        setTimeout(async () => {
          try {
            await soundObject.stopAsync();
            await soundObject.unloadAsync();
            currentIndex++;
            playNextSound();
          } catch (err) {
            console.error("Error stopping/unloading:", err);
          }
        }, 500);
      } catch (error) {
        console.error(`Error playing sound ${soundName}:`, error);
      }
    };

    playNextSound();
    setIsAnswered(false);
    setUserSelection(null);
  };
  // ----------- نهاية التعديل -----------

  const handlePlayInterval = () => {
    playInterval();
  };

  return (
    <ImageBackground
      source={require("../assets/images/intervals_bg.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={[
            styles.selectedInstCont,
            { direction: state.language === "ar" ? "rtl" : "ltr" },
          ]}
        >
          <Text style={styles.buttonText}>{lables.selectedInstrumnet}</Text>
          <Image
            source={instrumentImages[state.instrument]}
            style={styles.instIcon}
          />
        </View>
        <Text style={styles.title}>{lables.title}</Text>
        <View style={styles.scoreContainer}>
          {/* <Text style={styles.questionNumber}>{questionNumber}/10</Text> */}
          <Text style={styles.score}>
            {state.labels.introGamePage.levelPage.correct}{" "}
            <Text style={{ color: "green" }}>{score.correct} </Text> |
            {state.labels.introGamePage.levelPage.incorrect}{" "}
            <Text style={{ color: "red" }}>{score.incorrect} </Text>
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            {state.labels.questionNo}: {questionNumber}
          </Text>
        </View>

        <View style={styles.playButtonContiner}>
          <PlayButton
            isPlaying={isPlaying}
            label={lables.playInterval}
            playInterval={handlePlayInterval}
          />
          <RepeatButton
            isPlaying={isPlaying}
            label={lables.repeatButton}
            repeatInterval={repeatInterval}
          />
        </View>

        <View style={styles.intervalContainer}>
          {selectedIntervals.map((interval) => (
            <OptionButton
              key={interval}
              userSelection={userSelection}
              interval={interval}
              label={
                intervalsListFromLacale[
                  interval as keyof typeof intervalsListFromLacale
                ]
              }
              currentInterval={currentInterval}
              handleSelection={handleSelection}
              isAnswered={isAnswered}
            />
          ))}
        </View>

        <View style={styles.settingsBtCont}>
          <TouchableOpacity
            style={styles.repeatButton}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.settingsBtnContainer}>
              <Ionicons name="settings-outline" size={16} color="black" />
              <Text style={styles.buttonText}>{lables.settings}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* {showAnswer && (
          <Text style={styles.buttonText}>
            {state.labels.correctAnswer}
            {state.language === "en"
              ? currentInterval
              : intervalMap[currentInterval as keyof typeof intervalMap]}
          </Text>
        )} */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {lables.intervalsSettings}
                </Text>
                <Text style={styles.chooseText}>{lables.chooseIntervals}:</Text>
                <View style={styles.intervalSelectionContainer}>
                  {Object.keys(intervalSteps).map((interval) => (
                    <OptionButton2
                      label={
                        intervalsListFromLacale[
                          interval as keyof typeof intervalsListFromLacale
                        ]
                      }
                      key={interval}
                      selectedIntervals={selectedIntervals}
                      interval={interval}
                      toggleInterval={toggleInterval}
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
    </ImageBackground>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#5c3829",
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
  noteButton: {
    backgroundColor: "#336660",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: "#fff",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  chooseText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#5c3829",
  },
  intervalSelectionContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  buttonText: {
    fontSize: 18,
    color: "#5c3829",
    marginLeft: 5,
  },
  settingsBtCont: {
    marginTop: 20,
  },
  playButtonContiner: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop: 20,
    color: "#5c3829",
  },
  playButton: {
    backgroundColor: "#f3b7ad",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
  },
  repeatButton: {
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

  intervalContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  intervalButton: {
    backgroundColor: "#fbe0cb",
    padding: 15,
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
  scaleContainer: { flexDirection: "row", marginBottom: 10 },
  scaleButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
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
});

export default IntervalTrainingScreen;

import React, { createContext, useEffect, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../constants/colors'

const styleContext = createContext();

function StyleContextProvider({ children }) {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  function onDimensionsChange() {
    let { height, width } = Dimensions.get('window');
    setDimensions({ height, width });
  }

  useEffect(() => {
    onDimensionsChange();
    Dimensions.addEventListener('change', onDimensionsChange);
    return () => Dimensions.removeEventListener('change', onDimensionsChange);
  }, []);

  return (
    <styleContext.Provider
      value={{
        ...styles,
        navigationContainer: [styles.navigationContainer, { width: dimensions.width / 1 }],
        inputsContainer: [styles.inputsContainer, { width: dimensions.width / 1.05, maxHeight: dimensions.height / 4.5 }],
        input: [styles.input, { width: dimensions.width / 2.1 }],
        inputRequired: [styles.input, { width: dimensions.width / 2.1, borderColor: 'red' }],
        timeInput: [styles.timeInput, { width: dimensions.width / 2.1 }],
        timeInputRequired: [styles.timeInput, { width: dimensions.width / 2.1, borderColor: 'red' }],
        nameInput: [styles.nameInput, { height: dimensions.height / 16, fontSize: dimensions.height / 40, marginHorizontal: dimensions.width / 80 }],
        groupNames: [styles.groupNames, { minWidth: dimensions.width / 3.5 }],
        textNameInput: [styles.textNameInput, { fontSize: dimensions.height / 40 }],
        buttonImage: [styles.buttonImage, { width: dimensions.width / 3, height: dimensions.width / 3 }],
        existingGroupsContainer: [styles.existingGroupsContainer, { width: dimensions.width / 1.1, maxHeight: dimensions.height / 2.5 }],
        alert: [styles.alert, { marginTop: dimensions.height / 5.5, maxWidth: dimensions.width / 1.1 }],
        homeButton: [styles.homeButton, { width: dimensions.width / 2.25 }],
        firstImage: [styles.firstImage, { width: dimensions.width / 1.85, height: dimensions.width / 1.85, marginBottom: dimensions.height / 40 }],
        endTimeImage: [styles.firstImage, { width: dimensions.width / 1.4, height: dimensions.width / 1.4 }],
        mainImage: [styles.firstImage, {
          width: dimensions.width / 1.4,
          height: dimensions.width / 1.4,
          marginTop: -dimensions.height / 7,
          marginBottom: dimensions.height / 10
        }]
      }}
    >
      {children}
    </styleContext.Provider>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1
  },
  directionRow: {
    flexDirection: 'row'
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backGround
  },
  container: {
    flex: 1,
    direction: "rtl",
    backgroundColor: Colors.backGround,
    alignItems: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  mainTitle: {
    fontSize: 60,
    color: Colors.font,
    fontFamily: 'Assistant',
    marginHorizontal: 20,
    letterSpacing: 5
  },
  title: {
    fontSize: 22,
    color: Colors.font,
    fontFamily: 'Assistant',
    textAlign: "center",
    marginHorizontal: 20
  },
  guardPostNameTitle: {
    fontSize: 22,
    color: Colors.font,
    fontFamily: 'Assistant',
    textAlign: "center",
    margin: 20
  },
  homeTitle: {
    fontSize: 18,
    color: Colors.font,
    fontFamily: 'Assistant'
  },
  homeButton: {
    padding: 12.5,
    borderRadius: 10,
    backgroundColor: Colors.darkGreen,
    alignItems: "center"
  },
  firstImage: {
    resizeMode: "stretch",
    marginVertical: 3
  },
  input: {
    borderColor: Colors.darkGreen,
    fontFamily: 'Assistant',
    borderBottomWidth: 4.1,
    color: Colors.font,
    fontSize: 25,
    textAlign: "center",
    marginVertical: 3
  },
  timeInput: {
    borderColor: Colors.darkGreen,
    fontFamily: 'Assistant',
    borderBottomWidth: 4.1,
    color: Colors.font,
    marginVertical: 20,
    fontSize: 25,
    textAlign: "center",
    alignItems: "center"
  },
  text: {
    color: Colors.font,
    textAlign: "center",
    fontSize: 25
  },
  circle: {
    backgroundColor: Colors.green,
    borderRadius: 6,
    width: 6,
    height: 6,
    marginHorizontal: 2
  },
  bigCircle: {
    backgroundColor: Colors.green,
    borderRadius: 12,
    width: 12,
    height: 12,
    marginHorizontal: 2
  },
  inputsContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "stretch"
  },
  nameInput: {
    backgroundColor: Colors.darkGreen,
    color: Colors.font,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: 2,
    borderRadius: 8,
    flex: 1
  },
  textNameInput: {
    color: Colors.font,
    textAlign: "center",
    margin: 2,
    borderRadius: 8,
  },
  leftButtonImageContainer: {
    flex: 1,
    alignItems: "center",
    borderColor: Colors.darkGreen,
    borderRightWidth: 2.5,
  },
  rightButtonImageContainer: {
    flex: 1,
    alignItems: "center",
    borderColor: Colors.darkGreen,
    borderLeftWidth: 2.5,
  },
  line: {
    flex: 1,
    backgroundColor: Colors.darkGreen,
    height: 5,
    margin: 5
  },
  buttonImage: {
    resizeMode: "stretch",
  },
  smallTitle: {
    fontSize: 17,
    color: Colors.font,
    fontFamily: 'Assistant',
  },
  boldTitle: {
    fontSize: 18,
    color: Colors.font,
    fontFamily: 'Assistant',
    fontWeight: "bold",
    borderColor: Colors.darkGreen,
    borderBottomWidth: 4.1,
  },
  questionButton: {
    width: 25,
    height: 25,
    marginHorizontal: 5,
    marginVertical: 30
  },
  explanation: {
    fontSize: 14,
    color: Colors.green,
    textAlign: "center",
    marginHorizontal: 5,
  },
  resultContainer: {
    backgroundColor: Colors.backGround,
    flex: 1,
    paddingTop: 25
  },
  buttonContainer: {
    padding: 5,
    alignItems: "center"
  },
  savedText: {
    fontSize: 20,
    color: Colors.font,
    padding: 2.5
  },
  smallImage: {
    width: 50,
    height: 50,
    resizeMode: "stretch"
  },
  nameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    borderBottomColor: Colors.backGround,
    borderBottomWidth: 3,
    paddingTop: 3
  },
  guardPostName: {
    color: Colors.font,
    fontSize: 23.5,
    textAlign: 'center',
  },
  day: {
    color: Colors.font,
    fontSize: 22.5,
    marginLeft: 0,
    fontStyle: 'italic'
  },
  name: {
    color: Colors.font,
    fontSize: 22.5,
    marginLeft: 0
  },
  time: {
    fontSize: 22,
    color: Colors.font,
  },
  topBarResult: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  resultTitle: {
    fontSize: 27.5,
    color: Colors.font,
    marginHorizontal: 20,
    marginBottom: 5
  },
  resultRow: {
    flex: 1,
    alignItems: "center"
  },
  timeRow: {
    flex: 1,
    flexDirection: "row-reverse"
  },
  resultTitleContainer: {
    alignItems: "center"
  },
  existingGroupsContainer: {
    marginVertical: 10,
    alignItems: "stretch",
  },
  trashImage: {
    position: "absolute",
    left: "1%"
  },
  centerTitle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  historyContainer: {
    backgroundColor: Colors.backGround,
    flex: 1,
    paddingTop: 25
  },
  historyTitle: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  subTitleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5
  },
  subTitle: {
    flex: 4,
    alignItems: "center"
  },
  subTitleText: {
    fontSize: 22.5,
    color: Colors.font,
    marginVertical: 5,
    textAlign: "center"
  },
  buttonText: {
    fontSize: 25,
    color: Colors.font,
    borderBottomColor: Colors.backGround,
    borderBottomWidth: 3,
    padding: 2.5
  },
  namesContainer: {
    flex: 1,
    backgroundColor: Colors.darkGreen,
    margin: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 15,
    alignItems: "stretch",
    elevation: 3

  },
  bottomLine: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15
  },
  bottomButtonContainer: {
    justifyContent: "center",
    flex: 0.5,
    alignItems: "center"
  },
  button: {
    color: Colors.green,
    fontSize: 24,
    paddingHorizontal: 20,
  },
  circleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  comeBack: {
    resizeMode: "stretch",
    width: 26,
    height: 26,
  },
  alertScreen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.darkGreen
  },
  alert: {
    padding: 20,
    backgroundColor: Colors.backGround,
    borderRadius: 8,
    elevation: 5,
    alignItems: "center"
  },
  modalButtonContainer: {
    flexDirection: "row",
    padding: 10
  },
  save: {
    color: Colors.font,
    fontSize: 20,
    fontFamily: "Assistant",
    padding: 5,
    margin: 5,
    borderBottomWidth: 4.1,
    borderBottomColor: "green",
  },
  dontSave: {
    color: Colors.font,
    fontSize: 20,
    fontFamily: "Assistant",
    padding: 5,
    margin: 5,
    borderBottomWidth: 4.1,
    borderBottomColor: "red",
  },
  rule: {
    color: 'red',
    paddingTop: 10
  },
  topMethodButtonContainer: {
    flexDirection: 'row',
    marginTop: 20
  }
});

export { styleContext, StyleContextProvider };
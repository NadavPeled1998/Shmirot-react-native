import React, { useState, useContext } from 'react'
import { View, Image, Text, TextInput } from 'react-native'
import { inject, observer } from 'mobx-react'
import Bottom from '../../components/Bottom'
import Images from '../../assets'
import { styleContext } from '../../styles'

function CycleHourScreen({ navigation, store }) {
    const [enteredValue, setEnteredValue] = useState("")
    const [rule, setRule] = useState('')
    const styles = useContext(styleContext);


    function changeNumberHandler(inputText) {
        setEnteredValue(inputText.replace(/[^0-9]/g, ""))
        setRule('')
    }

    function moveToResult() {
        const { startTime, endTime } = store
        let endHours = Number(endTime.split(":").shift())
        let startHours = Number(startTime.split(":").shift())
        let hours = endHours - startHours;
        if (hours < 0) hours += 24;
        const numOfHours = parseInt(enteredValue)
        if (isNaN(numOfHours) || numOfHours > hours) {
            setRule(isNaN(numOfHours)
                ? 'צריך למלא כמה זמן כל שמירה'
                : 'אי אפשר שכל שמירה תהיה יותר ארוכה מסך כל השמירות')
            return null
        }
        store.setCycle(numOfHours)
        navigation.navigate('CreateListScreen/ResultScreen')
    }

    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Image
                    style={styles.firstImage}
                    resizeMethod="resize"
                    source={Images.postGuardName}
                />
                <Text style={styles.title}>כמה שעות כל חייל הולך לשמור?</Text>
                <TextInput
                    keyboardType="number-pad"
                    maxLength={2}
                    style={rule ? styles.inputRequired : styles.input}
                    value={enteredValue}
                    onChangeText={changeNumberHandler}
                    onSubmitEditing={moveToResult}
                />
                <Text style={styles.rule}>{rule}</Text>
            </View>
            <View style={{ flex: 0.45 }}/>
            <Bottom
                back={() => navigation.navigate('CreateListScreen/CheckIfCyclicScreen')}
                forward={moveToResult}
                circles={!(store.group) ? 8 : 7}
                bigCircle={!(store.group) ? 7 : 6}
            />
        </View>
    )
}

export default inject("store")(observer(CycleHourScreen))
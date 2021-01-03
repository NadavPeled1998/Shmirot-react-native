import React, { useState, useContext } from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'
import { inject, observer } from "mobx-react"
import DateTimePicker from '@react-native-community/datetimepicker'
import Bottom from '../../components/Bottom'
import Images from '../../assets'
import { styleContext } from '../../styles'


function StartTimeScreen({ navigation, store }) {
    const [startTime, setStartTime] = useState("")
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [rule, setRule] = useState('')

    const styles = useContext(styleContext)

    function timeHandler() {
        setShow(true)
    }

    async function onChange(event, selectedDate) {
        if (selectedDate) {
            if (mode === 'date') {
                store.setStartDate(selectedDate)
                setMode('time')
                setRule('')
            }
            else {
                let hour = selectedDate.getHours()
                let minute = selectedDate.getMinutes()
                if (hour < 10) hour = "0" + hour
                if (minute < 10) minute = "0" + minute
                setShow(false)
                setStartTime(`${hour}:${minute}`);
                setDate(selectedDate)
                setMode('date')
                store.setStartTime(`${hour}:${minute}`)
                setRule('')
            }
        }
        else setShow(false)
    }

    async function movetoEndTimeForward() {
        if (startTime.length === 5) navigation.navigate('CreateListScreen/EndTimeScreen')
        else setRule('חובה לבחור שעת התחלה')
    }

    async function moveBack() {
        if (store.guardPosts.length > 1) navigation.navigate('CreateListScreen/GuardPostsNameScreen')
        else navigation.navigate('CreateListScreen/NumGuardPostsScreen')
    }

    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Image
                    style={styles.firstImage}
                    source={Images.startTime}
                    resizeMethod="resize"
                />
                <Text style={styles.title}>מתי מתחילה השמירה?</Text>
                <TouchableOpacity onPress={timeHandler} style={rule ? styles.timeInputRequired : styles.timeInput}>
                    <Text style={styles.text}>
                        {startTime}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.rule}>{rule}</Text>
                {show &&
                    <DateTimePicker
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        minimumDate={new Date()}
                    />
                }
            </View>
            <View style={{ flex: 0.2 }}/>
            <Bottom
                forward={movetoEndTimeForward}
                back={moveBack}
                circles={!(store.group) ? 8 : 7}
                bigCircle={!(store.group) ? 4 : 3}
            />
        </View>
    )
}

export default inject("store")(observer(StartTimeScreen)) 
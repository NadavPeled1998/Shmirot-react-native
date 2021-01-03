import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { inject, observer } from 'mobx-react'
import DateTimePicker from '@react-native-community/datetimepicker'
import Bottom from '../../components/Bottom'
import Images from '../../assets'
import { styleContext } from '../../styles'

function EndTimeScreen({ navigation, store }) {
    const [endTime, setEndTime] = useState("")
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [addHours, setAddHours] = useState(0)
    const [rule, setRule] = useState('')

    const styles = useContext(styleContext)

    function timeHandler() {
        setShow(true)
    }
    async function onChange(event, selectedDate) {
        if (selectedDate) {
            if (mode === 'date') {
                setShow(false)
                setAddHours(Math.floor((selectedDate.getTime() - store.startDate.getTime()) / (1000 * 60 * 60 * 24)))
                setMode('time')
                setShow(true)
                setRule('')
            }
            else {
                let hour = selectedDate.getHours()
                let minute = selectedDate.getMinutes()
                if (hour < 10) hour = "0" + hour
                if (minute < 10) minute = "0" + minute
                setShow(false)
                setEndTime(`${hour}:${minute}`);
                setDate(selectedDate)
                const { startTime } = store
                let sHour = Number(startTime[0] + startTime[1]);
                let sMinute = Number(startTime[3] + startTime[4]);
                let addDay = 0
                if (!addHours && (Number(hour) < sHour || (Number(hour) == sHour && Number(minute) < sMinute))) addDay = 24
                let endHour = selectedDate.getHours() + (addHours * 24) + addDay
                if (endHour < 10) endHour = "0" + endHour
                store.setEndTime(`${endHour}:${minute}`)
            }
        }
        else setShow(false)
    }

    function movetoButtons() {
        if (endTime.length === 5) navigation.navigate('CreateListScreen/CheckIfCyclicScreen')
        else setRule('צריך לבחור שעת סיום')
    }

    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Image
                    style={styles.endTimeImage}
                    source={Images.endTime}
                    resizeMethod="resize"
                />
                <TouchableOpacity onPress={timeHandler} style={rule ? styles.timeInputRequired : styles.timeInput}>
                    <Text style={styles.text}>
                        {endTime}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.rule}>{rule}</Text>
                {show &&
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        minimumDate={store.startDate}
                        onChange={onChange}
                    />
                }
            </View>
            <View style={{ flex: 0.25 }} />
            <Bottom
                back={() => navigation.navigate('CreateListScreen/StartTimeScreen')}
                forward={movetoButtons}
                circles={!(store.group) ? 8 : 7}
                bigCircle={!(store.group) ? 5 : 4}
            />
        </View>
    )
}

export default inject("store")(observer(EndTimeScreen)) 
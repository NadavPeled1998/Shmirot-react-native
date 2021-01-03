import React, {useState, useContext} from 'react'
import {View, Text, TouchableOpacity, Image} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import Bottom from '../../components/Bottom'
import { inject, observer } from "mobx-react";
import { styleContext } from '../../Style';
import Colors from '../../constants/colors'

function EndTimeScreen({navigation, store}){
    const [endTime, setEndTime] = useState("")
    const [date, setDate] = useState(store.startDate);
    const [rule, setRule] = useState('')

    const styles = useContext(styleContext)

    async function onChange (event, selectedDate) {
        if(selectedDate){
                let hour = selectedDate.getHours()
                let minute = selectedDate.getMinutes()
                if(hour<10){
                    hour = "0" + hour
                }
                if(minute<10){
                    minute = "0" +minute
                }
                const { startTime } = store 
                let sHour = Number(startTime[0] + startTime[1]);
                let sMinute = Number(startTime[3] + startTime[4]);
                let addDay = 0
                if(Number(hour)<sHour || (Number(hour) == sHour && Number(minute)<sMinute)){
                    addDay = 24
                }
                const addHours = Math.floor((selectedDate.getTime() - store.startDate.getTime())/(1000*60*60*24))
                let endHour = selectedDate.getHours() + (addHours*24) + addDay
                if(endHour<10){
                    endHour = "0" + endHour
                }
                setEndTime(`${hour}:${minute}`);
                setDate(selectedDate)
                store.setEndTime(`${endHour}:${minute}`)
                setRule('')
        }
    }

    function movetoButtons(){
        if(endTime.length === 5){
            navigation.navigate('CreateListScreen/CheckIfCyclicScreen')
        }
        else{
            setRule('צריך לבחור שעת סיום')
        }
    }

    return(
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Image
                    style={styles.endTimeImage}
                    source={require('../../assets/end-time.png')}
                />
                <Text style={styles.rule}>{rule}</Text>
                <View style={{ width: 400, alignItems:'center'}}>
                <DateTimePicker
                    value={date}
                    onChange={onChange}
                    mode='datetime'
                    minimumDate={store.startDate}
                    style={{height:50, backgroundColor: Colors.backGround, width: 300}}
                />
                </View>
            </View>
            <View style={{flex: 0.25}}></View>
            <Bottom 
                back={()=> navigation.navigate('CreateListScreen/StartTimeScreen')} 
                forward={movetoButtons} 
                circles={!(store.group) ? 8 : 7} 
                bigCircle={!(store.group) ? 5 : 4}
            />
        </View>
    )
}

export default inject("store")(observer(EndTimeScreen)) 
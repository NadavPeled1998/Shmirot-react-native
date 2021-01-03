import React, {useState, useContext} from 'react'
import {View, Image, Text, TouchableOpacity, Modal} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import Bottom from '../../components/Bottom'
import { inject, observer } from "mobx-react";
import { styleContext } from '../../Style';
import Colors from '../../constants/colors'


function StartTimeScreen({navigation, store}){
    const [startTime, setStartTime] = useState("")
    const [date, setDate] = useState(new Date());
    const [rule, setRule] = useState('')

    const styles = useContext(styleContext)

    async function onChange (event, selectedDate) {
        console.log("selecteddate", selectedDate)
        if(selectedDate){
                let hour = selectedDate.getHours()
                let minute = selectedDate.getMinutes()
                if(hour<10){
                    hour = "0" + hour
                }
                if(minute<10){
                    minute = "0" +minute
                }
                setStartTime(`${hour}:${minute}`);
                setDate(selectedDate)
                store.setStartDate(selectedDate)
                store.setStartTime(`${hour}:${minute}`)
                setRule('')
        }
    }
    
    async function movetoEndTimeForward(){
        if(startTime.length === 5){
            navigation.navigate('CreateListScreen/EndTimeScreen')
        }
        else{
            setRule('חובה לבחור שעת התחלה')
        }
    }

    async function moveBack(){
        if(store.guardPosts.length > 1){
            navigation.navigate('CreateListScreen/GuardPostsNameScreen')
        }
        else{
            navigation.navigate('CreateListScreen/NumGuardPostsScreen')
        }
    }

    return(
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Image
                style={styles.firstImage}
                source={require('../../assets/start-time.png')}
                />
                <Text style={styles.title}>מתי מתחילה השמירה?</Text>
                <Text style={styles.rule}>{rule}</Text>
                <View style={{ width: 400, alignItems:'center'}}>
                <DateTimePicker
                    value={date}
                    onChange={onChange}
                    mode='datetime'
                    minimumDate={new Date()}
                    style={{height:50, backgroundColor: Colors.backGround, width: 300}}
                />
                </View>
            </View>
            <View style={{flex: 0.2, backgroundColor: 'white', border: '1px solid black'}}></View>
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
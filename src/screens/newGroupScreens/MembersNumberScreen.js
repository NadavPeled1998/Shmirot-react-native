import React, {useState, useEffect, useContext} from 'react'
import {View, Image, Text, TextInput} from 'react-native'
import Bottom from '../../components/Bottom'
import { inject, observer } from "mobx-react";
import { styleContext } from '../../Style';

function MembersNumberScreen({navigation, store}){
    const [enteredValue, setEnteredValue] = useState('')
    const [rule, setRule] = useState('')

    const styles = useContext(styleContext);
    
    useEffect(()=> {
        store.resetGroup()
    },[])

    function changeNumberHandler(inputText){
        setEnteredValue(inputText.replace(/[^0-9]/g, ""))
        setRule('')
    }

    async function moveToSecondNewGroupsScreen(){
        const numberOfMembers = parseInt(enteredValue)
        if(isNaN(numberOfMembers) || numberOfMembers < 2){
            setRule('צריך לפחות שני חיילים בשביל ליצור רשימת שמירה')
            return null
        }else if(numberOfMembers >99){
            setRule('אי אפשר ליצור רשימת שמירה עם יותר מ100 משתתפים')
            return null
        }
        store.setNum(numberOfMembers)
        setRule('')
        navigation.navigate('CreateListScreen/MembersNameScreen')
    }

    return(
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Image 
                style={styles.firstImage}
                source={require('../../assets/new-vest.png')}
                />
                <Text style={styles.title}>כמה חיילים הולכים לשמור?</Text>
                <TextInput
                    keyboardType="numbers-and-punctuation"
                    maxLength={2}
                    style={rule ? styles.inputRequired :styles.input}
                    value={enteredValue}
                    onChangeText={changeNumberHandler}
                    onSubmitEditing={moveToSecondNewGroupsScreen}
                />
                <Text style={styles.rule}>{rule}</Text>
            </View>
            <View style={{flex: 0.2}}></View>
            <Bottom 
                back={() => navigation.navigate('HomeScreen')} 
                forward={moveToSecondNewGroupsScreen} 
                circles={8} 
                bigCircle={0}
            />
        </View>
    )
}

export default inject("store")(observer(MembersNumberScreen))
import React, {useState, useEffect, useContext} from 'react'
import {View, Image, Text, TextInput} from 'react-native'
import Bottom from '../../components/Bottom'
import { inject, observer } from "mobx-react";
import { styleContext } from '../../Style';

function NumGuardPostsScreen({navigation, store}){
    const [enteredValue, setEnteredValue] = useState("")
    const [rule, setRule] = useState("")

    const styles = useContext(styleContext);

    function changeNumberHandler(inputText){
        setEnteredValue(inputText.replace(/[^0-9]/g, ""))
        setRule('')
    }

    async function moveToNextPage(){
        const numberOfGuardPosts = parseInt(enteredValue)
        if(store.members.length < numberOfGuardPosts){
            setRule('אי אפשר שיהיה יותר עמדות מחיילים')
        }
        else if(isNaN(numberOfGuardPosts) || numberOfGuardPosts < 2 ){
            store.setNumGuardPosts(1)
            store.setGuardPosts([])
            navigation.navigate('CreateListScreen/StartTimeScreen')
        }
        else{
            store.setNumGuardPosts(numberOfGuardPosts)
            navigation.navigate('CreateListScreen/GuardPostsNameScreen')
        }
    }

    return(
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Image 
                    style={styles.firstImage}
                    source={require('../../assets/post-guard.png')}
                />
                <Text style={styles.title}>כמה עמדות?</Text>
                <TextInput
                    keyboardType="numbers-and-punctuation"
                    maxLength={2}
                    style={rule ? styles.inputRequired :styles.input}
                    value={enteredValue}
                    onChangeText={changeNumberHandler}
                    onSubmitEditing={moveToNextPage}
                />
                <Text style={styles.rule}>{rule}</Text>
            </View>
            <View style={{flex: 0.2}}></View>
            <Bottom 
                back={() => navigation.navigate('CreateListScreen/MembersNameScreen')} 
                forward={moveToNextPage}
                circles={!(store.group) ? 8 : 7}
                bigCircle={!(store.group) ? 2 : 1}
            />
        </View>
    )
}

export default inject("store")(observer(NumGuardPostsScreen))
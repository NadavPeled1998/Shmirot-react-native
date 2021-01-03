import React, {useState, useEffect, useContext} from 'react'
import {View, Image, Text, TextInput, TouchableOpacity} from 'react-native'
import Bottom from '../../components/Bottom'
import { inject, observer } from "mobx-react";
import { styleContext } from '../../Style';

function CheckIfCyclicScreen({navigation, store}){
    const styles = useContext(styleContext);

    async function setCycle(cycle){
        if(cycle){
            store.setMethod('cycle')
            navigation.navigate('CreateListScreen/CycleHourScreen')
        }
    }

    return(
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Image 
                style={styles.firstImage}
                source={require('../../assets/recycle.png')}
                />
                <Text style={styles.title}>האם השמירות הן מחזוריות?</Text>
                <View style={styles.navigationContainer}>
            <TouchableOpacity style={styles.homeButton} onPress={setCycle}>
                <Text style={styles.homeTitle}>
                כן
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('CreateListScreen/ChooseMethodScreen')}> 
                <Text style={styles.homeTitle}>
                לא
                </Text>                                                          
            </TouchableOpacity>
            </View>
            </View>
            <Bottom 
                back={() => navigation.navigate('CreateListScreen/EndTimeScreen')}
                circles={!(store.group) ? 8 : 7} 
                bigCircle={!(store.group) ? 6 : 5 }
            />
        </View>
    )
}

export default inject("store")(observer(CheckIfCyclicScreen))
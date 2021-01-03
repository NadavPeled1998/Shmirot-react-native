import React, {useState, useContext} from 'react'
import {View, Image, Text, TouchableOpacity} from 'react-native'
import Bottom from '../../components/Bottom'
import { inject, observer } from "mobx-react";
import { styleContext } from '../../Style';

function ChooseMethodScreen({navigation, store}){
    const [method, setMethod] = useState("")
    const [explantion, setExplantion] = useState(false)

    const styles = useContext(styleContext)

    async function getList(){
        store.setMethod(method || 'random')
        navigation.navigate('CreateListScreen/ResultScreen')    
    }
    
    return(
    <View style={styles.container}>
            <View style={styles.centerContainer}>
             <Text style={styles.title}> איך תרצו לסדר את הרשימה?</Text>
            <View style={{flexDirection: "row", marginTop: 20}}>
            <TouchableOpacity onPress={()=> setMethod("random")} style={styles.leftButtonImageContainer}>
                <Image 
                style={styles.buttonImage}
                source={require('../../assets/new-random.png')}/>
                {method === "random" ?
                <> 
                <Text style={styles.boldTitle}>
                 רשימה רנדומלית
                </Text> 
                <View style={styles.boldTitleBorder}/>
                </> :
                <Text style={styles.smallTitle}>
                  רשימה רנדומלית        
                </Text>
                }
            {explantion &&
            <Text style={styles.explantion}>
            הרשימה תהיה מסודרת בצורה רנדומלית
            </Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMethod("order")} style={styles.rightButtonImageContainer}>
                <Image
                style={styles.buttonImage}
                source={require('../../assets/new-order.png')}/>
                {method === "order" ? 
                <>
                <Text style={styles.boldTitle}>
                    רשימה לפי הסדר
                </Text> 
                <View style={styles.boldTitleBorder}/>
                </>:
                <Text style={styles.smallTitle}>
                רשימה לפי הסדר
            </Text>}
            {explantion &&
            <Text style={styles.explantion}>
            הרשימה תהיה מסודרת לפי הסדר שהכנסתם
            </Text>}
            </TouchableOpacity>
            </View>
            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            {(!!store.group && !store.guardPosts.length) && (
            <View style={styles.line}></View>
            )}
            <TouchableOpacity onPress={()=> {setExplantion(!(explantion))}}>
            <Image
                style={styles.questionButton}
                source={require('../../assets/question.png')}/>
            </TouchableOpacity>
            {(!!store.group && !store.guardPosts.length) && (
            <View style={styles.line}></View>
            )}
            </View>
            {(!!store.group && !store.guardPosts.length) && (
            <View style={{flexDirection: "row"}}>
            <TouchableOpacity onPress={() => setMethod("forward")} style={styles.leftButtonImageContainer}>
                <Image
                style={styles.buttonImage}
                source={require('../../assets/forward.png')}/>
                {method === "forward" ? 
                <>
                <Text style={styles.boldTitle}>
                אחד קדימה
                </Text> 
                <View style={styles.boldTitleBorder}/>
                </> :
                <Text style={styles.smallTitle}>
                    אחד קדימה
            </Text>}
            {explantion &&
            <Text style={styles.explantion}>
            אותו הסדר כמו ממקודם, אחד קדימה
            </Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMethod("fair")} style={styles.rightButtonImageContainer} >
                <Image
                style={styles.buttonImage}
                source={require('../../assets/new-libra.png')}/>
                {method === "fair" ? 
                <>
                <Text style={styles.boldTitle}>
                    רשימה חצי רנדומלית
                </Text> 
                <View style={styles.boldTitleBorder}/>
                </>:
                <Text style={styles.smallTitle}>
                רשימה חצי רנדומלית
            </Text>}
            {explantion && 
            <Text style={styles.explantion}>
            מי שיהיו ראשונים/אחרונים לא יהיו שוב עד שכולם יהיו ראשונים/אחרונים
            </Text>}
            </TouchableOpacity>
            </View>
            )} 
            </View>
            <Bottom 
                back={()=> navigation.navigate('CreateListScreen/CheckIfCyclicScreen')} 
                forward={getList} 
                circles={ !(store.group) ? 8 : 7 } 
                bigCircle={ !(store.group) ? 7 : 6 }
            />
        </View>
    )
}

export default inject("store")(observer(ChooseMethodScreen))  
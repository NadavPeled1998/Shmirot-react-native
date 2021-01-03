import React, {useState, useEffect, useContext} from 'react'
import {View, Image, Text, TextInput, FlatList} from 'react-native'
import Bottom from '../../components/Bottom'
import { inject, observer } from "mobx-react";
import { styleContext } from '../../Style';

function GuardPostsNameScreen({navigation, store}){
    const [guardPosts, setGuardPosts] = useState([])

    const styles = useContext(styleContext);
    
    function changeTexInputHandler(inputText,index){
        const newGuardPosts = guardPosts.slice()
        newGuardPosts[index] = inputText
        setGuardPosts(newGuardPosts)
    } 
    
    function getNumOfPostGuards(){
            let guardPostsArray = []
            for(let i = 0; i<store.numGuardPosts; i++){
                guardPostsArray.push(`עמדה מס' ${i+1}`)
            }
            setGuardPosts(guardPostsArray)   
    }

    async function movetoStartTimeForward(){
        let newGuardPosts = []
        for(let i = 0 ;i<guardPosts.length;i++){
            if(guardPosts[i] !== ""){
                newGuardPosts.push(guardPosts[i])
            }
        }
        if(newGuardPosts.length> 1){
            setGuardPosts(newGuardPosts)
            store.setGuardPosts(newGuardPosts)
        }
        else{
            store.setNumGuardPosts(1)
            store.setGuardPosts([])
        }
        navigation.navigate('CreateListScreen/StartTimeScreen')
    }

    useEffect(()=> { 
        getNumOfPostGuards()
    },[])

    return(
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                {/*<Image
                    style={styles.firstImage}
                    source={require('../../assets/post-guard-name.png')}
                />*/}
                <Text style={{fontSize: 22,
    textAlign: "center",
    marginHorizontal: 20,
    marginVertical: 20}}>כאן אתם יכולים לתת שמות לעמדות</Text>
                <View style={styles.inputsContainer}>
                    <FlatList 
                        numColumns = {3}
                        data={guardPosts} 
                        renderItem={itemData => (
                            <TextInput 
                            style={styles.nameInput} 
                            onChangeText={(inputText) => changeTexInputHandler(inputText,itemData.index)}
                            value={itemData.item}/>
                        )}>
                    </FlatList>
                </View>
            </View>
            <View style={{flex: 0.2}}></View>
            <Bottom 
                back={() => navigation.navigate('CreateListScreen/NumGuardPostsScreen')}
                forward={movetoStartTimeForward}
                circles={!(store.group) ? 8 : 7} 
                bigCircle={!(store.group) ? 3 : 2}
            />
        </View>
    )
}

export default inject("store")(observer(GuardPostsNameScreen))
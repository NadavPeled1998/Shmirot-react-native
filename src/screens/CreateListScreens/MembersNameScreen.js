import React, {useState, useEffect, useContext} from 'react'
import {View, Image, Text, TextInput, FlatList} from 'react-native'
import Bottom from '../../components/Bottom'
import { inject, observer } from "mobx-react";
import { styleContext } from '../../Style';

function MembersNameScreen({navigation, store}){
    const [enteredName,setEnteredName] = useState("")
    const [members, setMembers] = useState([])
    const [rule, setRule] = useState('')

    const styles = useContext(styleContext);
    
    function changeTextHandler(inputText){
        setEnteredName(inputText)
        setRule('')
    }
    
    function submitEditingHandler(){
        let newMembers = members.slice()
        let makeMore = true
        for(let i = 0;i<newMembers.length;i++){
            if(newMembers[i] === ""){
                newMembers[i] = enteredName
                makeMore = false
                break
            }
        }
        if(makeMore){
            newMembers.push(enteredName)
        }
        setMembers(newMembers)
    }
    
    function changeTexInputHandler(inputText,index){
        setRule('')
        let newMembers = members.slice()
        newMembers[index] = inputText
        setMembers(newMembers)
    } 
    
    function getNumberOfMembers(){
        if(store.group){
            setMembers([...new Set(store.groups[store.group].members[store.groups[store.group].members.length-1].filter(member => member))])
        }
        else{
            let membersArray = []
            for(let i =0;i<store.num;i++){
                membersArray.push("")
            }
            setMembers(membersArray)   
        }
    }

    async function movetoNumGuardPostsForward(){
        let newMembers = []
        for(let i = 0 ;i<members.length;i++){
            if(members[i] !== ""){
                newMembers.push(members[i])
            }
        }
        if(newMembers.length> 1){
            setMembers(newMembers)
            store.setMembers(newMembers)
            navigation.navigate('CreateListScreen/NumGuardPostsScreen')
        }
        else{
            setRule('צריך לפחות שני חיילים בשביל ליצור רשימת שמירה')
        }
    }

    useEffect(()=> {
        getNumberOfMembers()
    },[])

    return(
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Text style={styles.title}>{store.group 
                ? 'זה הזמן למחוק/להוסיף חברים נוספים..'
                : 'מה השמות שלכם?'
                }
                </Text>
                <TextInput
                style={[rule ? styles.inputRequired : styles.input, {marginBottom:-5}]}
                onChangeText={changeTextHandler}
                onSubmitEditing = {() => {setEnteredName(""), submitEditingHandler(enteredName)}}
                value={enteredName}/>
                <Text style={styles.rule}>{rule}</Text>
                <View style={styles.inputsContainer}>
                    <FlatList 
                        numColumns = {3}
                        data={members} 
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
                back={() => store.group 
                    ? navigation.navigate('History') 
                    : navigation.navigate('NewGroupScreen')}
                forward={movetoNumGuardPostsForward} 
                circles={!(store.group) ? 8 : 7} 
                bigCircle={!(store.group) ? 1 : 0}
            /> 
        </View>
    )
}

export default inject("store")(observer(MembersNameScreen))
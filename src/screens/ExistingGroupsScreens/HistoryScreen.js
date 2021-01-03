import React, {useEffect, useState, useContext} from 'react'
import {View, FlatList, TouchableOpacity, Image, Text, Button, AsyncStorage, Linking, TextInput} from 'react-native'
import Bottom from '../../components/Bottom'
import { inject, observer } from "mobx-react";
import { styleContext } from '../../Style';
import DeleteGroup from '../../components/modals/DeleteGroup';

function History({navigation, store}){
    const [minutes, setMinutes] = useState([])
    const [hours, setHours] = useState([])
    const [members, setMembers] = useState([])
    const [days, setDays] = useState([])
    const [postGuards, setPostGuards] = useState([])
    const [method, setMethod] = useState("")
    const [date, setDate]= useState("")
    const [index, setIndex] = useState(0)
    const [deleteGroupVisible, setDeleteGroupVisible] = useState(false)
    const [week, setWeek] = useState(['ראשון',
        'שני',
        'שלישי',
        'רביעי',
        'חמישי',
        'שישי',
        'שבת'    
    ])

    const styles = useContext(styleContext);

    useEffect(()=> {
        setMethod(store.groups[store.group].method[store.groups[store.group].method.length-1])
        setMembers(store.groups[store.group].members[store.groups[store.group].members.length-1])
        setMinutes(store.groups[store.group].minutes[store.groups[store.group].minutes.length-1])
        setHours(store.groups[store.group].hours[store.groups[store.group].hours.length-1])
        setDays(store.groups[store.group].days ? store.groups[store.group].days[store.groups[store.group].days.length-1] : [])
        setPostGuards(store.groups[store.group].postGuards ? store.groups[store.group].postGuards[store.groups[store.group].postGuards.length-1]: [])
        setDate(store.groups[store.group].date[store.groups[store.group].date.length-1])
        setIndex(store.groups[store.group].members.length)
    },[])

    function newList(){
        console.log("newLIst")
        navigation.navigate('CreateListScreen/MembersNameScreen')
    }

    function goBack(){
        setMethod(store.groups[store.group].method[index-2])
        setDate(store.groups[store.group].date[index-2])
        setMembers(store.groups[store.group].members[index-2])
        setMinutes(store.groups[store.group].minutes[index-2])
        setHours(store.groups[store.group].hours[index-2])
        if(store.groups[store.group].days){
            const diff = store.groups[store.group].members.length - store.groups[store.group].days.length
            setDays(store.groups[store.group].days[index-2-diff] ? store.groups[store.group].days[index-2-diff] : [])
            setPostGuards(store.groups[store.group].postGuards[index-2-diff] ? store.groups[store.group].postGuards[index-2-diff]: [])
        }
        setIndex(index-1)
    }

    function goForward(){
        setMethod(store.groups[store.group].method[index])
        setDate(store.groups[store.group].date[index])
        setMembers(store.groups[store.group].members[index])
        setMinutes(store.groups[store.group].minutes[index])
        setHours(store.groups[store.group].hours[index])
        if(store.groups[store.group].days){
            const diff = store.groups[store.group].members.length-store.groups[store.group].days.length
            setDays(store.groups[store.group].days[index-diff] ? store.groups[store.group].days[index-diff] : [])
            setPostGuards(store.groups[store.group].postGuards[index-diff] ? store.groups[store.group].postGuards[index-diff]: [])
        }
        setIndex(index+1)
    }

    async function sendWhatsappMessage(){
        let methodName = method === "random" ? "רשימה רנדומלית" 
        : method === "order" ? "רשימה לפי הסדר" 
        : method === "fair" ? "רנדומליות הוגנת"
        : method === "forward" ? "אותו הסדר, אחד קדימה"
        : 'רשימה מחזורית'
        console.log("send whatsapp message")
        let message = `${date} | ${methodName} | ${store.group ? store.groups[store.group].minutes.length : 1}
`
        for(let i =0;i<members.length;i++){
            if(members[i]){
                if(store.guardPosts.length){
                    if(memberPostGuard[i] !== memberPostGuard[i-1]){
                        message +=`${memberPostGuard[i]}
`
                    }
                }
                if(days[i] !== days[i-1]){
                    message += `יום ${week[days[i]]}
`
                }
                message += `${members[i]} ${hours[i]}:${minutes[i]}-${hours[i+1]}:${minutes[i+1]}
`
            }
                
        }
        try{
            const supported = await Linking.canOpenURL('whatsapp://send');
            console.log("supporteddd")
            if(supported){
                await Linking.openURL(`whatsapp://send?text=${message}`)
            } 
        }catch(e){
            console.log("e")
            console.log(e)
        }
    }

    async function deleteGroup(){
        let groups = Object.assign({}, store.groups)
        delete groups[store.group]
        try{
            await AsyncStorage.setItem('Groups', JSON.stringify(groups), (err,result) => {})
            await store.setGroups(groups)
            await store.resetGroup()
            await navigation.navigate('ExistingGroupsScreen')
        }
        catch(error){
            console.log(error)
        }
    }
    return(
          <View style={styles.resultContainer}>
            <View style={styles.topBarResult}>
                <DeleteGroup 
                    visible={deleteGroupVisible} 
                    dontDelete={() => setDeleteGroupVisible(false)}
                    delete={deleteGroup}
                />
                <TouchableOpacity onPress={() => setDeleteGroupVisible(true)}>
                    <Image style={styles.smallImage}
                        source={require(`../../assets/trash.png`)}
                    />
                </TouchableOpacity>
                <View style={styles.resultTitleContainer}>
                    <Text style={styles.resultTitle}>
                        {store.group}
                    </Text>
                </View>
                <TouchableOpacity onPress={sendWhatsappMessage}>
                    <Image 
                        style={styles.smallImage}
                        source={require(`../../assets/whatsapp.png`)}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.namesContainer}>
                <View style={styles.subTitleContainer}>
                    <View style={styles.flexOne}>
                        {
                        index>1 ?       
                            <TouchableOpacity onPress={goBack}>
                                <Image 
                                    style={styles.smallImage}
                                    source={require(`../../assets/right-arrow.png`)}
                                />
                            </TouchableOpacity>
                            :
                            null
                        }
                    </View>
                    <View style={styles.subTitle}>
                        <Text style={styles.subTitleText}>
                        {method === "random" ? "רנדומלי"
                        : method === "order" ? "לפי הסדר"
                        : method === "forward" ? "אחד קדימה"
                        : method === "fair" ? "רנדומליות הוגנת"
                        : method === 'cycle' ? 'מחזורי' 
                        : ''
                        } {index !==0 && index}
                        </Text>
                        <Text>
                            {date}
                        </Text>
                    </View>
                    <View style={styles.flexOne}>
                        { index !== 0 && index < store.groups[store.group]?.minutes.length  ?
                        <TouchableOpacity onPress={goForward}>
                            <Image 
                                style={styles.smallImage}
                                source={require(`../../assets/left-arrow.png`)}
                            />
                        </TouchableOpacity>
                            :
                            null
                        }
                    </View>
                </View>
                    <FlatList 
                    data={members} 
                    renderItem={itemData => (
                        <> 
                    {!!(itemData.item) && (
                        <>
                        {postGuards.length 
                            ? postGuards[itemData.index] !== postGuards[itemData.index-1] 
                                ? <Text style={styles.guardPostName}>{postGuards[itemData.index]}</Text>
                                : <></>
                            :<></>
                        }
                        {(days[itemData.index] !== days[itemData.index-1]) && <Text style={styles.day}>יום {week[days[itemData.index]]}</Text>}
                        <View style={styles.nameContainer}>
                        <View style={styles.resultRow}>
                        <Text style={styles.name}>
                            {itemData.item}
                        </Text>
                        </View>
                        <View style={styles.timeRow}>
                        <Text style={styles.time}>
                            {hours[itemData.index]}:{minutes[itemData.index]} - 
                        </Text>
                        <Text style={styles.time}>
                            {hours[itemData.index+1]}:{minutes[itemData.index+1]} 
                        </Text>
                        </View>
                    </View>
                        </>
                    )}
                        </>
                    )}>
                        
                </FlatList>
                <TouchableOpacity style={styles.buttonContainer} onPress={newList}>
                    <Text style={styles.buttonText}>צור רשימה חדשה</Text>
                    <View style={styles.bottomBorder}></View>
                </TouchableOpacity>
            </View>
            <Bottom back={() => navigation.navigate('ExistingGroupsScreen')}/>
        </View>
    )
}

export default inject("store")(observer(History)) 
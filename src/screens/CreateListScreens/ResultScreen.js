import React, { useState, useEffect, useContext } from 'react'
import {View, TouchableOpacity, AsyncStorage, Linking, Image, Text, FlatList} from 'react-native'
import SaveGroup from '../../components/modals/SaveGroup'
import LeaveBeforeSaving from '../../components/modals/LeaveBeforeSaving'
import { inject, observer } from "mobx-react";
import { styleContext } from '../../Style';

function ResultScreen({navigation, store}){
    const [minutes, setMinutes] = useState([])
    const [hours, setHours] = useState([])
    const [members, setMembers] = useState([])
    const [method, setMethod] = useState("")
    const [date, setDate] = useState("")
    const [saved, setSaved] = useState(false)
    const [saveGroupVisible, setSaveGroupVisible] = useState(false)
    const [leaveBeforeSavingVisible, setLeaveBeforeSavingVisible] = useState(false)
    const [days, setDays] = useState([])
    const [week, setWeek] = useState(['ראשון',
        'שני',
        'שלישי',
        'רביעי',
        'חמישי',
        'שישי',
        'שבת'    
    ])
    const [memberPostGuard, setMemberPostGuard] = useState([])

    const styles = useContext(styleContext)

    useEffect(()=> {
        getList()
    },[])

    function getTimes(num){
        const { endTime, startTime, cycle, method } = store
        let end = endTime.split(":")
        let start = startTime.split(":")
        let sHour = Number(start.shift());
        let sMinute = Number(start.pop());
        let eHour = Number(end.shift());
        let eMinute = Number(end.pop());
        let Hours = eHour - sHour;    
        let Minutes = eMinute - sMinute;
        if (sHour > eHour || (sHour === eHour && sMinute > eMinute)) {
            Hours += 24;
        }
        if(Minutes === 0 && Hours === 0){
            Hours = 24
        }
        let all = Hours * 60 + Minutes;
        let shmira = Math.round(all / num); 
        let hour2 = Math.floor(shmira / 60);
        let minute2 = shmira % 60;
        let hour = [sHour]
        let minute = [sMinute]
        if(method === 'cycle'){
            let count = 0
            let i = 0
            while(count<Hours){
                count += cycle
                hour.push(hour[i]+cycle)
                minute.push(sMinute)
                i++
            }
            hour.pop()
            minute.pop()
        }
        else{
            for (let i = 1; i < num; i++) {
                hour[i] = hour2 * i; 
                minute[i] = minute2 * i;  
                hour[i] += sHour; 
                minute[i] += sMinute;
                if (minute[i] >= 60) {
                    hour[i] += Math.floor(minute[i] / 60);
                    minute[i] = minute[i] % 60;
                }
            }
        }
        hour.push(eHour)
        minute.push(eMinute)
        let days = []
        days.push(store.startDate.getDay())
        for(let i = 1; i<hour.length;i++){
            let newDay = days[days.length-1] + (Math.floor(hour[i]/24) - Math.floor(hour[i-1]/24))
            days.push(newDay>6 ? newDay-7 : newDay)
        }
        for(let i=0;i<hour.length;i++){
            if(hour[i]>=24){
                hour[i] = hour[i]%24
            }
            if(hour[i]<10){
                hour[i] = "0" + hour[i]
            }
            if(minute[i]<10){
                minute[i] = "0" + minute[i]
            }
        }
        return [hour, minute, days]
    }
    function createRandomList(){
        let randomArr = []
        for(let i =0;i< store.members.length;i++){
            randomArr.push({random: Math.random(), index: i})
        }
        randomArr.sort((a,b) => {
            return b.random - a.random
        })
        let list = []
        for(let i=0;i<store.members.length;i++){
            list[i] = store.members[randomArr[i].index] 
        }
        return list
    }
    
    async function getList(){
        try{
            let groups = store.groups
            const { method, guardPosts } = store
            if(store.group){
                groups[store.group].method.push(method) 
            }
            setMethod(method)
            let hour = []
            let minute = []
            let day = []
            let newMemberPostGuard = []
                if(store.guardPosts.length){
                    let fill = 0
                    for(let i =0;i<store.guardPosts.length;i++){
                        const num = Math.floor((store.members.length-fill)/(store.guardPosts.length-i))
                        fill += num 
                        const [newHours, newMinutes, newDays] = getTimes(num)
                        if(method !== 'cycle'){
                            for(let j =0;j<num;j++){
                                newMemberPostGuard.push(store.guardPosts[i])
                            }
                        }
                        else{
                            for(let j=0;j<newHours.length-1;j++){
                                newMemberPostGuard.push(store.guardPosts[i])
                            }
                        }
                        newDays.push('')
                        newHours.push('')
                        newMinutes.push('')
                        newMemberPostGuard.push('')
                        newMemberPostGuard.push('')
                        hour = [...hour, ...newHours]
                        minute = [...minute, ...newMinutes]
                        day = [...day, ...newDays]
                    }
                }
                else{
                    [hour, minute, day] = getTimes(store.members.length)
                }
            setMemberPostGuard(newMemberPostGuard)
            setDays(day)
            let date = new Date()
            if(store.group){
                groups[store.group].minutes.push(minute) 
                groups[store.group].hours.push(hour) 
                groups[store.group].date.push(`${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`)
                if(!groups[store.group].days) groups[store.group].days = []
                groups[store.group].days.push(day)
                if(!groups[store.group].postGuards) groups[store.group].postGuards = []
                groups[store.group].postGuards.push(newMemberPostGuard)
            }
            setDate(`${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`)
            setMinutes(minute)
            setHours(hour)
            if(method === "order"){
                let list = []
                const postGuards = newMemberPostGuard.filter(it => it)
                if(postGuards.length){
                    for(let i =0;i<postGuards.length;i++){
                        list.push(store.members[i])
                        if(postGuards[i] !== postGuards[i+1]){
                            list.push('')
                            list.push('')
                        }
                    }
                    setMembers(list)
                }
                if(store.group){
                    groups[store.group].members.push(list.length ? list : store.members) 
                }
                setMembers(list.length ? list : store.members)
            }
            else if(method === 'cycle'){
                let list = createRandomList()
                let newList = []
                if(guardPosts.length){
                    for(let i =0;i<guardPosts.length;i++){
                        newList.push([])
                    }
                    let listCount = 0
                    let membersCount = 0
                    for(let i =0;i<newMemberPostGuard.filter(postGuard => postGuard).length;i++){
                        if(listCount>=newList.length){
                            listCount = 0
                        }
                        if(membersCount>=list.length){
                            membersCount = 0
                        }
                        newList[listCount].push(list[membersCount])
                        listCount++
                        membersCount++
                    }
                    for(let i =0;i<newList.length;i++){
                        newList[i].push("")
                        newList[i].push("")
                    }
                    newList = newList.flat()
                }
                else{
                    let membersCount = 0
                    for(let i=0;i<hour.length-1;i++){
                        if(membersCount>=list.length){
                            membersCount = 0
                        }
                        newList.push(list[membersCount])
                        membersCount++
                    }

                }
                if(store.group){
                    groups[store.group].members.push(newList) 
                }
                setMembers(newList)
            }
            else if(method === "random"){
                const list = createRandomList()
                let newList = []
                const postGuards = newMemberPostGuard.filter(it => it)
                if(postGuards.length){
                    for(let i =0;i<postGuards.length;i++){
                        newList.push(list[i])
                        if(postGuards[i] !== postGuards[i+1]){
                            newList.push('')
                            newList.push('')
                        }
                    }
                }
                if(store.group){
                    groups[store.group].members.push(newList.length ? newList : list) 
                }
                setMembers(newList.length ? newList : list)
            }
            else if(method === "forward"){
                let list = []
                list.push(store.members[store.members.length-1])
                for(let i = 0;i<store.members.length-1;i++){
                    list.push(store.members[i])
                }
                if(store.group){
                    groups[store.group].members.push(list) 
                }
                await setMembers(list)
            }
            else if(method === "fair"){
                let obj = {}
                for(let i =0;i<store.members.length;i++){
                    obj[store.members[i]] = 0
                }
                let membersHistory = store.groups[store.group].members
                let methodsHistory = store.groups[store.group].method
                let postGuardsHistory = store.groups[store.group].postGuards || []
                const diff = membersHistory.length-postGuardsHistory.length+1
                for(let i = 0;i<membersHistory.length;i++){
                    if(methodsHistory[i] !== 'cycle' && !postGuardsHistory[i-diff].length){
                        if(obj[membersHistory[i][0]] || obj[membersHistory[i][0]] === 0){
                            obj[membersHistory[i][0]] += 1
                        }
                        if(obj[membersHistory[i][membersHistory[i].length-1]] || obj[membersHistory[i][membersHistory[i].length-1]] === 0){
                            obj[membersHistory[i][membersHistory[i].length-1]] += 1
                        }
                    }   
                }
                let randomArr = []
                for(let i =0;i< store.members.length;i++){
                    randomArr.push({name: store.members[i], random: Math.random(), fl: obj[store.members[i]] })
                }
                randomArr.sort((a,b) => {
                    return a.fl - b.fl
                })
                let first = randomArr.shift()
                let last = randomArr.shift()
                randomArr.sort((a,b) => {
                    return a.random - b.random
                })
                randomArr.unshift(first)
                randomArr.push(last)
                let list = []
                for(let i =0;i<randomArr.length;i++){
                    list.push(randomArr[i].name)
                }
                if(store.group){
                    groups[store.group].members.push(list) 
                }
                await setMembers(list)
            }
            if(store.group){
                AsyncStorage.setItem('Groups', JSON.stringify(groups), (err,result) => {
                })
            }
        }
        catch(error){
            console.log(error)
        }
    }
    function goToHomePage(){
        if(!(saved) && !(store.group)){
            setLeaveBeforeSavingVisible(true)
        }
        else{
            navigation.navigate('HomeScreen')
        }
    }

    async function sendWhatsappMessage(){
        
        let methodName = method === "random" ? "רשימה רנדומלית" 
        : method === "order" ? "רשימה לפי הסדר" 
        : method === "fair" ? "רנדומליות הוגנת"
        : method === "forward" ? "אותו הסדר, אחד קדימה"
        : 'רשימה מחזורית'
        let message = `${date} | ${methodName} | ${store.group ? store.groups[store.group].minutes.length : 1}
`
        for(let i =0;i<members.length;i++){
            if(members[i]){
                if(store.guardPosts.length){
                    if(memberPostGuard[i] !== memberPostGuard[i-1]){
                        message +=`
                        ${memberPostGuard[i]}
                        
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

        const supported = await Linking.canOpenURL('whatsapp://send');

        if(supported){
            await Linking.openURL(`whatsapp://send?text=${message}`)
        } 
    }

    function saveNewGroupHandler(groupName){
        let Groups = {}
        if(groupName){
            AsyncStorage.getItem('Groups', (err,result) => {
                if(!(result)){
                    Groups[groupName] = 
                    {members: [members], hours: [hours], minutes: [minutes], method: [method], date: [date], days: [days], postGuards: [memberPostGuard]}
                    AsyncStorage.setItem('Groups', JSON.stringify(Groups), (err,result) => {
                    })
                    setSaved(true)
                    setSaveGroupVisible(false) 
                }
                else{
                    result = JSON.parse(result)
                    if(result[groupName]){
                        console.log("name is already exists")
                    }
                    else{
                        //result[groupName] = {members: [members], hours: [hours], minutes: [minutes], method: [method], date: [date]}
                        result[groupName] = {members: [members], hours: [hours], minutes: [minutes], method: [method], date: [date], days: [days], postGuards: [memberPostGuard]}
                        AsyncStorage.setItem('Groups', JSON.stringify(result), (err,result) => {
                            console.log("NewGroup")
                        })
                        setSaved(true)
                        setSaveGroupVisible(false)
                    }
                }
            })
        }
    }
    return(
          <View style={styles.resultContainer}>
            <View style={styles.topBarResult}>
                <TouchableOpacity onPress={goToHomePage}>
                    <Image 
                        style={styles.smallImage}
                        source={require(`../../assets/home.png`)}
                    />
                </TouchableOpacity>
                <View style={styles.resultTitleContainer}>
                <Text style={styles.resultTitle}>
                {method === "random" ? "רנדומלי"
                : method === "order" ? "לפי הסדר"
                : method === "fair" ? "רנדומליות הוגנת"
                : method === "cycle" ? "מחזורי"
                : "אחד קדימה"
                }
                </Text>
                <Text>
                    {date}
                </Text>
                </View>
                <TouchableOpacity onPress={sendWhatsappMessage}>
                    <Image 
                        style={styles.smallImage}
                        source={require(`../../assets/whatsapp.png`)}
                    />
                </TouchableOpacity>
                <LeaveBeforeSaving 
                    visible={leaveBeforeSavingVisible} 
                    homePage={() => navigation.navigate('HomeScreen')}
                    result={()=> setLeaveBeforeSavingVisible(false)}
                />
            </View>
            <View style={styles.namesContainer}>
                <FlatList
                data={members}
                renderItem={itemData => (
                    <> 
                    {!!(itemData.item) && (
                        <>
                        {store.guardPosts.length 
                            ? memberPostGuard[itemData.index] !== memberPostGuard[itemData.index-1] 
                                ? <Text style={styles.guardPostName}>{memberPostGuard[itemData.index]}</Text>
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
            {!(store.group) && (
            !(saved) ? <TouchableOpacity style={styles.buttonContainer} onPress={() => setSaveGroupVisible(true)}>
                <Text style={styles.buttonText}>שמירת קבוצה</Text>
                <View style={styles.bottomBorder}/>
            </TouchableOpacity>
            : 
            <TouchableOpacity style={styles.buttonContainer}>
                <Text style={styles.savedText}>קבוצה נשמרה</Text>
                <View style={styles.bottomBorder}/>
            </TouchableOpacity>
            )
            }
            <SaveGroup 
            visible={saveGroupVisible} 
            onSaveGroup={saveNewGroupHandler}
            onComeBack={()=> setSaveGroupVisible(false)}/>
            </View>
        </View>
    )
}

export default inject("store")(observer(ResultScreen)) 
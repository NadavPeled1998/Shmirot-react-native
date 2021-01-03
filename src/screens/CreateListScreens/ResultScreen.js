import React, { useState, useEffect, useContext } from 'react'
import { View, TouchableOpacity, AsyncStorage, Linking, Image, Text } from 'react-native'
import { inject, observer } from "mobx-react"
import SaveGroup from '../../components/modals/SaveGroup'
import LeaveBeforeSaving from '../../components/modals/LeaveBeforeSaving'
import ResultList from '../../components/ResultList'
import Images from '../../assets'
import { styleContext } from '../../styles'
import { methods } from '../../utils/methods'
import { dateFormat } from '../../utils'

function ResultScreen({ navigation, store }) {
    const [minutes, setMinutes] = useState([])
    const [hours, setHours] = useState([])
    const [members, setMembers] = useState([])
    const [method, setMethod] = useState("")
    const [date, setDate] = useState("")
    const [saved, setSaved] = useState(false)
    const [saveGroupVisible, setSaveGroupVisible] = useState(false)
    const [leaveBeforeSavingVisible, setLeaveBeforeSavingVisible] = useState(false)
    const [days, setDays] = useState([])
    const [memberPostGuard, setMemberPostGuard] = useState([])

    const styles = useContext(styleContext)

    useEffect(() => {
        getList()
    }, [])

    useEffect(() =>
        navigation.addListener('beforeRemove', (e) => {
            if (leaveBeforeSavingVisible || saved || store.group) {
                return;
            }
            e.preventDefault();
            setLeaveBeforeSavingVisible(true)
        }), [navigation, saved, leaveBeforeSavingVisible]
    )

    function getTimes(num) {
        const { endTime, startTime, cycle, method } = store
        let end = endTime.split(":")
        let start = startTime.split(":")
        let sHour = Number(start.shift())
        let sMinute = Number(start.pop())
        let eHour = Number(end.shift())
        let eMinute = Number(end.pop())
        let allHours = eHour - sHour;
        let allMinutes = eMinute - sMinute;
        if (sHour > eHour || (sHour === eHour && sMinute > eMinute)) allHours += 24
        if (allMinutes === 0 && allHours === 0) allHours = 24
        let all = allHours * 60 + allMinutes
        let shmira = Math.round(all / num)
        let hour = Math.floor(shmira / 60)
        let minute = shmira % 60
        let hours = [sHour]
        let minutes = [sMinute]
        if (method === 'cycle') {
            let count = 0
            let i = 0
            while (count < allHours) {
                count += cycle
                hours.push(hours[i] + cycle)
                minutes.push(sMinute)
                i++
            }
            hours.pop()
            minutes.pop()
        }
        else {
            for (let i = 1; i < num; i++) {
                hours[i] = hour * i
                minutes[i] = minute * i
                hours[i] += sHour
                minutes[i] += sMinute
                if (minutes[i] >= 60) {
                    hours[i] += Math.floor(minutes[i] / 60)
                    minutes[i] = minutes[i] % 60
                }
            }
        }
        hours.push(eHour)
        minutes.push(eMinute)
        let days = []
        days.push(store.startDate.getDay())
        for (let i = 1; i < hours.length; i++) {
            let newDay = days[days.length - 1] + (Math.floor(hours[i] / 24) - Math.floor(hours[i - 1] / 24))
            days.push(newDay > 6 ? newDay - 7 : newDay)
        }

        hours.map((hour, index) => {
            if (hour >= 24) hours[index] = hour % 24
            if (hour < 10) hours[index] = "0" + hour
            if (minutes[index] < 10) minutes[index] = "0" + minutes[index]
        })

        return [hours, minutes, days]
    }


    async function getList() {
        try {
            const { method, guardPosts, group, groups, members } = store
            if (group) groups[group].method.push(method)
            setMethod(method)
            let [hour, minute, day, newMemberPostGuard] = Array.from({ length: 4 }, () => [])
            if (guardPosts.length) {
                let fill = 0
                guardPosts.map((guardPost, index) => {
                    const num = Math.floor((members.length - fill) / (guardPosts.length - index))
                    fill += num
                    const [newHours, newMinutes, newDays] = getTimes(num)
                    if (method !== 'cycle') {
                        for (let i = 0; i < num; i++) {
                            newMemberPostGuard.push(guardPost)
                        }
                    }
                    else {
                        newHours.map(() => { newMemberPostGuard.push(guardPost) })
                        newMemberPostGuard.pop()
                    }
                    newDays.push('')
                    newHours.push('')
                    newMinutes.push('')
                    newMemberPostGuard.push('')
                    newMemberPostGuard.push('')
                    hour = [...hour, ...newHours]
                    minute = [...minute, ...newMinutes]
                    day = [...day, ...newDays]
                })
            }
            else[hour, minute, day] = getTimes(members.length)
            setMemberPostGuard(newMemberPostGuard)
            setDays(day)
            let date = dateFormat(new Date())
            if (group) {
                groups[group].minutes.push(minute)
                groups[group].hours.push(hour)
                groups[group].date.push(date)
                if (!groups[group].days) groups[group].days = []
                groups[group].days.push(day)
                if (!groups[group].postGuards) groups[group].postGuards = []
                groups[group].postGuards.push(newMemberPostGuard)
            }
            setDate(date)
            setMinutes(minute)
            setHours(hour)
            const groupHistory = store.group ? store.groups[store.group] : false
            const payloadForAction = {
                members,
                newMemberPostGuard,
                guardPosts,
                hour,
                groupHistory
            }
            const list = methods[method].action(payloadForAction)
            setMembers(list)
            if (group) {
                groups[group].members.push(list)
                AsyncStorage.setItem('Groups', JSON.stringify(groups))
            }
        }
        catch (error) {
            console.log(error)
        }
    }


    async function sendWhatsappMessage() {
        const { guardPosts, group, groups } = store
        const rounds = group ? groups[group].minutes.length : 1
        const message = writeWhatsappMessage({ method, members, guardPosts, memberPostGuard, rounds, days, hours, minutes })
        const supported = await Linking.canOpenURL('whatsapp://send');
        if (supported) await Linking.openURL(`whatsapp://send?text=${message}`)
    }

    function saveNewGroupHandler(groupName) {
        let Groups = {}
        if (groupName) {
            const listData = {
                members: [members],
                hours: [hours],
                minutes: [minutes],
                method: [method],
                date: [date],
                days: [days],
                postGuards: [memberPostGuard]
            }
            AsyncStorage.getItem('Groups', (err, result) => {
                if (!(result)) {
                    Groups[groupName] = listData
                    AsyncStorage.setItem('Groups', JSON.stringify(Groups))
                    setSaved(true)
                    setSaveGroupVisible(false)
                }
                else {
                    result = JSON.parse(result)
                    if (result[groupName]) console.log("name is already exists")
                    else {
                        result[groupName] = listData
                        AsyncStorage.setItem('Groups', JSON.stringify(result))
                        setSaved(true)
                        setSaveGroupVisible(false)
                    }
                }
            })
        }
    }

    return (
        <View style={styles.resultContainer}>
            <View style={styles.topBarResult}>
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Image
                        style={styles.smallImage}
                        source={Images.home}
                        resizeMethod="resize"
                    />
                </TouchableOpacity>
                <View style={styles.resultTitleContainer}>
                    <Text style={styles.resultTitle}>
                        {methods[method || store.method].name}
                    </Text>
                    <Text>
                        {date}
                    </Text>
                </View>
                <TouchableOpacity onPress={sendWhatsappMessage}>
                    <Image
                        style={styles.smallImage}
                        source={Images.whatsapp}
                        resizeMethod="resize"
                    />
                </TouchableOpacity>
                <LeaveBeforeSaving
                    visible={leaveBeforeSavingVisible}
                    homePage={() => navigation.navigate('HomeScreen')}
                    result={() => setLeaveBeforeSavingVisible(false)}
                />
            </View>
            <View style={styles.namesContainer}>
                <ResultList
                    members={members}
                    guardPosts={store.guardPosts}
                    memberPostGuard={memberPostGuard}
                    days={days}
                    hours={hours}
                    minutes={minutes}
                />
                {!(store.group) && (
                    !(saved) ? (
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => setSaveGroupVisible(true)}>
                            <Text style={styles.buttonText}>שמירת קבוצה</Text>
                        </TouchableOpacity>
                    ) : (
                            <TouchableOpacity style={styles.buttonContainer}>
                                <Text style={styles.savedText}>קבוצה נשמרה</Text>
                            </TouchableOpacity>
                        )
                )}
                <SaveGroup
                    visible={saveGroupVisible}
                    onSaveGroup={saveNewGroupHandler}
                    onComeBack={() => setSaveGroupVisible(false)} />
            </View>
        </View>
    )
}

export default inject("store")(observer(ResultScreen)) 
import React, { useEffect, useState, useContext } from 'react'
import { View, TouchableOpacity, Image, Text, AsyncStorage, Linking } from 'react-native'
import { inject, observer } from "mobx-react"
import Bottom from '../../components/Bottom'
import DeleteGroup from '../../components/modals/DeleteGroup'
import ResultList from '../../components/ResultList'
import { writeWhatsappMessage } from '../../utils'
import { methods } from '../../utils/methods'
import Images from '../../assets'
import { styleContext } from '../../styles'


function HistoryScreen({ navigation, store }) {
    const [minutes, setMinutes] = useState([])
    const [hours, setHours] = useState([])
    const [members, setMembers] = useState([])
    const [days, setDays] = useState([])
    const [postGuards, setPostGuards] = useState([])
    const [method, setMethod] = useState("")
    const [date, setDate] = useState("")
    const [index, setIndex] = useState(0)
    const [deleteGroupVisible, setDeleteGroupVisible] = useState(false)

    const styles = useContext(styleContext);

    useEffect(() => {
        navigateLists(true, 0)
    }, [])

    function navigateLists(didMount, num) {
        const { groups, group } = store
        const { method, date, members, minutes, hours, days, postGuards } = groups[group]
        setMethod(method[didMount ? method.length-1 : index+num])
        setDate(date[didMount ? date.length-1 : index+num])
        setMembers(members[didMount ? members.length-1 : index+num])
        setMinutes(minutes[didMount ? minutes.length-1 : index+num])
        setHours(hours[index+num])
        if (days) {
            const diff = members.length - days.length
            setDays(days[didMount ? days.length-1 : index + num - diff] 
                ? days[didMount ? days.length-1 
                : index + num - diff] : []
            )
            setPostGuards(postGuards[didMount ? postGuards.length-1 : index + num - diff] 
                ? postGuards[didMount ? postGuards.length-1 : index + num - diff] 
                : []
            )
        }
        setIndex(didMount ? members.length : index + num + 1)
    }

    async function sendWhatsappMessage() {
        const { guardPosts, group, groups } = store
        const rounds = group ? groups[group].minutes.length : 1
        const message = writeWhatsappMessage({ method, members, guardPosts, memberPostGuard, rounds, days, hours, minutes })
        const supported = await Linking.canOpenURL('whatsapp://send');
        if (supported) await Linking.openURL(`whatsapp://send?text=${message}`)
    }

    async function deleteGroup() {
        let groups = Object.assign({}, store.groups)
        delete groups[store.group]
        try {
            await AsyncStorage.setItem('Groups', JSON.stringify(groups))
            store.setGroups(groups)
            store.resetGroup()
            navigation.navigate('ExistingGroupsScreen')
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <View style={styles.historyContainer}>
            <View style={styles.topBarResult}>
                <DeleteGroup
                    visible={deleteGroupVisible}
                    dontDelete={() => setDeleteGroupVisible(false)}
                    delete={deleteGroup}
                />
                <TouchableOpacity onPress={() => setDeleteGroupVisible(true)}>
                    <Image style={styles.smallImage}
                        source={Images.trash}
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
                        source={Images.whatsapp}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.namesContainer}>
                <View style={styles.subTitleContainer}>
                    <View style={styles.flexOne}>
                        {
                            index > 1 ?
                                <TouchableOpacity onPress={() => navigateLists(false, -2)}>
                                    <Image
                                        style={styles.smallImage}
                                        source={Images.rightArrow}
                                    />
                                </TouchableOpacity>
                                :
                                null
                        }
                    </View>
                    <View style={styles.subTitle}>
                        <Text style={styles.subTitleText}>
                            {method ? methods[method].name : ''} {' '}
                            {index !== 0 && index}
                        </Text>
                        <Text>
                            {date}
                        </Text>
                    </View>
                    <View style={styles.flexOne}>
                        {index !== 0 && index < store.groups[store.group]?.minutes.length ?
                            <TouchableOpacity onPress={() => navigateLists(false, 0)}>
                                <Image
                                    style={styles.smallImage}
                                    source={Images.leftArrow}
                                />
                            </TouchableOpacity>
                            :
                            null
                        }
                    </View>
                </View>
                <ResultList 
                    members={members} 
                    guardPosts={postGuards} 
                    memberPostGuard={postGuards} 
                    days={days} 
                    hours={hours} 
                    minutes={minutes}
                />
                <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('CreateListScreen/MembersNameScreen')}>
                    <Text style={styles.buttonText}>צור רשימה חדשה</Text>
                </TouchableOpacity>
            </View>
            <Bottom back={() => navigation.navigate('ExistingGroupsScreen')} />
        </View>
    )
}

export default inject("store")(observer(HistoryScreen)) 
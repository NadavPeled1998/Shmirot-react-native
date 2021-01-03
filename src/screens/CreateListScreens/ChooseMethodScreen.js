import React, { useState, useContext } from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'
import { inject, observer } from 'mobx-react'
import Bottom from '../../components/Bottom'
import Images from '../../assets'
import { methods } from '../../utils/methods'
import { styleContext } from '../../styles'

function ChooseMethodScreen({ navigation, store }) {
    const [method, setMethod] = useState("")
    const [explanation, setExplanation] = useState(false)
    const styles = useContext(styleContext)


    function getList() {
        store.setMethod(method || 'random')
        navigation.navigate('CreateListScreen/ResultScreen')
    }

    const methodButton = (key, value, index) => {
        return (
            <>
                <TouchableOpacity onPress={() => setMethod(key)} style={!(index % 2)
                    ? styles.leftButtonImageContainer
                    : styles.rightButtonImageContainer
                }>
                    <Image
                        style={styles.buttonImage}
                        resizeMethod="resize"
                        source={value.image}
                    />
                    <Text style={method === key ? styles.boldTitle : styles.smallTitle}>
                        {value.title}
                    </Text>
                    {explanation &&
                        <Text style={styles.explanation}>
                            {value.explanation}
                        </Text>
                    }
                </TouchableOpacity>
            </>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Text style={styles.title}> איך תרצו לסדר את הרשימה?</Text>
                <View style={styles.topMethodButtonContainer}>
                    {Object.entries(methods)
                        .filter(([key, value]) => !value.existingGroupsOnly && value.explanation)
                        .map(([key, value], index) => methodButton(key,value,index))
                    }
                </View>
                <View style={styles.circleContainer}>
                    {(!!store.group && !store.guardPosts.length) && (
                        <View style={styles.line}></View>
                    )}
                    <TouchableOpacity onPress={() => { setExplanation(!(explanation)) }}>
                        <Image
                            style={styles.questionButton}
                            resizeMethod="resize"
                            source={Images.question} />
                    </TouchableOpacity>
                    {(!!store.group && !store.guardPosts.length) && (
                        <View style={styles.line}></View>
                    )}
                </View>
                <View style={styles.directionRow}>
                {Object.entries(methods)
                    .filter(([key, value]) => value.existingGroupsOnly && !!store.group && !store.guardPosts.length)
                    .map(([key, value], index) => methodButton(key,value,index))
                }
                </View>
            </View>
            <Bottom
                back={() => navigation.navigate('CreateListScreen/CheckIfCyclicScreen')}
                forward={getList}
                circles={!(store.group) ? 8 : 7}
                bigCircle={!(store.group) ? 7 : 6}
            />
        </View>
    )
}

export default inject("store")(observer(ChooseMethodScreen))  
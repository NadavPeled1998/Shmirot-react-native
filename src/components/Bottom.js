import React, { useContext } from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import { styleContext } from '../styles'

function Bottom(props) {
    const { back, forward, circles, bigCircle } = props
    const styles = useContext(styleContext)
    return (
        <View style={styles.bottomLine}>
            <View style={styles.bottomButtonContainer}>
                <TouchableOpacity onPress={back}>
                    <Image
                        style={styles.comeBack}
                        source={require('../assets/next.png')}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ ...styles.circleContainer, ...styles.flexOne }}>
                {Array.from({ length: circles }).map((it, ind) =>
                    <View key={ind}>
                        {ind === bigCircle
                            ? <View style={styles.bigCircle} />
                            : <View style={styles.circle} />
                        }
                    </View>
                )}
            </View>
            <View style={styles.bottomButtonContainer}>
                {!!(forward) && <TouchableOpacity onPress={props.forward} style={{ alignSelf: "flex-start" }}>
                    <Text style={styles.button}>
                        הבא
                    </Text>
                </TouchableOpacity>}
            </View>
        </View>
    )
}

export default Bottom
import React, { useContext } from 'react'
import { View, FlatList, Text } from 'react-native'
import { styleContext } from '../styles'
import { week } from '../utils'
function ResultList({ members, guardPosts, memberPostGuard, days, hours, minutes }) {
    
    const styles = useContext(styleContext)
    
    return (
        <FlatList
            data={members}
            renderItem={({ item, index }) => (
                <View key={index}>
                    {!!(item) && (
                        <View>
                            {guardPosts.length
                                ? memberPostGuard[index] !== memberPostGuard[index - 1]
                                    ? <Text style={styles.guardPostName}>{memberPostGuard[index]}</Text>
                                    : null
                                : null
                            }
                            {(days[index] !== days[index - 1]) && <Text style={styles.day}>יום {week[days[index]]}</Text>}
                            <View style={styles.nameContainer}>
                                <View style={styles.resultRow}>
                                    <Text style={styles.name}>
                                        {item}
                                    </Text>
                                </View>
                                <View style={styles.timeRow}>
                                    <Text style={styles.time}>
                                        {hours[index]}:{minutes[index]} -
                                            </Text>
                                    <Text style={styles.time}>
                                        {hours[index + 1]}:{minutes[index + 1]}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            )} />
    )
}

export default ResultList
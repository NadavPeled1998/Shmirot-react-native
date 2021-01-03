import methods from './methods'

export const week = ['ראשון',
    'שני',
    'שלישי',
    'רביעי',
    'חמישי',
    'שישי',
    'שבת'
]

export const dateFormat = date => {
    return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

export const createRandomList = members => {
    let randomArr = []
    for (let i = 0; i < members.length; i++) {
        randomArr.push({ random: Math.random(), index: i })
    }
    randomArr.sort((a, b) => {
        return b.random - a.random
    })
    let list = []
    for (let i = 0; i < members.length; i++) {
        list[i] = members[randomArr[i].index]
    }
    return list
}

export const writeWhatsappMessage = ({ method, members, guardPosts, memberPostGuard, rounds, days, hours, minutes }) => {
    const methodName = methods[method].title
    let message = `${date} | ${methodName} | ${rounds}
`
    members.map(member => {
        if (member) {
            if (guardPosts.length) {
                if (memberPostGuard[i] !== memberPostGuard[i - 1]) {
                    message += `${memberPostGuard[i]}
`
                }
            }
            if (days[i] !== days[i - 1]) {
                message += `יום ${week[days[i]]}
`
            }
            message += `${members[i]} ${hours[i]}:${minutes[i]}-${hours[i + 1]}:${minutes[i + 1]}
`
        }
    })
    members.map((member, index) => {
        if (member) {
            if (guardPosts.length) {
                if (memberPostGuard[index] !== memberPostGuard[index - 1]) {
                    message += `${memberPostGuard[index]}
`
                }
            }
            if (days[index] !== days[index - 1]) {
                message += `יום ${week[days[index]]}
`
            }
            message += `${member} ${hours[index]}:${minutes[index]}-${hours[index + 1]}:${minutes[index + 1]}
`
        }
    })
    return message
}
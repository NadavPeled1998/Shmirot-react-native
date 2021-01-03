import store from '../store'
import { createRandomList } from './index'
import Images from '../assets'

export const methods = {
    random: {
        title: 'רשימה רנדומלית',
        name: 'רנדומלי',
        explanation: 'הרשימה תהיה מסודרת בצורה רנדומלית',
        image: Images.random,
        existingGroupsOnly: false,
        action: ({ members, newMemberPostGuard }) => {
            const list = createRandomList(members)
            let newList = []
            const postGuards = newMemberPostGuard.filter(it => it)
            if (postGuards.length) {
                postGuards.map((postGuard, index) => {
                    newList.push(list[index])
                    if (postGuard !== postGuards[index + 1]) {
                        newList.push('')
                        newList.push('')
                    }
                })
            }
            return newList.length ? newList : list
        }
    },
    order: {
        title: 'רשימה לפי הסדר',
        name: 'לפי הסדר',
        explanation: 'הרשימה תהיה מסודרת לפי הסדר שהכנסתם',
        image: Images.order,
        existingGroupsOnly: false,
        action: ({ members, newMemberPostGuard }) => {
            let list = []
            const postGuards = newMemberPostGuard.filter(it => it)
            if (postGuards.length) {
                postGuards.map((postGuard, index) => {
                    list.push(members[index])
                    if (postGuard !== postGuards[index + 1]) {
                        list.push('')
                        list.push('')
                    }
                })
            }
            return list.length ? list : members
        }
    },
    cycle: {
        title: 'רשימה מחזורית',
        name: 'מחזורי',
        existingGroupsOnly: false,
        action: ({ members, newMemberPostGuard, guardPosts, hour }) => {
            let list = createRandomList(members)
            let lists = []
            let membersCount = 0
            if (guardPosts.length) {
                guardPosts.map(() => { lists.push([]) })
                let listCount = 0
                newMemberPostGuard.filter(it => it).map(() => {
                    if (listCount >= lists.length) listCount = 0
                    if (membersCount >= list.length) membersCount = 0
                    lists[listCount].push(list[membersCount])
                    listCount++
                    membersCount++
                })
                lists.map(list => {
                    list.push('')
                    list.push('')
                })
                lists = lists.flat()
            }
            else {
                hour.map(() => {
                    if (membersCount >= list.length) membersCount = 0
                    lists.push(list[membersCount])
                    membersCount++
                })
            }
            return lists
        }
    },
    forward: {
        title: 'אותו הסדר, אחד קדימה',
        name: 'אחד קדימה',
        explanation: 'אותו הסדר כמו ממקודם, אחד קדימה',
        image: Images.forward,
        existingGroupsOnly: true,
        action: ({ members }) => {
            let list = []
            list.push(members[members.length - 1])
            members.map(member => { list.push(member) })
            list.pop()
            return list
        }
    },
    fair: {
        title: 'רנדומליות הוגנת',
        name: 'רנדומליות הוגנת',
        explanation: 'מי שיהיו ראשונים/אחרונים לא יהיו שוב עד שכולם יהיו ראשונים/אחרונים',
        image: Images.libra,
        existingGroupsOnly: true,
        action: ({ members, groupHistory }) => {
            let obj = {}
            members.map(member => { obj[member] = 0 })
            for (let i = 0; i < store.members.length; i++) {
                obj[store.members[i]] = 0
            }
            //not ready
            let membersHistory = groupHistory.members
            let methodsHistory = groupHistory.method
            let postGuardsHistory = groupHistory.postGuards || []
            const diff = membersHistory.length - postGuardsHistory.length + 1
            //not ready
            membersHistory.map((members, index) => {
                if (methodsHistory[index] !== 'cycle' && !postGuardsHistory[index - diff].length) {
                    if (obj[members[0]] || obj[members[0]] === 0) obj[members[0]] += 1
                    if (obj[members[members.length - 1]] || obj[members[members.length - 1]] === 0) {
                        obj[members[members.length - 1]] += 1
                    }
                }
            })
            let randomArr = []
            members.map(member => { randomArr.push({ name: member, random: Math.random(), fl: obj[member] }) })
            randomArr.sort((a, b) => { return a.fl - b.fl })
            let first = randomArr.shift()
            let last = randomArr.shift()
            randomArr.sort((a, b) => { return a.random - b.random })
            randomArr.unshift(first)
            randomArr.push(last)
            let list = []
            randomArr.map(member => { list.push(member.name) })
            return list
        }
    },
}
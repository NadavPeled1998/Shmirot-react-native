import { decorate, observable, action } from "mobx";

class Store{
    groups = {}
    group = ''
    num = 0
    members = []
    numGuardPosts = 1
    guardPosts = []
    startDate = {}
    startTime = ''
    endTime= ''
    method = ''
    cycle = 0

    setNum = num => {
        this.num = num
    }

    setCycle = hour => {
        this.cycle = hour
    }
    
    setMembers = members => {
        this.members = members
    }

    setNumGuardPosts = num => {
        this.numGuardPosts = num
    }

    setGuardPosts = guardPosts => {
        this.guardPosts = guardPosts
    }

    setStartDate = startDate => {
        this.startDate = startDate
    }
    
    setStartTime = startTime => {
        this.startTime = startTime
    }
    
    setEndTime = endTime => {
        this.endTime = endTime
    }

    setMethod = method => {
        this.method = method
    }

    setGroup = group => {
        this.guardPosts = []
        this.group = group
    }

    setGroups = groups => {
        this.groups = groups
    }

    resetGroup = () => {
        this.group = ''
    }
}

decorate(Store, {
    groups: observable,
    group: observable,
    num: observable,
    members: observable,
    numGuardPosts: observable,
    guardPosts: observable,
    startDate: observable,
    startTime: observable,
    endTime: observable,
    cycle: observable,
    setNum: action,
    setMembers: action,
    setNumGuardPosts: action,
    setGuardPosts: action,
    setStartDate: action,
    setStartTime: action,
    setEndTime: action,
    setGroup: action,
    setGroups: action,
    setCycle: action,
    resetGroup: action
});

export default new Store()
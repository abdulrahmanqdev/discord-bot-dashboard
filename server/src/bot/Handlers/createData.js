class CreateDataPack {

    constructor(pack = {}) {
        const datas = Object.keys(pack)
        for(const data of datas) {
            this[data] = pack[data]
        }
        return this
    }

    set(key, value) {
        this[key] = value
        return this
    }

    delete(key) {
        delete this[key]
        return this
    }

    clear() {
        const datas = Object.keys(this)
        for(const data of datas) {
            delete this[data]
        }
        return this
    }

}

module.exports = CreateDataPack
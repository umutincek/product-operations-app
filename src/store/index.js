import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        productList: [],
        trade: {
            purchase: 0.0,
            sale: 0.0,
            balance: 0.0,
        }
    },
    
    mutations: {
        updateProductList(state, payload) {
            state.productList.push(payload)
        },
        updateTradeResult(state, payload) {
            if(payload.count) {
                state.trade.purchase += parseFloat(payload.purchase) * parseInt(payload.count)
                state.trade.sale += parseFloat(payload.sale) * parseInt(payload.count)
            } else {
                state.trade.purchase += parseFloat(payload.purchase)
                state.trade.sale += parseFloat(payload.sale)
            }
            state.trade.balance = parseFloat(state.trade.sale) - parseFloat(state.trade.purchase)
        },
    },

    actions: {
        initApp({ commit }) {
            axios.get('/products.json')
                .then((response) => {
                    let data = response.data
                    for(let key in data) {
                        data[key].key = key
                        commit('updateProductList', data[key])
                    }
                })
        },
        saveProduct({ commit, dispatch }, payload) {
            axios.post('/products.json', payload)
                .then((response) => {
                    payload.key = response.data.name
                    commit('updateProductList', payload)
                    let tradeResult = {
                        purchase: payload.price,
                        sale: 0,
                        count: payload.count,
                    }
                    dispatch("setTradeResult", tradeResult)
                })
                .catch(e => {
                    console.log(e)
                })
        },
        sellProduct({ dispatch, state }, payload) {
            let product = state.productList.filter(el => {
                return el.key == payload.key
            })
            
            if(product) {
                let totalCount = product[0].count - payload.count
                axios.patch(`/products/${payload.key}.json`, { count: totalCount })
                    .then((response) => {
                        console.log(response)
                        product[0].count = totalCount
                        let tradeResult = {
                            purchase: 0,
                            sale: product[0].price,
                            count: payload.count,
                        }
                        dispatch("setTradeResult", tradeResult)
                    })
            }
            
        },
        setTradeResult({ commit, state }, payload) {
            commit('updateTradeResult', payload)
            let tradeData = {
                purchase: state.trade.purchase,
                sale: state.trade.sale,
            }
            axios.put('/trade-result.json', tradeData)
                .then(response => {
                    console.log(response)
                })
        },
        getTradeResult({ commit }) {
            axios.get('/trade-result.json')
                .then(response => {
                    commit('updateTradeResult', response.data)
                    console.log(response)
                })
        }
    },

    getters: {
        getProducts(state) {
            return state.productList
        },
        getProduct(state) {
            return key => state.productList.filter(el => {
                return el.key == key
            })
        },
        getTradeResult(state) {
            return {
                purchase: state.trade.purchase,
                sale: state.trade.sale,
                balance: state.trade.balance,
            }
        },
    },
})
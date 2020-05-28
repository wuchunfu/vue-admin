import {removeToken, setToken} from '@/utils/auth'
import {resetRouter} from '@/router'
import {getRequest, postRequest} from '@/utils/api'

export default {
  // user login
  login({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      const params = {
        username: payload.username.trim(),
        password: payload.password
      }
      postRequest('/vue-admin/user/login', params).then(response => {
        // console.log(response)
        const {data} = response.data
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      const params = {
        token: state.token
      }
      getRequest('/vue-admin/user/info', params).then(response => {
        // console.log(response)
        const {data} = response.data
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const {name, avatar} = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({commit}) {
    return new Promise((resolve, reject) => {
      postRequest('/vue-admin/user/logout').then(response => {
        // console.log(response)
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

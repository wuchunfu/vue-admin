import {getToken} from '@/utils/auth'

export default {
  RESET_STATE: (state) => {
    Object.assign(state, {
      token: getToken(),
      name: '',
      avatar: ''
    })
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

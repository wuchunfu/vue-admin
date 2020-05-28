import Vue from 'vue'
import Vuex from 'vuex'
import app from './app'
import settings from './settings'
import user from './user'
import table from './table'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    table
  }
})

export default store

import { auth, db } from '@/main'
import { ref, push, set, onValue } from 'firebase/database'

export default {
  state: {
    favourites: null
  },
  mutations: {
    setFavourites (state, payload) {
      state.favourites = payload
    },
    cleanFavourites (state) {
      state.favourites = null
    }
  },
  actions: {
    async addFavourite ({ state }, favourite) {
      let isFavouriteExists = false
      if (state.favourites) {
        Object.values(state.favourites).forEach(item => {
          if (item.imdbID === favourite.imdbID) {
            isFavouriteExists = true
          }
        })
      }
      try {
        if (isFavouriteExists) return
        const favouritesRef = ref(db, `users/${auth.currentUser.uid}/favourites`)
        const newFavouriteRef = push(favouritesRef)
        set(newFavouriteRef, favourite)
      } catch (error) {
        console.log(error)
      }
    },
    fetchFavourites ({ commit }) {
      try {
        const favouritesRef = ref(
          db,
          `users/${auth.currentUser.uid}/favourites`
        )
        onValue(favouritesRef, snapshot => {
          const data = snapshot.val()
          commit('setFavourites', data)
        })
      } catch (error) {
        console.log(error)
      }
    }
  },
  namespaced: true
}

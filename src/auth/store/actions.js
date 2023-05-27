import authApi from '@/api/authApi'

export const signInUser = async ({ commit }, user ) => {
    const { correo, password } = user

    try {
        const { data } = await authApi.post('/api/auth/login', { correo, password})

        const { token, usuario } = data
        const { nombre: displayName } = usuario

        user.name = displayName
        commit('loginUser', { user, token})

        return { ok: true }

    } catch (error) {
        return { ok: false, error }
    }
}


export const checkAuthentication = async ({ commit }) => {

    const token = localStorage.getItem('token')

    if (!token) {
        commit('logout')
        return { ok: false, message: 'No hay token' }
    }
    
    try {
        commit('loginUser', { token })
        return { ok: true }

    } catch (error) {
        commit('logout')
        return { ok: false }
    }
}

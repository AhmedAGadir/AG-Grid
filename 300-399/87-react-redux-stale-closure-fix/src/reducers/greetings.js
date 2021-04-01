const currentUser = (state = {
    english: 'hello world!',
    arabic: 'مرحبا بالعالم',
}, action) => {
    switch (action.type) {
        default:
            return state
    }
}

export default currentUser;
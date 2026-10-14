export const InsertLanguage = (body) => {
    return async (dispatch) => {
        dispatch({
            type: 'LANG.ADD_DATA',
            data: body
        })
    }
}
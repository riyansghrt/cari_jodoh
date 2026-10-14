export const InsertData = (body, name) => {
    return async (dispatch) => {
        dispatch({
            type: name,
            data: body
        })
    }
}
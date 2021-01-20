const validateEmailFormat = (email) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return regex.test(email)
}

const valid = (name, email, password, cf_password) => {
    if (!name || !email || !password) {
        return 'Please add all fields.'
    }
    if (!validateEmailFormat(email)) {
        return 'Invalid emails.'
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters.'
    }
    if (password !== cf_password) {
        return 'Confirm password did not march.'
    }
}

export default valid
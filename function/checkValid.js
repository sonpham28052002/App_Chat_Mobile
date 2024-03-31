const checkValidName = (value, regex) => {
    if(value.toLowerCase().match(regex)) {
        return true;
    }
    return false;
}

const checkValidPassword = (value, regex) => {
    if(value.match(regex)) {
        return true;
    }
    return false;
}

export { checkValidName, checkValidPassword }
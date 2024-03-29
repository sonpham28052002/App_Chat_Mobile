import firebase from 'firebase/compat/app'

const confirmCode = (verificationId, code, onSuccess, onError) => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        code
    )
    firebase.auth().signInWithCredential(credential)
        .then((response) => {
            console.log('id', response.user.uid);
            onSuccess(response.user.uid)
        })
        .catch((error) => {
            console.log(error)
            onError()
        })
    console.log('Successfull!');
}

export { confirmCode }
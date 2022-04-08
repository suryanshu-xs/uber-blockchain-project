import { db } from './firebaseConfig';
import { arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';


const addRide = async (data, currentAccount, nonce, setSnackbarData, setValue) => {


    const rideData = {
        accountAddress: currentAccount,
        rideCost: data.amount,
        car: data.car,
        drop: data.drop,
        pickup: data.pickup,
        filePath: data.filePath,
        nonce: nonce,
        ratings: null
    }

    // check if the doc already exists , if it already exits then update the document else set a new document.

    const docRef = doc(db, 'uber-blockchain-project', currentAccount.slice(0, 21))
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        try {
            await updateDoc(docRef, {
                rideDataArray: arrayUnion(rideData)
            })
            setValue(1)
        } catch (error) {
            setSnackbarData({
                open: true,
                message: 'Error Updating the database!',
                severity: 'error',
                time: 3000
            })
        }



    } else {
        //create the document
        try {
            await setDoc(docRef, {
                rideDataArray: [rideData]
            })
            setValue(1)
        } catch (error) {
            setSnackbarData({
                open: true,
                message: 'Error Updating the database!',
                severity: 'error',
                time: 3000
            })
        }
    }


}

const getRecentRides = async (currentAccount, setSnackbarData) => {

    const docRef = doc(db, 'uber-blockchain-project', currentAccount.slice(0, 21))
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        return docSnap.data().rideDataArray.reverse()
    } else {
        setSnackbarData({
            open: true,
            message: "You don't have any rides booked yet!",
            severity: 'info',
            time: 3000
        })
        return null
    }
}

export { addRide, getRecentRides }
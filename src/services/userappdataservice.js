import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import db from '../setup/firebase.js';
import userDetailsService from './userdetailsservice.js';

function fixAppDataFormat(swdToolsData){
    //Ensure fields
    const outSwdToolsData = {}; //IMP You cant always change the incoming obj
    outSwdToolsData.currentIssueKeysCsv = swdToolsData.currentIssueKeysCsv || '';
    outSwdToolsData.historyMenuItems =swdToolsData.historyMenuItems || {};
    outSwdToolsData.issueComments = swdToolsData.issueComments || {};
    return outSwdToolsData;
}

export default {
    persistAppData: (swdToolsData) => { //Returns promise
        const userObj = userDetailsService.getLocalStorageUser();
        if(userObj == null){
            Promise.reject(new Error("No user for whom to store the app data! Nothing saved."));
        }

        return new Promise((resolve, reject) => {
            const fixedSwdToolsData = fixAppDataFormat(swdToolsData);
            setDoc(doc(db, 'swdToolsData', userObj.userEmail), fixedSwdToolsData)
                .then(()=>{
                    resolve( swdToolsData );
                })
                .catch((fbError)=>{
                    reject(fbError);
                });
        });
    },

    loadAppData: () => {  //Returns promise
        const userObj = userDetailsService.getLocalStorageUser();
        if(userObj == null){
            Promise.reject(new Error("No user for whom to load the app data! Fresh start."));
        }

        return new Promise((resolve, reject) => {
            getDoc(doc(db, 'swdToolsData', userObj.userEmail))
                .then((docSnap)=>{
                    if (docSnap.exists()) {
                        const fixedSwdToolsData = fixAppDataFormat(docSnap.data());
                        resolve(fixedSwdToolsData);
                    } else {
                        console.log('User does not exist in DB! Saving initial empty app data')
                        var fixedSwdToolsData = fixAppDataFormat({});
                        setDoc(doc(db, 'swdToolsData', userObj.userEmail), fixedSwdToolsData)
                            .then(()=>{
                                resolve(fixedSwdToolsData);
                            })
                            .catch((fbError)=>{
                                reject(fbError);
                            });
                    }
                })
                .catch((fbError)=>{
                    reject(fbError);
                });
        });
    },

    appendIssueKeyToCsv: (currentIssueKeys, currentIssueKeysCsv, newIssueKey) => { //Just a static helper fn
            const keyExists = currentIssueKeys.includes(newIssueKey);
            if(keyExists === true){
                alert(`Issue key ${newIssueKey} already exists.`);
                return currentIssueKeysCsv;
            }
            const toAddPrefix = currentIssueKeys.length >0 ? ',':'';
            const toAdd = toAddPrefix + newIssueKey;

            currentIssueKeysCsv += toAdd;
            return currentIssueKeysCsv;
    }
}
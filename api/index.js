const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const tempCRNTIMap = {}; // Store Temporary C-RNTIs for UE identification

function clearTempCRNTIMap() {
    // console.log('Clearing tempCRNTIMap');
    for (const tempCRNTI in tempCRNTIMap) {
        if (tempCRNTIMap.hasOwnProperty(tempCRNTI)) {
            //clear mapped data
            delete tempCRNTIMap[tempCRNTI];
        }
    }
}

// Clear tempCRNTIMap every 1 second
setInterval(clearTempCRNTIMap, 1000);
app.get('/home', (req, res) => {
    res.json({ message: 'Start at /api end points for RANDOM ACCESS CHANNEL PROCEDURE ! ! !' });
  });

app.get('/api/', (req, res) => {
  res.json({ message: 'RACH procedure implemtation' });
});



app.post('/api/PreambleTransmission', (req, res) => {
    const preambleIndex = req.body.PreambleIndex;
    const rcvSubFrame = req.body.RcvSubFrame;

    // Check if preambleIndex is present in tempCRNTIMap    
    for (const tempCRNTI in tempCRNTIMap) {
        if (tempCRNTIMap.hasOwnProperty(tempCRNTI)) {
            if (tempCRNTIMap[tempCRNTI].preambleIndex === preambleIndex) {
                // PreambleIndex already present, send error
                return res.status(400).json({
                    status: 'Error',
                    message: 'PreambleIndex already in use',
                });
            }
        }
    }


    if (preambleIndex >= 0 && preambleIndex <= 63 && rcvSubFrame >= 0 && rcvSubFrame <= 9) {
        const tempCRNTI = Math.floor(Math.random() * Math.pow(10, 3)); // Simulating C-RNTI assignment

        tempCRNTIMap[tempCRNTI] = {
            preambleIndex: preambleIndex,
            rcvSubFrame: rcvSubFrame
        };

        // Log the request under "Random Access Preamble"
        // console.log('Random Access Preamble Request:', {
        //     preambleIndex: preambleIndex,
        //     rcvSubFrame: rcvSubFrame
        // });

        const response = {
            temporaryCRNTI: tempCRNTI,
            timingAdvance: Math.floor(Math.random() * 10) // Simulating timing advance
        };

        // console.log('Random Access Response:', response);

        res.json(response);
    } else {
        const errorResponse = {
            status: 'Error',
            message: 'Invalid parameters'
        };
        res.status(400).json(errorResponse);
    }
});


app.post('/api/RRC_RecRequest', async (req, res) => {
    const tempCRNTI = req.body.temporaryCRNTI;

    if (tempCRNTIMap[tempCRNTI]) {
        const ue_Identity = req.body.ue_Identity;
        const establishmentCause = req.body.establishmentCause;
        const spare = req.body.spare;

        // console.log('Scheduled Transmission Request:', {
        //     temporaryCRNTI: tempCRNTI,
        //     ue_Identity: ue_Identity,
        //     establishmentCause: establishmentCause,
        //     spare: spare
        // });

        const msg4Response = {
            status: 'Success',
            message: 'Contention resolved, connection established',
            crnti: {
                "rrcConnectionnSetup-r8": {
                    "radioResourceConfigDedicated": {
                        "srb-ToAddModList": "srb-ToAddModList",
                        "drb-ToAddModList": "drb-ToAddModList",
                        "drb-ToReleaseList": "drb-ToReleaseList"
                    },
                    "mac-MainConfig": 123245,
                    "sps-Config": 123,
                    "physicalConfigDedicated": true
                },
                "nonCriticalExtension": false
            }
        };
        // console.log('Contention Resolution Response:', msg4Response);

        // Store the ue_Identity along with the status "Success"
        // ueIdentityStorage[tempCRNTI] = {
        //     ue_Identity: ue_Identity,
        //     status_msg3: 'Success'
        // };

        res.json(msg4Response);

        // //  store data in the smart contract
        // try {
        //     await storeDataEVM(ue_Identity, establishmentCause);
        //     res.json(msg4Response);
        // } catch (error) {
        //     // If an error occurs during interaction/storing with EVM
        //     console.error('Error storing data in EVM:cought inside /msg3');

        //     const errorMsg4Response = {
        //         status: 'Error',
        //         message: 'An error occurred while storing data in the blockchain'
        //     };
        //     res.status(500).json(errorMsg4Response);
        // }
    } else {
        const msg4Response = {
            status: 'Error',
            message: 'Temporary C-RNTI not found'
        };
        res.status(400).json(msg4Response);
    }
});


app.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});

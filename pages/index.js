import React, { useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import Navbar from '../components/Navbar'
import Options from '../components/Tabs'
import { ethers } from "ethers";
import { ABI, contractAddress } from '../lib/contractABI'
import SnackbarComponent from '../components/Snackbar'
import { addRide } from '../lib/funtions';
import accessToken from '../lib/tokens'



mapboxgl.accessToken = accessToken

const Home = () => {

  const [geojson, setGeojson] = useState({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: []
        },
        properties: {
          title: 'Mapbox',
          description: ''
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: []
        },
        properties: {
          title: 'Mapbox',
          description: ''
        }
      }
    ]
  })
  const [isMetamask, setIsMetamask] = useState(false)
  const [ethersObj, setEthersObj] = useState({
    provider: null,
    signer: null,
    currentAccount: null
  })

  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: '',
    severity: 'success',
    time: 3000

  })

  const [value, setValue] = useState(0)

  useEffect(() => {

    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: geojson.features[0].geometry.coordinates.length > 0 ? geojson.features[0].geometry.coordinates : [77.2090, 28.6139], // starting position [lng, lat]

      zoom: 6 // starting zoom
    });



    // add markers to map
    for (const feature of geojson.features) {
      // create a HTML element for each feature
      if (feature.geometry.coordinates.length > 0) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = "url('./pin1.png')"



        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
      }
    }

    if (geojson.features[0].geometry.coordinates && geojson.features[1].geometry.coordinates) {

      map.on('load', () => {

        map.addSource('route', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': [
                geojson.features[0].geometry.coordinates,
                geojson.features[1].geometry.coordinates
              ]
            }
          }
        });
        map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#888',
            'line-width': 8
          }
        });
      });



    }


  }, [geojson])

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      setIsMetamask(true)
    } else {
      setIsMetamask(false)
      setSnackbarData({
        open: true,
        message: 'Please Install Metamask!',
        severity: 'error',
        time: 5000

      })
    }


  }, [])


  const connectWallet = async () => {
    if (!ethersObj.currentAccount) {
      try {
        const providerObj = new ethers.providers.Web3Provider(window.ethereum)

        const currentAccount = await providerObj.send("eth_requestAccounts", [])

        const signerObj = providerObj.getSigner()

        setSnackbarData({
          open: true,
          message: 'Wallet Connected Successfully!',
          severity: 'success',
          time: 3000
        })
        setEthersObj({ currentAccount: currentAccount[0], provider: providerObj, signer: signerObj })
      } catch (error) {
        setSnackbarData({
          open: true,
          message: 'Please Try Again!',
          severity: 'error',
          time: 3000
        })
      }
    }


  }


  const sendEthereum = async (data) => {

    try {
      const tx = {
        from: ethersObj.currentAccount,
        to: contractAddress,
        value: ethers.utils.parseEther(data.amount),
        nonce: await ethersObj.provider.getTransactionCount(ethersObj.currentAccount, "latest"),
        gasLimit: ethers.utils.hexlify(100000),
        gasPrice: await ethersObj.provider.getGasPrice()
      }

      ethersObj.signer.sendTransaction(tx).then(async (transaction) => {
        try {
          await addRide(data, ethersObj.currentAccount, transaction.nonce, setSnackbarData, setValue)
          setSnackbarData({
            open: true,
            message: 'Your ride is on the way!',
            severity: 'success',
            time: 3000
          })
        } catch (error) {
          setSnackbarData({
            open: true,
            message: 'Error Updating The Database!',
            severity: 'error',
            time: 3000
          })
        }

      })

    } catch (error) {
      setSnackbarData({
        open: true,
        message: 'Transaction Failed!',
        severity: 'error',
        time: 3000
      })
    }

  }



  return (
    <>
      <div className='flex md:min-h-[100vh]   flex-col '  >
        <Navbar isMetamask={isMetamask} connectWallet={connectWallet} ethersObj={ethersObj} setSnackbarData={setSnackbarData} />

        <div className='flex flex-col md:flex-row md:flex-1 ' >

          <div className=' md:w-[40%] md:max-w-[450px] flex flex-col md:min-w-[300px]' >

            <Options geojson={geojson} setGeojson={setGeojson} sendEthereum={sendEthereum} ethersObj={ethersObj} setSnackbarData={setSnackbarData} value={value} setValue={setValue} />

          </div>

          <div id='map' className=' min-h-[600px] flex-1' >



          </div>

        </div>

        <SnackbarComponent snackbarData={snackbarData} setSnackbarData={setSnackbarData} />

      </div>
    </>
  )
}


export default Home
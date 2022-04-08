import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import carlist from '../lib/carlist';
import { Button } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';


const calcCrow = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

const toRad = (Value) => {
  return Value * Math.PI / 180;
}

const rideCost = (index, distance) => {
  const baseCost = distance * 0.000056
  switch (index) {
    case 0:
      return baseCost
    case 1:
      return baseCost + baseCost * 0.05
    case 2:
      return baseCost + baseCost * 0.06
    case 3:
      return baseCost + baseCost * 0.09
    default:
      return baseCost + baseCost * 0.2
  }
}

const Ride = ({ setGeojson, sendEthereum, ethersObj }) => {

  const [activeInput, setActiveInput] = useState(null)
  const [pickup, setPickup] = useState({
    location: '',
    coordinates: []
  })
  const [drop, setDrop] = useState({
    location: '',
    coordinates: []
  })

  const [inputs, setInputs] = useState({
    pickup: '',
    drop: ''
  })
  const [placesArray, setPlacesArray] = useState({
    pickup: [],
    drop: []
  })
  const [distance, setDistance] = useState('none')

  useEffect(() => {
    if (pickup.coordinates.length > 0 || drop.coordinates.length > 0) {
      setGeojson({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: pickup.coordinates
            },
            properties: {
              title: 'Mapbox',
              description: pickup.location
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: drop.coordinates
            },
            properties: {
              title: 'Mapbox',
              description: drop.location
            }
          }
        ]
      })
    }

    if (pickup.coordinates.length > 0 && drop.coordinates.length > 0) {

      setDistance(calcCrow(pickup.coordinates[1], pickup.coordinates[0], drop.coordinates[1], drop.coordinates[0]).toFixed(1))

    }

  }, [pickup, drop])

  const fetchPlaces = async (place) => {
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=pk.eyJ1Ijoic3VyeWFuc2h1LXhzIiwiYSI6ImNsMHFjenZ6YTI2ankzZHVvYThpc3ltaW4ifQ.yYslbc1XD5XVxtV75-wDzw`)

      const data = await response.json()

      const placesList = data.features.map(object => {
        return {
          place: object.place_name,
          coordinates: object.geometry.coordinates
        }
      })

      if (activeInput === 1) {
        let drop = placesArray.drop
        setPlacesArray({ drop: drop, pickup: placesList })

      } else {
        let pickup = placesArray.pickup
        setPlacesArray({ pickup: pickup, drop: placesList })
      }

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(async () => {

    if (activeInput === 1 && inputs.pickup) {
      await fetchPlaces(inputs.pickup)

    } else {
      if (inputs.drop) {
        await fetchPlaces(inputs.drop)
      }
    }

  }, [inputs])


  const handlePlaceSelected = (place, coordinates) => {
    if (activeInput == 1) {
      setPickup({
        location: place,
        coordinates: coordinates
      })
      setInputs({ ...drop, pickup: place })
      setActiveInput(null)
    } else {
      setDrop({
        location: place,
        coordinates: coordinates
      })
      setInputs({ ...pickup, drop: place })
      setActiveInput(null)
    }
  }





  return (
    <div className='flex flex-1 flex-col ride px-[2rem] md:px-[1rem] pt-6 min-h-[75vh]   ' >

      <div className='flex flex-col justify-between min-h-[250px]  ' >

        <div className='text-[1.8rem] md:text-[2rem] lg:text-[2.25rem] font-medium text-[#404040] ' >
          {
            activeInput ? <div className='' > <LocationOnIcon style={{
              marginRight: 10,
              fontSize: 28,
              color: '#454545'
            }} /> <span>{
              activeInput === 1 ? 'Your Pickup' : 'Your Destination'
            }</span> </div> : 'Where would you like to Ride?'
          }
        </div>

        <div className='w-[500px] max-w-[100%]' >
          <div className='mb-3 relative' >
            <input
              type="text"
              name="pickup"
              id=""
              placeholder='Pickup'
              onClick={() => setActiveInput(1)}
              value={inputs.pickup}
              onChange={(e) => setInputs({ ...drop, pickup: e.target.value })}
              className='border-2 border-[#696969] outline-none px-[1rem] py-[0.6rem] w-[100%] text-[14px] rounded-3xl'
            />

            <div className={`absolute pb-2 bg-white left-0 mt-1 right-0 z-50 ${activeInput == 1 ? 'block' : 'hidden'} `} >

              <div className='max-h-[250px] overflow-scroll no-scrollbar ' >
                {
                  placesArray.pickup.map((item, index) => <p className='px-[0.7rem] mb-[2px] py-[0.5rem] text-[0.825rem] text-[#424242] bg-[#f5f5f5] hover:bg-[#e3e3e3] cursor-pointer ' key={index} onClick={() => handlePlaceSelected(item.place, item.coordinates)}  > {item.place} </p>)
                }
              </div>

              <div className='flex items-center justify-center' >
                <Button
                  size='small'
                  sx={{
                    padding: '2px 0px',
                    color: '#525252',
                    width: 30,
                    fontSize: '0.8rem',
                    margin: '0.25rem auto'
                  }}
                  onClick={() => setActiveInput(null)}
                > Close </Button>
              </div>

            </div>

          </div>


          <div className='mb-3 relative' >
            <input
              type="text"
              name="drop"
              id=""
              disabled={pickup.location.length > 0 ? false : true}
              placeholder='Drop'
              onClick={() => setActiveInput(2)}
              value={inputs.drop}
              onChange={(e) => setInputs({ ...pickup, drop: e.target.value })}
              className='border-2 border-[#696969] outline-none px-[1rem] py-[0.6rem] w-[100%] text-[14px] rounded-3xl'
            />

            <div className={`absolute pb-2 bg-white left-0 mt-1 right-0 z-50 ${activeInput == 2 ? 'block' : 'hidden'} `} >

              <div className='max-h-[250px] overflow-scroll no-scrollbar ' >
                {
                  placesArray.drop.map((item, index) => <p className='px-[0.7rem] mb-[2px] py-[0.5rem] text-[0.825rem] text-[#424242] bg-[#f5f5f5] hover:bg-[#e3e3e3] cursor-pointer ' key={index} onClick={() => handlePlaceSelected(item.place, item.coordinates)}  > {item.place} </p>)
                }
              </div>

              <div className='flex items-center justify-center' >
                <Button
                  size='small'
                  sx={{
                    padding: '2px 0px',
                    color: '#525252',
                    width: 30,
                    fontSize: '0.8rem',
                    margin: '0.25rem auto'
                  }}
                  onClick={() => setActiveInput(null)}
                > Close </Button>
              </div>

            </div>

          </div>
        </div>

      </div>

      <div className='h-[30px] ' >
        {
          distance !== 'none' ? <span className='text-[0.8rem] font-medium text-[#424242] pl-[0.9rem] ' >
            Distance -
            {
              ' ' + distance + ' KM'
            }
          </span> : <></>
        }
      </div>

      <div className=' flex flex-col flex-1 ' >

        <div className='text-center text-[14px] my-2 text-neutral-500  ' >Please Select a Ride.</div>

        <div className='max-h-[250px] overflow-scroll no-scrollbar flex-1 ' >

          {
            carlist.map((carDetails, index) => <div key={index} className='flex my-1 bg-[#f2f2f2] py-1 px-1 hover:bg-[#e3e3e3] '>

              <img src={carDetails.pic} alt="" className='w-[60px] mr-3' />

              <div className=' flex-1 flex justify-between ' >

                <div className='flex flex-col justify-evenly' >

                  <span className='font-medium text-gray-700 text-[0.9rem] ' >
                    {carDetails.name}
                  </span>

                  <div className='text-[0.8rem] text-gray-700 font-medium flex items-center ' >
                    <StarRoundedIcon sx={{
                      fontSize: 16,
                      color: '#ffa01c'
                    }} />
                    <span className='ml-1' >{carDetails.ratings}</span>
                  </div>

                </div>

                <div className='flex flex-col items-end justify-center ' >

                  <div className='flex text-[0.85rem] justify-center items-center mr-[11px] font-medium text-gray-700 ' >

                    <img src="/eth-logo.png" alt="" className='w-[40px]' />
                    {
                      distance !== 'none' ? <span>{rideCost(index, distance).toFixed(10)}</span> : <span>00</span>
                    }

                  </div>

                  <Button
                    size='small'
                    disabled={distance === 'none' || ethersObj.currentAccount === null ? true : false}
                    onClick={() => sendEthereum({
                      car: carDetails.name,
                      filePath: carDetails.pic,
                      pickup: pickup.location,
                      drop: drop.location,
                      amount: rideCost(index, distance).toFixed(10)
                    })}
                    sx={{
                      padding: '1px 0px',
                      color: 'green',
                      width: 30,
                      fontSize: '0.75rem'
                    }} > Select </Button>

                </div>

              </div>

            </div>)
          }


        </div>

      </div>

    </div>
  )
}

export default Ride
import React, { useEffect, useState } from 'react'
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { getRecentRides } from '../lib/funtions';


const Recent = ({ ethersObj, setSnackbarData }) => {

  const [rideDataArray, setRideDataArray] = useState(null)

  useEffect(async () => {
    if (ethersObj.currentAccount) {
      setRideDataArray(await getRecentRides(ethersObj.currentAccount, setSnackbarData))
    } else {
      setRideDataArray(null)
      setSnackbarData({
        open: true,
        message: "Please Connect Your Wallet! ",
        severity: 'warning',
        time: 3000
      })
    }
  }, [])


  return (
    <div className='flex flex-1 flex-col px-[2rem] md:px-[1rem] pt-6 min-h-[75vh] '  >

      <div className='text-[1.8rem] mb-3 md:text-[2rem] lg:text-[2.25rem] font-medium text-[#404040] ' >
        Recent Rides

      </div>

      {
        rideDataArray !== null ?
          <div className='  min-h-[380px] max-h-[380px] py-[1rem] leading-4 ' >

            {
              rideDataArray.map((data, index) => {
                return <div className='bg-[#f2f2f2] py-2 px-1 border-gray-500 flex flex-col justify-start  shadow-md mb-[1rem] ' key={index} >

                  <div className='flex flex-row items-center ' >
                    <img src="location_on.png" alt="" className=' h-[30px]' />

                    <p className='text-[13px] ml-[10px] font-medium text-[#292929]  ' >{data.pickup}</p>

                  </div>

                  <div className=' border-l-2  border-[#636363] ml-[1rem] my-[9px] pl-[20px] flex  '   >

                    <img src={data.filePath} className=' h-[50px] ' alt="" />

                    <div className='ml-2 flex-1 items-center' >
                      <div className=' text-[13px] font-medium text-[#292929] flex justify-between items-center' >
                        <span>{data.car}</span>

                        <div className='flex text-[0.8rem] justify-center items-center  font-medium text-gray-700 mr-1 ' >

                          <img src="/eth-logo.png" alt="" className='w-[40px]' />
                          <span>{data.rideCost}</span>

                        </div>
                      </div>

                      <div className='flex items-center justify-end '  >
                        <StarRoundedIcon sx={{
                          fontSize: 18,
                          color: '#ffa01c'
                        }} />
                        <StarRoundedIcon sx={{
                          fontSize: 18,
                          color: '#ffa01c'
                        }} />
                        <StarRoundedIcon sx={{
                          fontSize: 18,
                          color: '#ffa01c'
                        }} />
                        <StarRoundedIcon sx={{
                          fontSize: 18,
                          color: '#ffa01c'
                        }} />
                      </div>


                    </div>

                  </div>

                  <div className='flex flex-row items-center ' >
                    <img src="location_on.png" alt="" className=' h-[30px]' />

                    <p className='text-[13px] ml-[10px] font-medium text-[#292929]  ' >{data.drop}</p>

                  </div>



                </div>
              })
            }


          </div> : <div className='min-h-[150px] flex justify-center items-center capitalize text-gray-600 ' >
            <div>
              You don't have any rides!
            </div>
          </div>
      }

    </div>
  )
}

export default Recent
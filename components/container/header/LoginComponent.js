"use client"
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { Boxes, ChevronDown, HeartPlus,  LogOut,  ShoppingCartIcon, UserCircle, UserCircleIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, logoutRequest } from '@/modules/user/state/userSlice';

function HeaderLoginComponent() {
  const [hover,setHover] = useState(false);
  const user = useSelector((state)=>(state.user))
  const dispatch = useDispatch();
  const handleClickLogout = ()=>{
      dispatch(logoutRequest())
  }
  console.log(user);
 const {name} = user?.user || ""
  return (
    <div className="order-2 md:order-3 flex items-center space-x-6">
          <div
            className=" flex items-center hover:text-rose-100 group  hover:py-1 p-1  rounded-sm "
            onMouseEnter={(prev)=>(setHover(true))}
            onMouseLeave={(prev)=>(setHover(false))}
            >
              <UserCircle className="text-white group-hover:text-rose-100
              " size={24} />
              {name?<div className='ml-2 hidden sm:flex items-center group'>
                {name}
              </div>:(<Link
                href="/user/login" 
                className="ml-2 hidden sm:flex items-center group">
                Login
                <ChevronDown size={16} className={`ml-1 group-hover:text-rose-100 ${hover?'rotate-0':'rotate-180'} transition duration-300`} />
              </Link>)}
              {hover&&
              <div className=' relative transition duration-300 '>
                <div className='text-slate-950 bg-white border border-slate-950  w-[300px] py-2 z-50 absolute top-4 right-0 rounded-sm flex flex-col'>
                  <Link 
                  className='flex gap-10 border-b p-4 w-full justify-between'
                  href={"/user/register" }
                  >
                    <span 
                      className='text-slate-950 font-bold'
                    >New customer?</span>
                    <span
                      className='text-blue-950 font-bold'
                    >Sign up</span>
                  </Link>
                  <Link 
                  className='flex gap-2 border-b border-gray-200 p-4 w-full justify-start'
                  href={"/user/profile" }
                  >
                    <UserCircleIcon/> User Profile
                  </Link>
                  <Link 
                  className='flex gap-2 border-b border-gray-200 p-4 w-full justify-start'
                  href={"/user/profile" }
                  >
                    <Boxes/> Orders
                  </Link>
                  <Link 
                  className='flex gap-2 border-b border-gray-200 p-4 w-full justify-start'
                  href={"/user/profile" }
                  >
                    <ShoppingCartIcon/> ViewCart
                  </Link>
                  <button 
                  className='flex gap-2  p-4 w-full justify-start'
                  onClick={handleClickLogout}
                  >
                    <LogOut/>Logout
                  </button>
                </div>
              </div>}
          </div>

          <Link href="/cart" className="relative">
            <ShoppingCartIcon className="hover:text-rose-100 text-white cursor-pointer" />
            <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-xs rounded-full px-1">0</span>
          </Link>

          <Link href="/ViewCart" className="relative">
            <HeartPlus className="hover:text-rose-100 text-white cursor-pointer" />
            <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-xs rounded-full px-1">0</span>
          </Link>
        </div>
  )
}

export default HeaderLoginComponent

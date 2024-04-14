'use client'

import { logout } from '@/actions'
import { useUiStore } from '@/store'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5'

export const SideBar = () => {
  const isSideMenuOpen = useUiStore((state) => state.isSideMenuOpen)
  const closeMenu = useUiStore((state) => state.closeSideMenu)

  const { data: session } = useSession()
  const isAuthenticated = !!session?.user
  const roleUser = session?.user.role

  const roles = {
    admin: 'admin',
    user: 'user',
  }

  return (
    <div>
      {/* background black */}
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black  opacity-30"></div>
      )}

      {isSideMenuOpen && (
        <div
          onClick={() => closeMenu()}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        ></div>
      )}

      {/* sidemeun */}

      <nav
        // todo: efecto slide
        className={clsx(
          'fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300',
          {
            'translate-x-full': !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          onClick={() => closeMenu()}
          size={50}
          className="absolute top-5 right-5 cursor-pointer"
        />

        <div className="relative mt-14">
          <IoSearchOutline size={20} className=" absolute top-2  left-2" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {isAuthenticated && (
          <Link
            onClick={() => closeMenu()}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
            href={'/profile'}
          >
            <IoPersonOutline size={30} />
            <span className="ml-3 text-xl">Perfil</span>
          </Link>
        )}

        {isAuthenticated && (
          <Link
            onClick={() => closeMenu()}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
            href={'/orders'}
          >
            <IoTicketOutline size={30} />
            <span className="ml-3 text-xl">Ordenes</span>
          </Link>
        )}

        {isAuthenticated && (
          <button
            onClick={() => logout()}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogOutOutline size={30} />
            <span className="ml-3 text-xl">Salir</span>
          </button>
        )}

        {!isAuthenticated && (
          <Link
            href={'/auth/login'}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogInOutline size={30} />
            <span className="ml-3 text-xl">Ingresar</span>
          </Link>
        )}

        {/* line separator */}

        <div className="w-full h-px bg-gray-200 my-10">
          {isAuthenticated && roles.admin === roleUser && (
            <>
              <Link
                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
                href={'/admin/products'}
                onClick={() => closeMenu()}
              >
                <IoShirtOutline size={30} />
                <span className="ml-3 text-xl">Productos</span>
              </Link>
              <Link
                onClick={() => closeMenu()}
                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
                href={'/admin/orders'}
              >
                <IoTicketOutline size={30} />
                <span className="ml-3 text-xl">Ordenes</span>
              </Link>

              <Link
                onClick={() => closeMenu()}
                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
                href={'/admin/users'}
              >
                <IoPeopleOutline size={30} />
                <span className="ml-3 text-xl">Usuarios</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}

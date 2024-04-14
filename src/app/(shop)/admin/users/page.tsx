export const revalidate = 0

import {
  getOrdersByUser,
  getPaginatedOrders,
  getPaginatedUser,
} from '@/actions'
import { Title } from '@/components'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { IoCardOutline } from 'react-icons/io5'
import { UsersTable } from './ui/UsersTable'
import { User } from '@/interfaces'

import { Pagination } from '@/components'
// import { revalidate } from '../product/[slug]/page';

export default async function UsersPage() {
  const { ok, users = [] } = await getPaginatedUser()

  if (!ok) {
    redirect('auth/login')
  }

  return (
    <>
      <Title title="Gestión de usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />
        <Pagination totalPages={1} />
      </div>
    </>
  )
}

'use server'

import { PayPalOrderStatusResponse } from '@/interfaces'
import prisma from '@/lib/prisma'
import { PurchaseUnit } from '../../interfaces/paypal.interface'
import { revalidate } from '@/app/(shop)/page'
import { revalidatePath } from 'next/cache'

export const payPalCheckPayment = async (paypaltransctionId: string) => {
  const authToken = await getPayPalBearerToken()

  if (!authToken) {
    return {
      ok: false,
      message: 'no se pudo obtener el token de verificación ',
    }
  }

  const resp = await verifyPayPalPayment(paypaltransctionId, authToken)

  if (!resp) {
    return {
      ok: false,
      message: ' error al verificar el pago',
    }
  }
  const { status, purchase_units } = resp
  console.log({ status, purchase_units })

  const { invoice_id: orderId } = purchase_units[0]

  if (status !== 'COMPLETED') {
    return {
      ok: false,
      message: 'Aun no se ha pagado a traves de payPal',
    }
  }

  //todo guardar en la bd

  try {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    })

    // todo revalidar un path

    revalidatePath(`/orders/${orderId}`)

    return {
      ok: true,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: true,
      message: '500 - EL pago no se pudo realizar',
    }
  }
}

const getPayPalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENTE_ID
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET
  const oauth2URL = process.env.PAYPAL_OAUTH_URL ?? ''

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    'utf-8'
  ).toString('base64')

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
  myHeaders.append('Authorization', `Basic ${base64Token}`)

  const urlencoded = new URLSearchParams()
  urlencoded.append('grant_type', 'client_credentials')

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  }

  try {
    const result = await fetch(oauth2URL, {
      ...requestOptions,
      cache: 'no-store',
    }).then((r) => r.json())
    return result.access_token
  } catch (error) {
    console.log(error)
    return null
  }
}

const verifyPayPalPayment = async (
  payPalTransactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const PAYPAL_ORDERS_URL = `${process.env.PAYPAL_ORDERS_URL}/${payPalTransactionId}`

  const myHeaders = new Headers()
  myHeaders.append('Authorization', `Bearer ${bearerToken}`)

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  }

  try {
    const result = await fetch(PAYPAL_ORDERS_URL, {
      ...requestOptions,
      cache: 'no-store',
    }).then((r) => r.json())
    return result
  } catch (error) {
    console.log(error)
    return null
  }
}

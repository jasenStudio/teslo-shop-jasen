'use client'

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveActions,
  OnApproveData,
} from '@paypal/paypal-js'
import { payPalCheckPayment, setTransactionsId } from '@/actions'

interface Props {
  orderId: string
  amount: number
}

export const PayPalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer()

  const rountedAmount = Math.round(amount * 100) / 100

  if (isPending) {
    return (
      <div className="animate-pulse mb-16">
        <div className="h-11 bg-gray-300 rounded" />
        <div className="h-11 bg-gray-300 rounded mt-2" />
      </div>
    )
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: 'CAPTURE', // O 'AUTHORIZE' según tu caso
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: `${rountedAmount}`,
            currency_code: 'USD', // Aquí especifica el código de la moneda
          },
        },
      ],
    })

    const { ok, order: orderUpdate } = await setTransactionsId(
      orderId,
      transactionId
    )
    console.log({ ok, orderUpdate })
    return transactionId
  }

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    console.log('onApproved')
    const details = await actions.order?.capture()
    if (!details) return

    await payPalCheckPayment(details.id!)
  }

  return (
    <div className="relative z-0">
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </div>
  )
}

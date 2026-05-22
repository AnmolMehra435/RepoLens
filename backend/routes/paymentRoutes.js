import express from 'express'
import crypto from 'crypto'
import { razorpay } from '../services/razorpayClient.js'
import { protect } from '../middleware/authMiddleware.js'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

const PLANS = {
  pro: { amount: 4900, name: 'Pro Plan' },
}

// POST /api/payment/create-order
router.post('/create-order', protect, async (req, res) => {
  const { plan } = req.body

  if (!PLANS[plan]) {
    return res.status(400).json({ message: 'Invalid plan' })
  }

  try {
    const order = await razorpay.orders.create({
      amount:   PLANS[plan].amount,
      currency: 'INR',
      receipt: `r_${String(req.user._id).slice(-8)}_${Date.now().toString().slice(-8)}`,
      notes: {
        userId: String(req.user._id),
        plan,
      },
    })

    res.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
      name:     req.user.name,
      email:    req.user.email,
    })
  } catch (err) {
    console.error('Razorpay order error:', err)
    res.status(500).json({ message: 'Failed to create order' })
  }
})

// POST /api/payment/verify-payment
router.post('/verify-payment', protect, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
  } = req.body

  const body = razorpay_order_id + '|' + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Invalid payment signature' })
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { plan },
      { new: true }
    )

    res.json({
      success: true,
      plan:    user.plan,
      message: `Successfully upgraded to ${plan} plan`,
    })
  } catch (err) {
    console.error('Plan update error:', err)
    res.status(500).json({ message: 'Payment verified but plan update failed' })
  }
})

export default router
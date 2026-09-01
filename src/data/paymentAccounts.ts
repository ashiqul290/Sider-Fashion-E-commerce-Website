import { PaymentAccountConfig } from '../types';

/**
 * SIDER FASHION OFFICIAL PAYMENT ACCOUNT CONFIGURATION
 * 
 * IMPORTANT:
 * This configuration holds editable account details for bKash and Nagad.
 * The account numbers can be changed here as needed.
 */
export const PAYMENT_ACCOUNTS_CONFIG: PaymentAccountConfig = {
  bkash: {
    accountNumber: '01712773063', // Sider Fashion Official Account Placeholder
    accountType: 'Personal (Send Money)',
    instructionsEn: [
      'Open your bKash App or dial *247#',
      'Select "Send Money" (or "Payment" if using merchant account)',
      'Enter Sider Fashion bKash Number: 01712773063',
      'Enter the exact Total Order Amount',
      'Use your Phone Number or Order Reference in reference (optional)',
      'Enter your bKash PIN in your mobile app to confirm payment',
      'Copy the Transaction ID (TrxID) from your bKash SMS/App and paste it below'
    ],
    instructionsBn: [
      'আপনার বিকাশ অ্যাপ ওপেন করুন অথবা ডায়াল করুন *247#',
      '"Send Money" অপশন সিলেক্ট করুন',
      'সাইডার ফ্যাশন বিকাশ নম্বর লিখুন: 01712773063',
      'আপনার অর্ডারের সর্বমোট টাকার পরিমাণ লিখুন',
      'পেমেন্ট সম্পন্ন করে ফিরতি এসএমএস বা অ্যাপ থেকে Transaction ID (TrxID) সংগ্রহ করুন',
      'অর্ডার সম্পূর্ণ করতে নিচের ঘরে সঠিক Transaction ID টি পেস্ট বা টাইপ করুন'
    ]
  },
  nagad: {
    accountNumber: '01712773063', // Sider Fashion Official Account Placeholder
    accountType: 'Personal (Send Money)',
    instructionsEn: [
      'Open your Nagad App or dial *167#',
      'Select "Send Money"',
      'Enter Sider Fashion Nagad Number: 01712773063',
      'Enter the exact Total Order Amount',
      'Use your Phone Number or Order Reference in reference (optional)',
      'Enter your Nagad PIN in your mobile app to confirm payment',
      'Copy the Transaction ID (TrxID) from your Nagad SMS/App and paste it below'
    ],
    instructionsBn: [
      'আপনার নগদ অ্যাপ ওপেন করুন অথবা ডায়াল করুন *167#',
      '"Send Money" অপশন সিলেক্ট করুন',
      'সাইডার ফ্যাশন নগদ নম্বর লিখুন: 01712773063',
      'আপনার অর্ডারের সর্বমোট টাকার পরিমাণ লিখুন',
      'পেমেন্ট সম্পন্ন করে ফিরতি এসএমএস বা অ্যাপ থেকে Transaction ID (TrxID) সংগ্রহ করুন',
      'অর্ডার সম্পূর্ণ করতে নিচের ঘরে সঠিক Transaction ID টি পেস্ট বা টাইপ করুন'
    ]
  }
};

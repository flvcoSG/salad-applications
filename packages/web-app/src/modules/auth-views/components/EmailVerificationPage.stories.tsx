import { action } from '@storybook/addon-actions'
import React from 'react'
import { EmailVerificationPage } from './EmailVerificationPage'

export default {
  title: 'Modules/Profile/Email Verification Page',
  component: EmailVerificationPage,
}

const handleCheckEmailVerification = (...args: any[]) => {
  action('Check Email Verification')(...args)
  return Promise.resolve(false)
}

const handleEmailVerificationComplete = (...args: any[]) => {
  action('Email Verification Complete')(...args)
  return Promise.resolve()
}

const handleResendVerificationEmail = (...args: any[]) => {
  action('Resend')(...args)
  return Promise.resolve()
}

export const WithoutEmailAndWithoutResend = () => (
  <EmailVerificationPage
    canResendVerificationEmail={false}
    onCheckEmailVerification={handleCheckEmailVerification}
    onCloseRequested={action('Close')}
    onEmailVerificationComplete={handleEmailVerificationComplete}
    onResendVerificationEmail={handleResendVerificationEmail}
  />
)

export const WithoutEmailAndWithResend = () => (
  <EmailVerificationPage
    canResendVerificationEmail
    onCheckEmailVerification={handleCheckEmailVerification}
    onCloseRequested={action('Close')}
    onEmailVerificationComplete={handleEmailVerificationComplete}
    onResendVerificationEmail={handleResendVerificationEmail}
  />
)

export const WithEmailAndWithoutResend = () => (
  <EmailVerificationPage
    canResendVerificationEmail={false}
    emailAddress="user@example.com"
    onCheckEmailVerification={handleCheckEmailVerification}
    onCloseRequested={action('Close')}
    onEmailVerificationComplete={handleEmailVerificationComplete}
    onResendVerificationEmail={handleResendVerificationEmail}
  />
)

export const WithEmailAndWithResend = () => (
  <EmailVerificationPage
    canResendVerificationEmail
    emailAddress="user@example.com"
    onCheckEmailVerification={handleCheckEmailVerification}
    onCloseRequested={action('Close')}
    onEmailVerificationComplete={handleEmailVerificationComplete}
    onResendVerificationEmail={handleResendVerificationEmail}
  />
)

import { Link } from 'react-router-dom'

function PolicyContact({ subject = 'this policy or an order' }) {
  return (
    <div className="space-y-2">
      <p>For questions about {subject}, contact Ganesh Pickles:</p>
      <address className="space-y-1 not-italic">
        <p>Palakkad, Kerala, India</p>
        <p>Email: <a className="font-semibold text-brand underline underline-offset-4" href="mailto:nuraniganeshpickles@yahoo.com">nuraniganeshpickles@yahoo.com</a></p>
        <p>
          Phone: <a className="font-semibold text-brand underline underline-offset-4" href="tel:+919447960265">+91 94479 60265</a>,{' '}
          <a className="font-semibold text-brand underline underline-offset-4" href="tel:+919872348112">+91 98723 48112</a>, or{' '}
          <a className="font-semibold text-brand underline underline-offset-4" href="tel:04912528207">0491-2528207</a>
        </p>
      </address>
      <p>You may also use our <Link className="font-semibold text-brand underline underline-offset-4" to="/contact">contact page</Link>.</p>
    </div>
  )
}

export default PolicyContact

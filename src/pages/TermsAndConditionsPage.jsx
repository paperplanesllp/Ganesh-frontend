import { Link } from 'react-router-dom'

const sections = [
  {
    title: '1. Introduction',
    content: (
      <p>
        Welcome to Ganesh Pickles. These Terms &amp; Conditions govern your access to and use of this website and your purchase of our packaged food products, including pickles, spice powders, vathals, and related products. Please read them carefully before using the website or placing an order.
      </p>
    ),
  },
  {
    title: '2. Acceptance of Terms',
    content: (
      <p>
        By accessing the website, creating an account, or placing an order, you agree to these Terms &amp; Conditions and the policies referred to on the website. If you do not agree, please do not use the website or place an order.
      </p>
    ),
  },
  {
    title: '3. Eligibility to Use the Website',
    content: (
      <p>
        You must be legally capable of entering into a binding contract under applicable Indian law to place an order. If you use the website on behalf of another person or organisation, you confirm that you have authority to bind them to these terms. Minors may use the website only under the supervision of a parent or legal guardian.
      </p>
    ),
  },
  {
    title: '4. Products and Product Information',
    content: (
      <p>
        We aim to describe our products, ingredients, pack sizes, images, and other details accurately. Product images are illustrative, and the actual colour, texture, appearance, packaging, or label may vary slightly. Please review the product label and information supplied with the product before consumption, particularly where you have allergies, intolerances, dietary requirements, or medical concerns.
      </p>
    ),
  },
  {
    title: '5. Pricing and Availability',
    content: (
      <p>
        Prices are displayed in Indian Rupees and will be applied as shown at checkout, together with any applicable taxes, delivery charges, or other disclosed fees. Prices, offers, and availability may change without prior notice. Adding a product to your cart does not reserve it or guarantee its price or availability.
      </p>
    ),
  },
  {
    title: '6. Orders and Order Acceptance',
    content: (
      <p>
        Your order is an offer to purchase the selected products. An automated acknowledgement does not by itself mean that the order has been accepted. We may accept, limit, or decline an order where a product is unavailable, information or pricing is incorrect, payment is not authorised, delivery is not serviceable, the order appears fraudulent, or applicable law requires it. If payment has been received for an order we cannot fulfil, the appropriate refund will be initiated through the original payment method.
      </p>
    ),
  },
  {
    title: '7. Payments',
    content: (
      <p>
        You agree to provide complete and accurate billing and payment information. Payments may be processed through the payment options and third-party gateways shown at checkout. An order may remain unconfirmed until payment is successfully authorised or received. Ganesh Pickles does not directly control a payment provider&apos;s systems, security checks, bank processing, or service availability.
      </p>
    ),
  },
  {
    title: '8. Order Cancellation',
    content: (
      <p>
        To request cancellation, contact us as soon as possible with your order details. A request is not guaranteed and will depend on the order&apos;s processing or dispatch status and the nature of the products. We may cancel an order for the reasons described in these terms. Any eligible payment reversal or refund will be handled through the original payment method, subject to payment-provider processing.
      </p>
    ),
  },
  {
    title: '9. Shipping and Delivery',
    content: (
      <p>
        Delivery availability, charges, and any estimated delivery information will be communicated during checkout or after order confirmation where applicable. Estimates are not guarantees and may be affected by courier operations, weather, public holidays, serviceability, incorrect address details, or other circumstances beyond reasonable control. You are responsible for providing a complete address and an available contact number and for ensuring that someone can receive the order.
      </p>
    ),
  },
  {
    title: '10. Returns and Refunds',
    content: (
      <p>
        Requests relating to a damaged, defective, incorrect, tampered, or missing product will be assessed based on the circumstances and applicable law. Please contact us promptly with the order number, a description of the issue, and clear photographs of the product, packaging, and label where relevant. Eligibility for a replacement, return, or refund depends on verification of the claim, the product&apos;s condition, and its food-safety requirements. Any approved refund will be sent through the original payment method unless otherwise required by law.
      </p>
    ),
  },
  {
    title: '11. Food Product / Perishable Product Conditions',
    content: (
      <div className="space-y-3">
        <p>
          Because food products are consumable and may be perishable or sensitive to storage and handling, products that have been opened, used, consumed, altered, or stored improperly ordinarily cannot be accepted for return, except where required by applicable law or where we verify a qualifying product issue.
        </p>
        <p>
          Follow all storage, refrigeration-after-opening, best-before, allergen, and usage instructions on the packaging. Do not consume a product if its seal is broken on arrival, the packaging appears tampered with, or the product appears unsafe. Natural variations may occur in traditionally prepared food products and do not necessarily indicate a defect.
        </p>
      </div>
    ),
  },
  {
    title: '12. User Accounts, if applicable',
    content: (
      <p>
        Some website features may require an account. You are responsible for keeping your login credentials confidential, providing accurate account information, and notifying us of suspected unauthorised use. We may restrict or suspend an account where reasonably necessary to protect customers, the website, or comply with law.
      </p>
    ),
  },
  {
    title: '13. Accuracy of Information',
    content: (
      <p>
        We make reasonable efforts to keep website content accurate and current, but typographical errors, omissions, or outdated information may occasionally occur. We may correct such information and update or cancel affected orders where appropriate. Nothing in this section limits rights that cannot lawfully be excluded.
      </p>
    ),
  },
  {
    title: '14. Intellectual Property',
    content: (
      <p>
        The website and its branding, logos, product photographs, text, graphics, layout, and other content are owned by or licensed to Ganesh Pickles and are protected by applicable intellectual-property laws. You may use the website only for personal, non-commercial shopping and information purposes. You may not copy, reproduce, modify, distribute, or commercially exploit its content without prior written permission.
      </p>
    ),
  },
  {
    title: '15. Prohibited Uses',
    content: (
      <p>
        You must not misuse the website; attempt unauthorised access; interfere with its operation or security; introduce malicious code; scrape or harvest data without permission; impersonate another person; submit false, misleading, or fraudulent information; violate another person&apos;s rights; or use the website for any unlawful purpose.
      </p>
    ),
  },
  {
    title: '16. Limitation of Liability',
    content: (
      <p>
        To the extent permitted by applicable law, Ganesh Pickles will not be liable for indirect, incidental, special, or consequential loss arising from use of the website, third-party services, delivery delays beyond reasonable control, or use or storage of products contrary to label instructions. Nothing in these terms excludes or limits liability, statutory warranties, or consumer rights that cannot be excluded or limited under Indian law.
      </p>
    ),
  },
  {
    title: '17. Third-Party Services / Payment Gateways',
    content: (
      <p>
        The website may use third-party services such as payment gateways, logistics providers, communications platforms, or external links. Their services may be governed by their own terms and privacy practices. We are not responsible for third-party websites or systems outside our reasonable control, but this does not affect any responsibility we have under applicable law for your order.
      </p>
    ),
  },
  {
    title: '18. Privacy',
    content: (
      <p>
        We process personal information for purposes such as account management, order fulfilment, payment support, delivery, customer service, fraud prevention, and legal compliance. Please review the privacy information made available on the website for further details. By using the website, you acknowledge that information required to complete your transaction may be shared with relevant service providers, subject to applicable law.
      </p>
    ),
  },
  {
    title: '19. Changes to Terms',
    content: (
      <p>
        We may update these Terms &amp; Conditions to reflect changes in our services, business practices, technology, or legal requirements. The revised terms will be posted on this page with an updated date. Changes apply from publication unless stated otherwise and do not retrospectively reduce rights already accrued under applicable law.
      </p>
    ),
  },
  {
    title: '20. Governing Law and Jurisdiction',
    content: (
      <p>
        These Terms &amp; Conditions are governed by the applicable laws of India. Any dispute will be handled by the courts or consumer forums having jurisdiction under applicable law. You may also have rights and remedies under Indian consumer-protection law.
      </p>
    ),
  },
  {
    title: '21. Contact Information',
    content: (
      <div className="space-y-2">
        <p>For questions about these terms or assistance with an order, contact Ganesh Pickles:</p>
        <address className="space-y-1 not-italic">
          <p>Palakkad, Kerala, India</p>
          <p>
            Email:{' '}
            <a className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:text-brand-dark" href="mailto:nuraniganeshpickles@yahoo.com">
              nuraniganeshpickles@yahoo.com
            </a>
          </p>
          <p>
            Phone:{' '}
            <a className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:text-brand-dark" href="tel:+919447960265">+91 94479 60265</a>
            {', '}
            <a className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:text-brand-dark" href="tel:+919872348112">+91 98723 48112</a>
            {', or '}
            <a className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:text-brand-dark" href="tel:04912528207">0491-2528207</a>
          </p>
        </address>
        <p>
          You may also use our <Link className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:text-brand-dark" to="/contact">contact page</Link>.
        </p>
      </div>
    ),
  },
]

function TermsAndConditionsPage() {
  return (
    <div className="bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <p className="text-sm font-bold uppercase tracking-wide text-brand">Legal</p>
          <h1 className="mt-3 font-[Georgia,serif] text-3xl font-bold leading-tight text-brand-dark sm:text-4xl md:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Last Updated:</span> 13 August 2026
          </p>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="space-y-9 sm:space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-[Georgia,serif] text-xl font-bold leading-snug text-brand-dark sm:text-2xl">
                {section.title}
              </h2>
              <div className="mt-3 text-[15px] leading-7 text-gray-700 sm:text-base sm:leading-8">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  )
}

export default TermsAndConditionsPage

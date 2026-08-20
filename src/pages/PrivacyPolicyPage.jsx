import { useEffect } from 'react'

const providedInformation = [
  'Your name;',
  'Mobile/telephone number;',
  'Email address;',
  'Billing and delivery address;',
  'Order and purchase information;',
  'Information provided when contacting customer support;',
  'Product reviews, feedback or other communications you voluntarily provide;',
  'Information required to process refunds, replacements or complaints.',
]

const automaticallyCollectedInformation = [
  'IP address',
  'Browser type',
  'Device type',
  'Operating system',
  'Pages visited',
  'Approximate usage information',
  'Referring website or source',
  'Cookies and similar technologies',
]

const informationUses = [
  'Processing and fulfilling your orders',
  'Confirming and communicating about orders',
  'Arranging delivery',
  'Providing customer support',
  'Processing refunds, replacements and cancellations',
  'Responding to complaints and food-quality concerns',
  'Improving our products, Website and customer experience',
  'Maintaining Website security',
  'Detecting and preventing fraud, abuse or unauthorised activity',
  'Maintaining business, tax, accounting and transaction records',
  'Complying with applicable laws and regulatory requirements',
]

const technologyServices = [
  'Website hosting',
  'Website maintenance',
  'Analytics',
  'Customer communication',
  'Email, SMS or WhatsApp communications',
  'Marketing and advertising',
  'Customer support',
]

const retentionReasons = [
  'Fulfilling orders',
  'Providing customer support',
  'Processing returns, refunds and complaints',
  'Maintaining financial and tax records',
  'Complying with legal obligations',
  'Resolving disputes',
  'Preventing fraud and misuse',
]

function TextList({ items }) {
  return (
    <ul className="list-disc space-y-1 pl-6">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-[Georgia,serif] text-xl font-bold leading-snug text-brand-dark sm:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-7 text-gray-700 sm:text-base sm:leading-8">{children}</div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Privacy Policy | Ganesh Pickles'
    return () => { document.title = previousTitle }
  }, [])

  return (
    <div className="bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <h1 className="mt-3 font-[Georgia,serif] text-3xl font-bold leading-tight text-brand-dark sm:text-4xl md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-gray-600"><span className="font-semibold text-gray-800">Last Updated:</span> 13 August 2026</p>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="space-y-9 sm:space-y-10">
          <div className="space-y-3 text-[15px] leading-7 text-gray-700 sm:text-base sm:leading-8">
            <p>Ganesh Pickles, operated by Sree Ganesh Enterprises (&quot;Ganesh Pickles&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), respects your privacy and is committed to protecting the personal information you share with us.</p>
            <p>This Privacy Policy explains how we collect, use, store, disclose and protect personal information when you visit or use <a className="underline" href="http://www.ganeshpickles.com/">www.ganeshpickles.com</a> (&quot;Website&quot;), purchase our products, contact us, or otherwise interact with us.</p>
            <p>By using our Website or providing your personal information to us, you acknowledge that you have read and understood this Privacy Policy.</p>
          </div>

          <Section title="1. Who We Are">
            <p><strong>Brand:</strong> Ganesh Pickles<br /><strong>Legal/Business Name:</strong> Sree Ganesh Enterprises<br /><strong>Address:</strong> 24/388, Double Street, Nurani, Palakkad, Kerala – 678004, India<br /><strong>Website:</strong> <a className="underline" href="http://www.ganeshpickles.com/">www.ganeshpickles.com</a><br /><strong>Customer Care Email:</strong> nuraniganeshpickles@yahoo.com<br /><strong>Customer Care Phone:</strong> +91 94479 60265</p>
            <p>For privacy-related questions or requests, please contact us using the details above.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p>Depending on how you interact with our Website, we may collect the following information.</p>
            <h3 className="font-[Georgia,serif] text-lg font-bold text-brand-dark">2.1 Information You Provide</h3>
            <p>When you place an order, create an account, contact us, submit a form, provide feedback, or otherwise interact with us, we may collect:</p>
            <TextList items={providedInformation} />
            <h3 className="font-[Georgia,serif] text-lg font-bold text-brand-dark">2.2 Payment Information</h3>
            <p>Payments made through the Website may be processed by third-party payment service providers.</p>
            <p>Where payment processing is handled by such providers, your card, bank, UPI or other payment credentials may be processed directly by the relevant payment provider in accordance with its own privacy and security practices.</p>
            <p>We do not intend to collect or retain complete payment-card credentials on our own systems unless specifically stated otherwise.</p>
            <h3 className="font-[Georgia,serif] text-lg font-bold text-brand-dark">2.3 Information Collected Automatically</h3>
            <p>When you use the Website, certain technical information may be collected automatically, including:</p>
            <TextList items={automaticallyCollectedInformation} />
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We may use personal information for legitimate business and operational purposes, including:</p>
            <TextList items={informationUses} />
          </Section>

          <Section title="4. Sharing of Information">
            <p>We may share relevant personal information with trusted third parties where reasonably necessary to provide our services or operate our business.</p>
            <p>These may include:</p>
            <h3 className="font-bold text-brand-dark">Payment Service Providers</h3>
            <p>Payment information may be processed by payment gateways and financial service providers used on our Website.</p>
            <h3 className="font-bold text-brand-dark">Delivery and Logistics Partners</h3>
            <p>We may provide your name, mobile number, delivery address and relevant order information to courier and logistics partners so that your order can be delivered.</p>
            <h3 className="font-bold text-brand-dark">Technology and Service Providers</h3>
            <p>We may use third-party providers for services such as:</p>
            <TextList items={technologyServices} />
            <h3 className="font-bold text-brand-dark">Legal and Regulatory Authorities</h3>
            <p>We may disclose information where required or permitted by applicable law, legal process, court order, governmental request, or for the prevention, detection or investigation of fraud or other unlawful activity.</p>
            <p>We do not sell your personal information as a standalone product.</p>
          </Section>

          <Section title="6. Data Retention">
            <p>We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including:</p>
            <TextList items={retentionReasons} />
            <p>The period for which information is retained may vary depending on the nature of the information and the applicable legal requirements.</p>
          </Section>

          <Section title="7. Data Security">
            <p>We take reasonable technical and organisational measures to protect personal information against unauthorised access, misuse, alteration, disclosure or destruction.</p>
            <p>However, no method of transmission or storage over the internet can be guaranteed to be completely secure. Accordingly, while we take reasonable precautions, we cannot guarantee absolute security of information transmitted to or through the Website.</p>
          </Section>

          <Section title="8. Third-Party Websites and Services">
            <p>Our Website may contain links to third-party websites, payment services, social-media platforms or other external services.</p>
            <p>We are not responsible for the privacy practices, security or content of third-party websites or services. We recommend reviewing their respective privacy policies before providing personal information.</p>
          </Section>

          <Section title="9. Changes to this Privacy Policy">
            <p>We may update this Privacy Policy from time to time to reflect changes in our business, Website, technology or applicable legal requirements.</p>
            <p>The updated version will be published on this page with a revised &quot;Last Updated&quot; date.</p>
          </Section>

          <Section title="10. Contact Us">
            <p>For questions, concerns or requests relating to this Privacy Policy, please contact:</p>
            <p>Sree Ganesh Enterprises / Ganesh Pickles<br />24/388, Double Street, Nurani,<br />Palakkad, Kerala – 678004, India<br /><strong>Email:</strong> nuraniganeshpickles@yahoo.com<br /><strong>Phone:</strong> +91 94479 60265</p>
            <p>This Privacy Policy should be read together with our Terms &amp; Conditions and Refund &amp; Cancellation Policy.</p>
          </Section>
        </div>
      </article>
    </div>
  )
}

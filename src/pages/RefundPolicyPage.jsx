import { useEffect } from 'react'

const policyText = `At Ganesh Pickles, we take care in preparing, packing and dispatching our products.
Because our products are food items, including pickles, vathals and spice powders, we follow a specific policy for cancellations, returns, refunds and replacements.
This policy applies to purchases made through [www.ganeshpickles.com](http://www.ganeshpickles.com/).
1. Cancellation of Orders
1.1 Cancellation Before Dispatch
You may request cancellation of your order before it has been dispatched.
To request cancellation, please contact us as soon as possible with:
Order number
Name used for the order
Registered mobile number or email address.
If the order has not yet been dispatched, we will make reasonable efforts to cancel it.
If payment has already been received, an eligible refund will be initiated through the original payment method or another appropriate method, as applicable.
1.2 Cancellation After Dispatch
Once an order has been dispatched, cancellation will not be possible.
However, this does not affect your rights in relation to products that are damaged, defective, incorrectly supplied, missing or otherwise subject to a legitimate complaint under applicable law.
2. Returns of Food Products
For hygiene and food-safety reasons, we generally do not accept returns of food products solely because:
You have changed your mind
You ordered the wrong product
You do not like the taste or flavour
You no longer require the product
You selected the wrong quantity
Opened, used or partially consumed food products are generally not eligible for return solely for these reasons.
This restriction does not apply to legitimate complaints concerning damaged, defective, incorrectly supplied or potentially unsafe products.
3. Damaged or Leaking Products
If your order arrives with a broken, leaking, crushed or otherwise materially damaged product, please contact us as soon as reasonably possible after delivery.
Please provide:
Order number
Photographs of the outer package
Photographs of the damaged product
Photographs of the product label
Batch/lot number, where visible
A brief description of the damage
Where reasonably possible, please retain the packaging and affected product until the complaint has been reviewed.
Depending on the circumstances, we may provide:
A replacement product
A refund
A partial refund 
Another appropriate remedy.
4. Incorrect Product
If you receive a product that is different from the product ordered, please contact us promptly.
For example, if you ordered one variety of pickle but received another variety, we may arrange an appropriate replacement or refund after verifying the order.


5. Missing Products
If one or more products are missing from your order, please contact us with your order number and details of the missing item.
We will investigate the order and packing/delivery information and, where appropriate, arrange:
Shipment of the missing product; or
A refund for the missing product.
6. Food-Quality or Food-Safety Concerns
If you believe that a product:
Appears spoiled
Has an unusual smell or appearance
Appears contaminated
Has a damaged or compromised seal
Has another significant quality concern or
May be unsafe to consume,
please do not consume the product.
Contact us as soon as possible and provide:
Order number
Product name
Batch/lot number
Photographs of the product and packaging
Description of the concern
Date of delivery
We may request additional information to investigate the complaint.
Depending on the nature of the issue, we may arrange a replacement, refund or other appropriate remedy.
Where appropriate, we may also investigate the relevant production batch to identify and address any broader quality issue.


7. Products Past Their Best-Before/Use-By Date
If you receive a product that appears to have been supplied past its applicable best-before/use-by date, please do not consume it.
Contact us promptly with photographs showing:
Product name
Date information
Batch/lot number
Order number
We will investigate the matter and provide an appropriate remedy where applicable.
8. Refunds
Where a refund is approved, we will generally initiate the refund through the original payment method used for the order, where technically possible.
The approved refunds will be credited within 10 days from the date of initiation in the original mode of payment
We are not responsible for delays caused solely by the customer's bank or payment provider after the refund has been initiated by us.
9. Return for replacement
Return-related issues should be reported within 1 day of receival. Opened, used or partially consumed food products, as said earlier, are generally not eligible for return solely for these reasons.

After verification, an eligible issue may be resolved through replacement of the affected item, refund through the original payment method when applicable, or another remedy appropriate under applicable law.

The replacement orders will be delivered within 5 business days, after the returned item reaches the warehouse.

Do not send a product back without instructions from us, because the food safety requirements and resolutions may vary by issue.

Note that the replacement depends on the product availability and serviceability.
10. Shipping Charges
Where a refund or replacement is approved because the product was incorrectly supplied, materially damaged in transit, missing, defective or subject to another legitimate product-related complaint, Ganesh Pickles will determine the appropriate treatment of shipping charges based on the circumstances.
For customer-initiated cancellations or non-defect-related requests, shipping charges may not be refundable where the order has already been processed or dispatched.
12. Order Refusal or Failed Delivery
If an order cannot be delivered because the customer has provided an incorrect or incomplete address, is repeatedly unavailable, or otherwise prevents delivery, we may contact the customer to arrange re-delivery.
Additional delivery charges may apply where re-delivery is requested because of incorrect information or customer-related delivery failure.
If an order is returned to us by the courier, we will contact the customer where reasonably possible to determine whether re-shipment or cancellation is appropriate. Shipping charges will not be refundable on that occasion. 
13. How to Contact Us
For cancellation, refund, replacement or product-quality complaints, please contact:
Ganesh Pickles / Sree Ganesh Enterprises
24/388, Double Street, Nurani,
Palakkad, Kerala – 678004, India
Email: nuraniganeshpickles@yahoo.com 
Phone: +91 94479 60265 
Please include your order number whenever contacting us regarding an order.
14. Customer Cooperation
We may request photographs, product labels, batch/lot information, packaging details or other reasonable information to investigate a complaint.
Providing this information helps us identify the product and determine the appropriate remedy.
We will not require a customer to return or dispose of a potentially unsafe food product in a manner that would create a health or safety risk.
15. Consumer Rights
Nothing in this Refund & Cancellation Policy is intended to remove or restrict any rights or remedies available to consumers under applicable Indian law.
Where applicable law provides a consumer with a right to a refund, replacement, repair or other remedy, those rights will continue to apply.
16. Changes to this Policy
We may update this Refund, Return & Cancellation Policy from time to time.
The revised version will be published on the Website with an updated "Last Updated" date.`

const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/

function PolicyLine({ line }) {
  const link = line.match(markdownLinkPattern)

  if (link) {
    const [match, label, href] = link
    const [before, after] = line.split(match)
    return <p>{before}<a className="underline" href={href}>{label}</a>{after}</p>
  }

  return <p>{line || '\u00a0'}</p>
}

export default function RefundPolicyPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Refund, Return & Cancellation Policy | Ganesh Pickles'
    return () => { document.title = previousTitle }
  }, [])

  return (
    <div className="bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <h1 className="mt-3 font-[Georgia,serif] text-3xl font-bold leading-tight text-brand-dark sm:text-4xl md:text-5xl">Refund, Return &amp; Cancellation Policy</h1>
          <p className="mt-4 text-sm text-gray-600"><span className="font-semibold text-gray-800">Last Updated:</span> 13 August 2026</p>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="space-y-3 text-[15px] leading-7 text-gray-700 sm:text-base sm:leading-8">
          {policyText.split('\n').map((line, index) => {
            const isSection = /^\d+\. /.test(line)
            const isSubsection = /^\d+\.\d+ /.test(line)

            if (isSubsection) {
              return <h3 className="pt-3 font-[Georgia,serif] text-lg font-bold text-brand-dark" key={`${index}-${line}`}>{line}</h3>
            }

            return isSection
              ? <h2 className="pt-6 font-[Georgia,serif] text-xl font-bold leading-snug text-brand-dark sm:text-2xl" key={`${index}-${line}`}>{line}</h2>
              : <PolicyLine key={`${index}-${line}`} line={line} />
          })}
        </div>
      </article>
    </div>
  )
}

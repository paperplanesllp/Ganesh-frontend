import PolicyContact from '../components/common/PolicyContact'
import PolicyPageLayout from '../components/common/PolicyPageLayout'

const sections = [
  { title: 'General Return Eligibility', content: <p>Ganesh Pickles sells packaged food products. For hygiene, safety, and quality-control reasons, normal returns and change-of-mind returns are generally not accepted once food products have been delivered. Legitimate order or product issues will still be reviewed under this policy and applicable law.</p> },
  { title: 'Food Safety Restrictions', content: <p>We cannot place returned food back into saleable stock. Do not consume an item if its seal is broken on arrival, the package is leaking or tampered with, or the product appears spoiled or unsafe. Store products according to their labels while a request is reviewed.</p> },
  { title: 'Non-Returnable Products', content: <p>Products are generally non-returnable if opened, partly or fully consumed, used, altered, stored incorrectly, damaged after delivery, or requested for return solely due to personal taste or change of mind. These restrictions do not remove statutory remedies for a verified defect or other rights under applicable Indian law.</p> },
  { title: 'Damaged, Incorrect, Missing, or Defective Orders', content: <p>Contact us if the delivery package or product is damaged, an item is leaking, the wrong item was supplied, an item is missing, or a product appears defective or spoiled. Keep all affected products and packaging until we confirm whether collection or other verification is required.</p> },
  { title: 'Proof Required', content: <p>Provide the order number, issue description, and clear photographs or video showing the product, seal, label, outer packaging, shipping label, and damage or defect where reasonably possible. This helps us assess handling, delivery, and product condition.</p> },
  { title: 'How to Request a Resolution', content: <div><p>Use the contact details below and include your order information and evidence. Do not send a product back without instructions from us, because food-safety requirements and the appropriate resolution may differ by issue.</p><p className="mt-3 font-semibold text-brand-dark">TODO: Confirm the period within which a return-related issue must be reported after delivery.</p></div> },
  { title: 'Replacement or Refund', content: <p>After verification, an eligible issue may be resolved through replacement of the affected item, refund through the original payment method, or another remedy appropriate under applicable law. A replacement depends on product availability and serviceability.</p> },
  { title: 'Requests That May Be Rejected', content: <p>A request may be rejected where the issue cannot reasonably be verified, evidence is inconsistent with the order, the product was improperly handled or stored after delivery, the claim concerns normal product variation, the item was substantially consumed or discarded, or the claim is fraudulent or abusive.</p> },
  { title: 'Contact Information', content: <PolicyContact subject="a return, replacement, or product issue" /> },
]

export default function ReturnPolicyPage() {
  return <PolicyPageLayout title="Return Policy" sections={sections} />
}

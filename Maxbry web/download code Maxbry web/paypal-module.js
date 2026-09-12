/* IDENTIFICADO: BACKEND-CLIENT STUB
   Sin conector PayPal MCP. Director pega PAYPAL_CLIENT_ID.
*/
export const PAYPAL_MODULE = {
  clientId: "REPLACE_PAYPAL_CLIENT_ID",
  currency: "USD",
  waitlistOnly: true,
  plans: [
    { id: "pro", price: 59 },
    { id: "prime-nct", price: 89 },
    { id: "super-yaiwes", price: 100 },
    { id: "avanzado-24-7", price: 189 },
    { id: "business-pro", price: 150 },
    { id: "business-prime", price: 289 },
    { id: "empresa-10", price: 899 },
    { id: "auto-extra", price: 599 },
    { id: "agi-100", price: 100 },
    { id: "agi-300", price: 300 },
    { id: "agi-600", price: 600 },
    { id: "agi-1000", price: 1000 },
    { id: "studio-3000", price: 3000 }
  ],
  renderButton(el, planId) {
    el.innerHTML = `<button class="paypal-stub" data-plan="${planId}">Solicitar cupo · PayPal pending</button>`;
  }
};

/*
 * Henry Montego Homes — site configuration.
 * Everything the owner may need to change without touching the layout lives here.
 */
export const config = {
  // Where enquiries are delivered when the form falls back to the visitor's own email / WhatsApp.
  leadEmail: "info@henrymontegohomes.com",
  whatsappNumber: "2349025441368", // international format, digits only

  // Name used in enquiry messages.
  development: "Montego Skyline II",

  // Enquiry form endpoint. "send.php" (in /public) emails enquiries to leadEmail on any PHP host such as cPanel.
  // If the request fails (for example while running the dev server, which has no PHP), the visitor is offered a
  // pre-filled email or WhatsApp message instead. Set to "" to always use that fallback, or to a form-service URL.
  formEndpoint: "send.php",

  // Existing Tally "register interest" form. When set, every "Register your interest" link opens it.
  // While empty those links scroll to the enquiry form.
  registerInterestUrl: "",
}

export const enquiryTypes = [
  "Purchasing a residence",
  "Investment opportunity",
  "Retail or hospitality space",
  "Workspace",
  "Healthcare or hospitality partnership",
  "Floor plans and brochure",
  "General enquiry",
] as const

export const properties = ["Montego Skyline II", "Other Henry Montego Homes development"] as const

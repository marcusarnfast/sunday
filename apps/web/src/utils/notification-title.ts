export function getTitle(type: string) {
  switch (type) {
    case "invitation":
      return "Invitation";
    case "invitation-response":
      return "Invitation response";
    case "booking":
      return "Booking";
    default:
      return "Notification";
  }
}

export var OrderStatus;
(function (OrderStatus) {
    // When the order has been created, but the
    // ticket it is trying to reserve has not been locked.
    OrderStatus["Created"] = "created";
    // The ticket the order is trying to reserve has already
    // been reserved, or when the user has cancelled the order.
    // The order expires before payment.
    OrderStatus["Cancelled"] = "cancelled";
    // The order has successfully reserved the ticket
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    // The order has reserved the ticket and the user has
    // provided payment successfully.
    OrderStatus["Complete"] = "complete";
})(OrderStatus || (OrderStatus = {}));

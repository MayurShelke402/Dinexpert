// pages/BillSummary.jsx
import { Receipt, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import FloatingCartButton from '../components/CartButton';
import CartModal from '../components/CartModel';

const BillSummary = () => {
  const {
    completedOrders,              // still useful for logging if you want
    getSummaryCompletedOrders,    // NEW helper from store
    getTotalBill,
    clearSession,
  } = useOrderStore();

  const summaryCompletedOrders =
    typeof getSummaryCompletedOrders === 'function'
      ? getSummaryCompletedOrders()
      : completedOrders; // fallback if helper not added

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const subtotal = getTotalBill();
  const gst = subtotal * 0.05;          // 5% GST
  const serviceCharge = subtotal * 0.10;
  const total = subtotal + gst + serviceCharge;

  useEffect(() => {
    console.log('✅ Summary completed orders:', summaryCompletedOrders);
  }, [summaryCompletedOrders]);

  const paymentMethods = [
    { id: 'card', icon: CreditCard, label: 'Card Payment' },
    { id: 'upi', icon: Smartphone, label: 'UPI' },
    { id: 'cash', icon: Wallet, label: 'Cash' },
  ];

  const handlePayment = () => {
    alert(`Processing payment of ₹${total.toFixed(2)} via ${selectedPayment}`);
    clearSession();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Receipt size={32} />
        Bill Summary
      </h1>

      {/* Completed Orders */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Completed Orders</h2>

        {summaryCompletedOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No orders served yet
          </p>
        ) : (
          <div className="space-y-4">
            {summaryCompletedOrders.map((order) => (
              <div
                key={order.orderId || order._id || order.localId}
                className="border-b pb-4 last:border-b-0"
              >
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>
                    Order #
                    {(order.orderId || order._id || order.localId || '')
                      .toString()
                      .slice(-6)}
                  </span>
                  {order.servedAt && (
                    <span>
                      {new Date(order.servedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                {order.items?.map((item) => (
                  <div
                    key={item.cartId || item._id}
                    className="flex justify-between py-1"
                  >
                    <span className="text-gray-700">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      ₹{(item.price || 0) * (item.quantity || 0)}
                    </span>
                  </div>
                ))}

                {/* Optional: show how status is interpreted */}
                {order.summaryStatus && (
                  <div className="mt-1 text-xs text-green-600 font-medium">
                    {order.summaryStatus === 'completed'
                      ? 'Completed'
                      : order.summaryStatus}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bill Breakdown */}
      {summaryCompletedOrders.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Charge (10%)</span>
                <span>₹{serviceCharge.toFixed(2)}</span>
              </div>

              <div className="border-t-2 pt-3 flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-bold text-orange-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          {!showPayment ? (
            <button
              onClick={() => setShowPayment(true)}
              className="w-full bg-orange-500 text-white py-4 rounded-lg text-lg font-semibold
                hover:bg-orange-600 transition-colors shadow-lg"
            >
              Proceed to Payment
            </button>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                Select Payment Method
              </h3>

              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 
                      transition-all ${
                        selectedPayment === method.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <method.icon size={24} className="text-gray-600" />
                    <span className="font-medium">{method.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedPayment}
                className="w-full bg-green-500 text-white py-4 rounded-lg text-lg font-semibold
                  hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Pay ₹{total.toFixed(2)}
              </button>
            </div>
          )}
        </>
      )}

      <FloatingCartButton onClick={() => setIsCartOpen(true)} />

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default BillSummary;

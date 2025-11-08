import { FiX, FiCheckCircle, FiDownload } from 'react-icons/fi';

function ReceiptModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Order Confirmed!</h2>
                <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 bg-green-50 border-b">
            <p className="text-green-800 font-medium">
              Thank you for your order! A confirmation email has been sent to{' '}
              <span className="font-semibold">{order.customerInfo.email}</span>
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Order Date</p>
                <p className="font-semibold">{formatDate(order.timestamp)}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Status</p>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                  {order.status}
                </span>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>{' '}
                  <span className="font-medium">{order.customerInfo.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>{' '}
                  <span className="font-medium">{order.customerInfo.email}</span>
                </div>
                {order.customerInfo.phone && (
                  <div>
                    <span className="text-gray-500">Phone:</span>{' '}
                    <span className="font-medium">{order.customerInfo.phone}</span>
                  </div>
                )}
                {order.customerInfo.address && (
                  <div>
                    <span className="text-gray-500">Address:</span>{' '}
                    <span className="font-medium">{order.customerInfo.address}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        ${item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Paid:</span>
                <span className="text-blue-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>What's Next?</strong> Your order is being processed. 
                You'll receive shipping updates at {order.customerInfo.email}. 
                Track your order using #{order.orderNumber}
              </p>
            </div>
          </div>
          <div className="p-6 border-t flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Download Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReceiptModal;
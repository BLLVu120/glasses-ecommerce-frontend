import { CheckoutStepper } from '../components/CheckoutStepper';
import { PaymentForm } from '../components/PaymentForm';
import { ShippingForm } from '../components/ShippingForm';
import { ReviewOrder } from '../components/ReviewOrder';
import { OrderSummary } from '../components/OrderSummary';
import { useCheckoutFlow } from '../store/useCheckoutFlow';

export default function CheckoutPage() {
  // Logic đã được tách biệt hoàn toàn
  const { step, setStep, handleContinue, handleBack } = useCheckoutFlow();

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cột trái */}
          <div className="lg:col-span-7 xl:col-span-8">
            <CheckoutStepper currentStep={step} />

            <div className="min-h-[400px]">
              {step === 1 && <ShippingForm />}
              {step === 2 && <PaymentForm />}
              {step === 3 && <ReviewOrder onEdit={setStep} />}
            </div>
          </div>

          {/* Cột phải */}
          <div className="lg:col-span-5 xl:col-span-4">
            <OrderSummary step={step} onContinue={handleContinue} onBack={handleBack} />
          </div>
        </div>
      </div>
    </div>
  );
}

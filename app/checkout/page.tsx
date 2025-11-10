'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { AddressForm } from '@/components/checkout/address-form';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { AddressService, Address, CreateAddressPayload } from '@/lib/services/address-service';
import { formatPrice } from '@/lib/utils/format-price';
import { toast } from 'sonner';
import { Check, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal } = useCart();
  const { isAuthenticated } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Redirect if cart is empty
    if (!cart || cart.items.length === 0) {
      router.push('/cart');
      return;
    }

    if (isAuthenticated) {
      loadAddresses();
    } else {
      setIsLoading(false);
      // Guest checkout - show address form by default
      setShowAddressForm(true);
    }
  }, [isAuthenticated, cart]);

  const loadAddresses = async () => {
    try {
      const data = await AddressService.getAddresses();
      setAddresses(data);

      // Auto-select default address
      const defaultAddress = data.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async (addressData: CreateAddressPayload) => {
    setIsSaving(true);
    try {
      const result = await AddressService.createAddress(addressData);

      if (result.success && result.address) {
        toast.success('Address saved');
        setAddresses((prev) => [...prev, result.address!]);
        setSelectedAddressId(result.address.id);
        setShowAddressForm(false);
      } else {
        toast.error(result.message || 'Failed to save address');
      }
    } catch (error) {
      toast.error('Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinue = () => {
    if (!selectedAddressId) {
      toast.error('Please select or add a shipping address');
      return;
    }

    // Store selected address in sessionStorage for next step
    sessionStorage.setItem('checkout_address_id', selectedAddressId.toString());
    router.push('/checkout/payment');
  };

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1">
        {/* Progress Bar */}
        <div className="border-b-2 border-white/10 bg-zinc-950">
          <div className="container mx-auto max-w-4xl px-4 py-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2" />
              <div className="absolute top-1/2 left-0 h-0.5 bg-white w-0 -translate-y-1/2" style={{width: '0%'}} />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">
                  1
                </div>
                <span className="mt-2 text-xs font-bold uppercase text-white">Shipping</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center font-bold border-2 border-white/10">
                  2
                </div>
                <span className="mt-2 text-xs font-bold uppercase text-zinc-500">Payment</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center font-bold border-2 border-white/10">
                  3
                </div>
                <span className="mt-2 text-xs font-bold uppercase text-zinc-500">Confirm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-8">
            Shipping Address
          </h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-2 border-white border-r-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Saved Addresses */}
              {addresses.length > 0 && !showAddressForm && (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <button
                      key={address.id}
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`w-full text-left p-6 border-2 transition-colors ${
                        selectedAddressId === address.id
                          ? 'border-white bg-white/5'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-bold uppercase text-white text-sm">
                              {address.label || 'Address'}
                            </p>
                            {address.isDefault && (
                              <span className="px-2 py-0.5 bg-white/10 text-white text-xs font-bold uppercase">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-400 text-sm">
                            {address.fullName}
                            <br />
                            {address.addressLine1}
                            {address.addressLine2 && (
                              <>
                                <br />
                                {address.addressLine2}
                              </>
                            )}
                            <br />
                            {address.city}, {address.state} {address.postalCode}
                            <br />
                            {address.phoneNumber}
                          </p>
                        </div>

                        {selectedAddressId === address.id && (
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                            <Check className="h-4 w-4 text-black" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}

                  {!showAddressForm && (
                    <Button
                      variant="outline"
                      onClick={() => setShowAddressForm(true)}
                      className="w-full h-12 border-2 border-white/20 text-white hover:border-white hover:bg-white/5 font-bold uppercase"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Address
                    </Button>
                  )}
                </div>
              )}

              {/* New Address Form */}
              {showAddressForm && (
                <div className="border-2 border-white/10 bg-zinc-950 p-6">
                  <h2 className="text-xl font-bold uppercase text-white mb-6">
                    {addresses.length > 0 ? 'Add New Address' : 'Enter Shipping Address'}
                  </h2>

                  <AddressForm
                    onSubmit={handleSaveAddress}
                    onCancel={() => {
                      if (addresses.length > 0) {
                        setShowAddressForm(false);
                      }
                    }}
                    isLoading={isSaving}
                  />
                </div>
              )}

              {/* Order Summary */}
              <div className="border-2 border-white/10 bg-zinc-950 p-6">
                <h2 className="text-lg font-bold uppercase text-white mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal ({cart.totalItems} items)</span>
                    <span className="font-bold text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="font-bold text-white">Calculated at next step</span>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 h-14 border-2 border-white/20 text-white hover:border-white hover:bg-white/5 font-bold uppercase"
                >
                  <Link href="/cart">Back to Cart</Link>
                </Button>

                <Button
                  onClick={handleContinue}
                  disabled={!selectedAddressId}
                  className="flex-1 h-14 bg-white text-black hover:bg-zinc-200 font-black uppercase disabled:opacity-50"
                >
                  Continue to Payment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

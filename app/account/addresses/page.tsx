'use client';

import { useState, useEffect } from 'react';
import { AddressService, Address, CreateAddressPayload } from '@/lib/services/address-service';
import { AddressForm } from '@/components/checkout/address-form';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await AddressService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      toast.error('Failed to load addresses');
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
        setShowForm(false);
      } else {
        toast.error(result.message || 'Failed to save address');
      }
    } catch (error) {
      toast.error('Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    setDeletingId(addressId);

    try {
      const result = await AddressService.deleteAddress(addressId);

      if (result.success) {
        toast.success('Address deleted');
        setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      } else {
        toast.error(result.message || 'Failed to delete address');
      }
    } catch (error) {
      toast.error('Failed to delete address');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      const result = await AddressService.setDefaultAddress(addressId);

      if (result.success) {
        toast.success('Default address updated');
        await loadAddresses();
      } else {
        toast.error(result.message || 'Failed to update default address');
      }
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 border-2 border-white border-r-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase text-white mb-1">Saved Addresses</h2>
          <p className="text-zinc-500 text-sm">
            {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'}
          </p>
        </div>

        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-white text-black hover:bg-zinc-200 font-bold uppercase"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Address
          </Button>
        )}
      </div>

      {/* New Address Form */}
      {showForm && (
        <div className="border-2 border-white/10 bg-zinc-950 p-6">
          <h3 className="text-lg font-bold uppercase text-white mb-6">Add New Address</h3>

          <AddressForm
            onSubmit={handleSaveAddress}
            onCancel={() => setShowForm(false)}
            isLoading={isSaving}
          />
        </div>
      )}

      {/* Addresses List */}
      {addresses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-white/10">
          <MapPin className="h-16 w-16 text-zinc-700 mb-4" />
          <h3 className="text-xl font-black uppercase text-zinc-500 mb-2">
            No Addresses Saved
          </h3>
          <p className="text-zinc-600 mb-6">Add an address for faster checkout</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border-2 border-white/10 bg-zinc-950 p-6 relative group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-white" />
                  <p className="font-bold uppercase text-white text-sm">
                    {address.label || 'Address'}
                  </p>
                </div>

                {address.isDefault && (
                  <span className="px-2 py-1 bg-white/10 text-white text-xs font-bold uppercase flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Default
                  </span>
                )}
              </div>

              <div className="text-zinc-400 text-sm space-y-1 mb-6">
                <p className="text-white font-bold">{address.fullName}</p>
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.phoneNumber}</p>
              </div>

              <div className="flex gap-2">
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    className="flex-1 border-white/20 text-white hover:border-white hover:bg-white/5 font-bold uppercase text-xs"
                  >
                    Set as Default
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteAddress(address.id)}
                  disabled={deletingId === address.id}
                  className="border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-bold uppercase text-xs"
                >
                  {deletingId === address.id ? (
                    'Deleting...'
                  ) : (
                    <>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

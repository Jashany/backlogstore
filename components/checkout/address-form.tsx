'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateAddressPayload } from '@/lib/services/address-service';

interface AddressFormProps {
  onSubmit: (address: CreateAddressPayload) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AddressForm({ onSubmit, onCancel, isLoading }: AddressFormProps) {
  const [formData, setFormData] = useState<CreateAddressPayload>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phoneNumber: '',
    label: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName" className="text-white uppercase text-xs font-bold">
            Full Name *
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="mt-2 bg-zinc-900 border-white/20 text-white"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber" className="text-white uppercase text-xs font-bold">
            Phone Number *
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="mt-2 bg-zinc-900 border-white/20 text-white"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="addressLine1" className="text-white uppercase text-xs font-bold">
          Address Line 1 *
        </Label>
        <Input
          id="addressLine1"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          required
          className="mt-2 bg-zinc-900 border-white/20 text-white"
        />
      </div>

      <div>
        <Label htmlFor="addressLine2" className="text-white uppercase text-xs font-bold">
          Address Line 2
        </Label>
        <Input
          id="addressLine2"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          className="mt-2 bg-zinc-900 border-white/20 text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city" className="text-white uppercase text-xs font-bold">
            City *
          </Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="mt-2 bg-zinc-900 border-white/20 text-white"
          />
        </div>

        <div>
          <Label htmlFor="state" className="text-white uppercase text-xs font-bold">
            State *
          </Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="mt-2 bg-zinc-900 border-white/20 text-white"
          />
        </div>

        <div>
          <Label htmlFor="postalCode" className="text-white uppercase text-xs font-bold">
            Postal Code *
          </Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            className="mt-2 bg-zinc-900 border-white/20 text-white"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="label" className="text-white uppercase text-xs font-bold">
          Save as (optional)
        </Label>
        <Input
          id="label"
          name="label"
          placeholder="e.g., Home, Work"
          value={formData.label}
          onChange={handleChange}
          className="mt-2 bg-zinc-900 border-white/20 text-white"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 font-bold uppercase"
        >
          {isLoading ? 'Saving...' : 'Save Address'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 h-12 border-2 border-white/20 text-white hover:border-white hover:bg-white/5 font-bold uppercase"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

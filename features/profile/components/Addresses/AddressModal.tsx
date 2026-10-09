'use client';

import AddressAutoComplete from "@/features/profile/components/Addresses/AddressAutoComplete";


// Dynamically import the address modal content with SSR disabled

interface AddressFormState {
  country_id: string;
  region_id: string;
  address: string;
  is_default: boolean;
  latitude: string;
  longitude: string;
  title: string;
}

interface AddressModalProps {
  refetch: () => void;
  noAddress?: boolean;
}

const initialFormState: AddressFormState = {
  country_id: "",
  region_id: "",
  address: "",
  is_default: false,
  latitude: "",
  longitude: "",
  title: "",
};

const AddressModal: React.FC<AddressModalProps> = ({ refetch, noAddress = false }) => {
  // Component logic here
  
  return (
    <AddressAutoComplete
      id="location"
      refetch={refetch}
      noAddress={noAddress}
      isEdit={false}
      oldData={{}}
    />
  );
};

export default AddressModal;

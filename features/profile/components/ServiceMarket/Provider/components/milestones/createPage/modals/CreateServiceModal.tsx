import React from "react";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectFiled";
import useFormData from "@/lib/Hooks/useFormData";

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (service: any) => void;
  categoryOptions: { id: string; name: string }[];
}

const CreateServiceModal: React.FC<CreateServiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddService, 
  categoryOptions 
}) => {
  const { formData, handleChange, errors, handleAddError } = useFormData({
    serviceName: "",
    category: "",
    duration: "",
    budget: "",
    revision: "",
    description: "",
  });

  const handleCreate = () => {
    onAddService(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      id="create-service-modal"
      isOpen={isOpen}
      onClose={handleCancel}
      showCloseButton={false}
      showLine={false}
      className="!rounded-[24px] bg-white relative overflow-y-auto custom-scrollbar" 
      padding="px-4"
      style={{ maxWidth: "1200px",maxHeight:"95vh", zIndex: 9999 }}
    >
      <div className="flex flex-col  w-full">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-blueSite rounded-full"></div>
            <h2 className="text-[22px] md:text-[24px] 2xl:text-[28px] font-bold text-subTitleColor m-0">
              Create New Service
            </h2>
          </div>
          <p className="text-gray-500 text-sm md:text-base">
            Combining multiple services into a single package that the user can call as one block
          </p>
        </div>

        {/* Form Body */}
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Left Column */}
          <div className="flex flex-col gap-6 flex-1">
            <InputField
              id="serviceName"
              label="Services Title"
              placeholder="Write the title of your Package that customers will see......"
              value={formData.serviceName}
              onChange={handleChange("serviceName")}
              formErrors={errors}
              handleAddError={handleAddError}
              unstyled
              withFieldset
            />
            <SelectField
              id="category"
              label="Categories"
              placeholder="Choose a method for delivering the work to the client."
              selectorOptions={categoryOptions}
              value={formData.category}
              onChange={handleChange("category")}
              formErrors={errors}
              handleAddError={handleAddError}
              unstyled
              withFieldset
            />
            <InputField
              id="duration"
              label="Duration"
              placeholder="Determine the number of days you need to complete the required work."
              value={formData.duration}
              onChange={handleChange("duration")}
              formErrors={errors}
              handleAddError={handleAddError}
              unstyled
              withFieldset
            />
            <InputField
              id="budget"
              label="Budget"
              placeholder="Determine the number of days you need to complete the required work."
              value={formData.budget}
              onChange={handleChange("budget")}
              formErrors={errors}
              handleAddError={handleAddError}
              unstyled
              withFieldset
            />
            <InputField
              id="revision"
              label="Revision Windows"
              placeholder="Determine the number of days you need to complete the required work."
              value={formData.revision}
              onChange={handleChange("revision")}
              formErrors={errors}
              handleAddError={handleAddError}
              unstyled
              withFieldset
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col flex-1">
            <div className="h-[430px]">
              <InputField
                id="description"
                label="Description"
                type="textarea"
                placeholder="Describe your process, tools used, and exactly what the client will receive"
                value={formData.description}
                onChange={handleChange("description")}
                formErrors={errors}
                handleAddError={handleAddError}
                unstyled
                withFieldset          
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6 mt-8">
          <button 
            onClick={handleCreate}
            className="bg-blueSite text-white px-8 py-3 rounded-lg hover:bg-[#005240] transition-colors font-medium text-[20px]"
          >
            Create Services
          </button>
          <button
            onClick={handleCancel}
            className="text-blueSite font-bold hover:opacity-80 transition-opacity text-[20px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateServiceModal;


import { Category } from "../../types/category";
import TransModal from "../transaction/TransModal";

interface Props {
  open: boolean;
  loading: boolean;
  form: any;
  categories: Category[];
  onChange: (field: string, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function EditTransactionModal({
  open,
  loading,
  form,
  categories,
  onChange,
  onClose,
  onSubmit,
}: Props) {
  return (
    <TransModal
      open={open}
      loading={loading}
      form={form}
      categories={categories}
      onChange={onChange}
      onClose={onClose}
      onSubmit={onSubmit}
      isEdit={true}
    />
  );
}

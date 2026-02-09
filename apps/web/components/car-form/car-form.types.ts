export type CarFormProps = {
  className?: string;
  mode: "create" | "edit";
  defaultValues?: {
    slug?: string | null;
    year?: number | null;
    dailyRate?: string | null;
  };
};

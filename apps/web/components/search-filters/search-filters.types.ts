import type { Brand } from "@/actions/brands";
import type { BodyType } from "@/actions/body-types";
import type { Provider } from "@/actions/providers";

export type SearchFiltersProps = {
  className?: string;
  providers: Provider[];
  brands: Brand[];
  bodyTypes: BodyType[];
};

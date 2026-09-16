import { revalidatePath, revalidateTag } from "next/cache";

/** Bust homepage featured grid after inventory changes. */
export function revalidateHomeFeatured(): void {
  revalidateTag("featured-vehicles", "max");
  revalidatePath("/");
}

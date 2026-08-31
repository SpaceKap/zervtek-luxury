import { prisma } from "@/lib/prisma";
import { deleteVehicleImageTree } from "@/lib/vehicle-images";

/** Remove vehicle row, related records, and on-disk images. */
export async function deleteVehicleById(id: string): Promise<void> {
  await prisma.inquiry.deleteMany({ where: { vehicleId: id } });
  await prisma.availabilityCheck.deleteMany({ where: { vehicleId: id } });
  await prisma.vehicleImage.deleteMany({ where: { vehicleId: id } });
  await prisma.vehicle.delete({ where: { id } });
  await deleteVehicleImageTree(id);
}

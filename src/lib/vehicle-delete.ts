import { prisma } from "@/lib/prisma";
import {
  collectStoredImagePaths,
  deleteVehicleImageFiles,
  deleteVehicleImageTree,
} from "@/lib/vehicle-images";

/** Remove vehicle row, related records, and on-disk images. */
export async function deleteVehicleById(id: string): Promise<void> {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { media: true },
  });
  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const filePaths = collectStoredImagePaths(vehicle.media, vehicle.images);

  await prisma.inquiry.deleteMany({ where: { vehicleId: id } });
  await prisma.availabilityCheck.deleteMany({ where: { vehicleId: id } });
  await prisma.vehicleImage.deleteMany({ where: { vehicleId: id } });
  await prisma.vehicle.delete({ where: { id } });

  await deleteVehicleImageFiles(filePaths);
  await deleteVehicleImageTree(id);
}

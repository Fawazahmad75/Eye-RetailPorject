import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash("demo1234", 10);
  const owner = await prisma.user.upsert({
    where: { email: "owner@shelfwatch.demo" },
    update: {},
    create: {
      name: "Demo Owner",
      email: "owner@shelfwatch.demo",
      password: hashedPassword,
      role: "OWNER",
    },
  });

  // Create demo store
  const store = await prisma.store.upsert({
    where: { id: "demo-store-1" },
    update: {},
    create: {
      id: "demo-store-1",
      name: "Downtown Grocery",
      address: "123 Main Street, Suite 100",
      ownerId: owner.id,
    },
  });

  // Create cameras
  const cam1 = await prisma.camera.upsert({
    where: { id: "demo-cam-1" },
    update: {},
    create: {
      id: "demo-cam-1",
      name: "Aisle 1 - Beverages",
      location: "Aisle 1, Left Side",
      storeId: store.id,
      isActive: true,
    },
  });

  const cam2 = await prisma.camera.upsert({
    where: { id: "demo-cam-2" },
    update: {},
    create: {
      id: "demo-cam-2",
      name: "Aisle 3 - Snacks",
      location: "Aisle 3, Right Side",
      storeId: store.id,
      isActive: true,
    },
  });

  // Create sample alerts
  const alerts = [
    {
      cameraId: cam1.id,
      storeId: store.id,
      type: "EMPTY_SHELF",
      severity: "HIGH",
      status: "NEW",
      detections: JSON.stringify([
        { x: 120, y: 80, width: 200, height: 150, class: "empty_shelf", confidence: 0.92 },
      ]),
    },
    {
      cameraId: cam1.id,
      storeId: store.id,
      type: "LOW_STOCK",
      severity: "MEDIUM",
      status: "NEW",
      detections: JSON.stringify([
        { x: 300, y: 100, width: 180, height: 120, class: "empty_shelf", confidence: 0.78 },
      ]),
    },
    {
      cameraId: cam2.id,
      storeId: store.id,
      type: "EMPTY_SHELF",
      severity: "HIGH",
      status: "ACKNOWLEDGED",
      detections: JSON.stringify([
        { x: 50, y: 200, width: 250, height: 100, class: "empty_shelf", confidence: 0.95 },
      ]),
    },
    {
      cameraId: cam2.id,
      storeId: store.id,
      type: "EMPTY_SHELF",
      severity: "LOW",
      status: "RESOLVED",
      detections: JSON.stringify([
        { x: 400, y: 150, width: 100, height: 80, class: "empty_shelf", confidence: 0.65 },
      ]),
      resolvedAt: new Date(),
    },
    {
      cameraId: cam1.id,
      storeId: store.id,
      type: "LOW_STOCK",
      severity: "MEDIUM",
      status: "NEW",
      detections: JSON.stringify([
        { x: 200, y: 300, width: 160, height: 140, class: "empty_shelf", confidence: 0.82 },
      ]),
    },
  ];

  for (const alert of alerts) {
    await prisma.alert.create({ data: alert });
  }

  console.log("✅ Seed data created successfully!");
  console.log(`   Owner: ${owner.email} / demo1234`);
  console.log(`   Store: ${store.name}`);
  console.log(`   Cameras: ${cam1.name}, ${cam2.name}`);
  console.log(`   Alerts: ${alerts.length} sample alerts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

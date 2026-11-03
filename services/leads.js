import "server-only";
import { prisma } from "@/lib/db";

export async function createLead(data) {
  return prisma.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      subject: data.subject || "",
      message: data.message,
      type: data.type || "contact",
      status: "NEW",
    },
  });
}

export async function listLeads({ status } = {}) {
  return prisma.lead.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export async function leadCounts() {
  const [total, fresh] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
  ]);
  return { total, fresh };
}

export async function setLeadStatus(id, status) {
  return prisma.lead.update({ where: { id: Number(id) }, data: { status } });
}

export async function deleteLead(id) {
  return prisma.lead.delete({ where: { id: Number(id) } });
}
